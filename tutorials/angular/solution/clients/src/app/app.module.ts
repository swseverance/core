import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from './data.service';

import { Glue42Ng } from "@glue42/ng";
import GlueWebPlatform, { Glue42WebPlatform } from "@glue42/web-platform";
import { GlueService } from './glue.service';
import { ChannelSelectModule } from './channel-select/channel-select.module';

const config: Glue42WebPlatform.Config = {
  channels: {
    definitions: [
      {
        name: "Red",
        meta: {
          color: "red"
        }
      },
      {
        name: "Green",
        meta: {
          color: "green"
        }
      },
      {
        name: "Blue",
        meta: {
          color: "#66ABFF"
        }
      },
      {
        name: "Pink",
        meta: {
          color: "#F328BB"
        }
      },
      {
        name: "Yellow",
        meta: {
          color: "#FFE733"
        }
      },
      {
        name: "Dark Yellow",
        meta: {
          color: "#b09b00"
        }
      },
      {
        name: "Orange",
        meta: {
          color: "#fa5a28"
        }
      },
      {
        name: "Purple",
        meta: {
          color: "#c873ff"
        }
      },
      {
        name: "Lime",
        meta: {
          color: "#8af59e"
        }
      },
      {
        name: "Cyan",
        meta: {
          color: "#80f3ff"
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
    Glue42Ng.forRoot({ webPlatform: { factory: GlueWebPlatform, config } }),
    ChannelSelectModule
  ],
  providers: [DataService, GlueService],
  bootstrap: [AppComponent]
})
export class AppModule { }
