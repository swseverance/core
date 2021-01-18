import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DataService } from '../../../../shared/data/data.service';
import { Stock, ClientBasicInfo, Client } from '../../../../shared/interfaces/ng-interfaces';
import { GlueService } from '../../../../shared/data/glue.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Portfolio';
  public portfolioEntries: Array<{ stock: Stock, quantity?: number }> = [];
  public clientBasicInfo: ClientBasicInfo;
  public hasSelectedStock = false;
  public hasSelectedClient = false;
  public selectedInstrument: { stock: Stock, quantity?: number };
  public selectedInstrumentChartOptions: any;
  public inWorkspace: boolean = false;
  private selectedClient: Client;
  private globalUnsubscribe: () => void;
  private contextId: string;

  constructor(private readonly dataService: DataService, private readonly glueService: GlueService, private ref: ChangeDetectorRef) { }

  public async ngOnInit(): Promise<void> {
    this.inWorkspace = await this.glueService.isInWorkspace();

    this.glueService.setUpContextRetrieval((ctx) => {
      this.handleIncomingClient(ctx);
    })
      .then((setUpData) => {
        this.contextId = setUpData.contextId;
        this.globalUnsubscribe = setUpData.globalUnsubscribe;
      })

    await this.glueService.setMyWorkspaceId();
  }

  public ngOnDestroy(): void {
    if (this.globalUnsubscribe) {
      this.globalUnsubscribe();
    }
  }

  public async handleStockSelect(stock: Stock) {
    if (!this.hasSelectedStock || this.selectedInstrument.stock.symbol !== stock.symbol) {
      // select
      await this.glueService.updateAllWorkspaceWindowsContext({ client: this.selectedClient, selectedStockSymbol: stock.symbol });
      this.selectedInstrument = this.portfolioEntries.find((entry) => entry.stock.symbol === stock.symbol);
      // chart options
      this.selectedInstrumentChartOptions = this.getCharOptions(stock);
      this.hasSelectedStock = true;
      return;
    }

    // deselect
    await this.glueService.updateAllWorkspaceWindowsContext({ client: this.selectedClient, selectedStockSymbol: null });
    this.hasSelectedStock = false;
    delete this.selectedInstrument;
  }

  public calculateClientStockBalance(instrument: { stock: Stock, quantity?: number }): string {
    return (instrument.quantity * instrument.stock.lastPrices[instrument.stock.lastPrices.length - 1]).toFixed(2);
  }

  public calculateStockPercentageChange(stock: Stock): string {
    const currentPrice = stock.lastPrices[stock.lastPrices.length - 1];
    return ((currentPrice - stock.lastClosePrice) / stock.lastClosePrice * 100).toFixed(2);
  }

  public async openClientTransactions() {

    const inWsp = await this.glueService.isInWorkspace();

    if (!inWsp) {
      await this.glueService.openWindow(`Transactions-${this.selectedClient}`, '/transactions/index.html', { client: this.selectedClient });
      return;
    }

    await this.glueService.addTransactionsToWorkspace(this.contextId);
  }

  public clientImageSrc(): string {
    return `/common/images/${this.clientBasicInfo.image}`;
  }

  public async bringBackToWorkspace() {
    console.log("fetching context");
    const context = await this.glueService.getMyWindowContext();
    console.log("context is:");
    console.log(context);
    await this.glueService.bringBackToWorkspace(context.workspaceId);
    console.log("all done, closing me");
    this.glueService.closeMe();
  }

  private getCharOptions(stock: Stock): any {
    const isPriceRising = stock.lastPrices[stock.lastPrices.length - 1] >= stock.lastClosePrice;
    return {
      chart: {
        height: '250px',
        width: '100%',
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: false
        }
      },
      tooltip: {
        enabled: false
      },
      markers: {
        size: 0
      },
      stroke: {
        show: true,
        curve: 'smooth',
        colors: [isPriceRising ? '#0CA2E9' : '#FA6D67'],
        width: 3,
      },
      fill: {
        type: 'gradient',
        colors: [isPriceRising ? '#0CA2E9' : '#FA6D67'],
        gradient: {
          type: 'vertical',
          opacityFrom: .5,
          opacityTo: 0,
          stops: [0, 100],
          colorStops: []
        }
      },
      grid: {
        show: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        strokeDashArray: 10,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      series: [
        {
          name: stock.name,
          data: stock.lastPrices,
          colors: [isPriceRising ? '#0CA2E9' : '#FA6D67']
        }
      ],
      dataLabels: {
        enabled: false
      },
      yaxis: {
        show: true,
        labels: {
          show: true,
          offsetX: -5,
          rotate: -90,
          style: {
            color: 'rgba(255, 255, 255, 0.25)'
          }
        }
      },
      xaxis: {
        categories: [
          '',
          '1d',
          '',
          '1w',
          '',
          '1m',
          '',
          '1y',
          '',
        ],
        labels: {
          show: true,
          offsetY: 5,
          style: {
            colors: 'rgba(255, 255, 255, 0.25)'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        tooltip: {
          enabled: false
        },
        logarithmic: false
      }
    };
  }

  private async handleIncomingClient(context: { client?: Client }) {

    if (context?.client) {
      this.selectedClient = context.client;
      [this.clientBasicInfo, this.portfolioEntries] = await Promise.all([
        await this.dataService.getClientBasicInfo(this.selectedClient.id),
        this.dataService.getClientPortfolio(this.selectedClient.id)
      ]);

      this.hasSelectedClient = true;
      this.ref.detectChanges();
      await this.glueService.setMyTitle(`Portfolio - ${this.clientBasicInfo.firstName} ${this.clientBasicInfo.lastName}`);
      return;
    }
  }

}
