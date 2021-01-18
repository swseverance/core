import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DataModule } from '../../../../shared/data/data.module';
import { ComponentsModule } from '../../../../shared/components/components.module';
import { ClickOutsideModule } from 'ng-click-outside';

import { Glue42Ng } from "@glue42/ng";
import GlueWebPlatform, { Glue42WebPlatform } from "@glue42/web-platform";
import GlueWorkspaces from "@glue42/workspaces-api";

const config: Glue42WebPlatform.Config = {
  glue: {
    libraries: [GlueWorkspaces],
    systemLogger: {
      level: "warn"
    }
  },
  gateway: {
    logging: { level: "warn" }
  },
  workspaces: {
    src: "/workspaces"
  },
  applications: {
    local: [
      {
        name: "clients",
        type: "window",
        details: {
          url: "/clients"
        }
      },
      {
        name: "news",
        type: "window",
        details: {
          url: "/news"
        }
      },
      {
        name: "portfolio",
        type: "window",
        details: {
          url: "/portfolio"
        }
      },
      {
        name: "transactions",
        type: "window",
        details: {
          url: "/transactions"
        }
      }
    ]
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    Glue42Ng.forRoot({ webPlatform: { factory: GlueWebPlatform, config: config } }),
    DataModule.forRoot(),
    ComponentsModule,
    ClickOutsideModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
