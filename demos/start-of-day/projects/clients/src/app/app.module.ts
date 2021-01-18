import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { DataModule } from '../../../../shared/data/data.module';
import { ComponentsModule } from '../../../../shared/components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { Glue42Ng } from "@glue42/ng";
import GlueWeb from "@glue42/web";
import GlueWorkspaces from "@glue42/workspaces-api";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    DataModule.forRoot(),
    Glue42Ng.forRoot({ web: { factory: GlueWeb, config: { libraries: [GlueWorkspaces], systemLogger: { level: "warn" } } } }),
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
