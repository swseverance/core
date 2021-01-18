import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/data/data.service';
import { Client, News, Stock, AllData } from '../../../../shared/interfaces/ng-interfaces';
import { GlueService } from '../../../../shared/data/glue.service';
import { Glue42Workspaces } from '@glue42/workspaces-api';
import shortid from 'shortid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'ng-welcome';
  public clients: Client[];
  public news: News[];
  public stocks: Stock[];
  public workspaceReuse = true;
  public showSettings = false;
  public selectedStockSymbol: string;
  public showAll = false;
  private allData: AllData;

  constructor(private readonly dataService: DataService, private readonly glueService: GlueService) { }

  public async ngOnInit(): Promise<void> {
    this.showAll = !!(window as any).SharedWorker;

    if (!this.showAll) {
      return;
    }

    this.allData = await this.dataService.getAllData();
    this.clients = this.allData.clients;
    this.news = this.getSortedAllNews();
    this.stocks = this.allData.stocks;
    console.log(this.glueService.glue.version);
  }

  public async handleClientSelect(client?: Client) {
    const isClientWorkspaceOpen = await this.glueService.isClientWorkspaceOpen();

    if (!this.workspaceReuse || !isClientWorkspaceOpen) {

      await this.openClientWorkspace({ client, selectedStockSymbol: null }, true);
      return;
    }

    const lastFrame = await this.glueService.focusLastFrame();
    const workspace = await this.glueService.getLastWorkspaceInFrame(lastFrame.id);

    await this.glueService.updateAllWorkspaceWindowsContext({ client, selectedStockSymbol: null }, workspace);
  }

  public async openBlankClientApp() {
    await this.openClientWorkspace({ client: null, selectedStockSymbol: null });
  }

  public toggleShowSettings() {
    this.showSettings = !this.showSettings;
  }

  public onClickedOutside(e: Event) {

    const className = e?.target && (e.target as HTMLTextAreaElement).className;

    if (className && className.includes('icon-cog')) {
      return;
    }

    this.showSettings = false;
  }

  public async handleStockSelect(stock: Stock) {
    if (!this.selectedStockSymbol || this.selectedStockSymbol !== stock.symbol) {
      // select
      this.news = this.getSortedAllNews().filter((n) => n.relatedTo.stockSymbols.includes(stock.symbol));
      this.selectedStockSymbol = stock.symbol;
      return;
    }

    // deselect
    this.news = this.getSortedAllNews();
    delete this.selectedStockSymbol;
  }

  private async openClientWorkspace(context: any, addPortfolio?: boolean): Promise<void> {
    let contextId = shortid();
    await this.glueService.setContext(contextId, { ...context, contextId });

    const builderConfig: Glue42Workspaces.BuilderConfig = {
      type: "workspace"
    };

    const builder = this.glueService.getWorkspaceBuilder(builderConfig);

    const topRow = builder.addRow();
    topRow.addGroup().addWindow({ appName: "clients", context: { contextId } });

    const innerColumn = topRow.addColumn();

    if (addPortfolio) {
      innerColumn.addGroup().addWindow({ appName: "portfolio", context: { contextId } });
    }

    innerColumn.addGroup().addWindow({ appName: "news", context: { contextId } });

    await builder.create();
  }

  private getSortedAllNews() {
    return this.allData.news.sort((a, b) => {
      const aTime = a.elapsedTime.value * this.convertPeriod(a.elapsedTime.period);
      const bTime = b.elapsedTime.value * this.convertPeriod(b.elapsedTime.period);
      return aTime - bTime;
    });
  }

  private convertPeriod(period: 'h' | 'd' | 'w'): number {
    return period === 'h' ? 1 :
      period === 'd' ? 24 : 168;
  }
}
