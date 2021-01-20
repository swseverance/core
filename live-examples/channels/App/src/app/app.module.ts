import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Glue42Ng } from '@glue42/ng';
import GlueWebPlatform from '@glue42/web-platform';
import { GlueService } from './glue.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';

const config = {
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
        name: "DarkYellow",
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
    Glue42Ng.forRoot({ webPlatform: { factory: GlueWebPlatform, config } }),
    BrowserAnimationsModule,
    MatSelectModule
  ],
  providers: [GlueService],
  bootstrap: [AppComponent]
})
export class AppModule { }
