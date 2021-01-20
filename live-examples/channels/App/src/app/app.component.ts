import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
import { GlueService } from './glue.service';
import { Message, Channel } from './types';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  public NO_CHANNEL = 'no-channel';
  public channels: Channel[];
  private currentChannel: Channel;
  public selected: string;
  public messages: Message[] = [];
  public glueConnectedBadgeSrc = '/assets/disconnected.svg';
  public glueConnectionStatus = 'Disconnected';

  constructor(
    private readonly glueService: GlueService,
    private readonly elem: ElementRef,
    private renderer: Renderer2
  ) { }

  public async ngOnInit(): Promise<void> {
    this.setGlueConnectionStatus();

    this.channels = await this.glueService.getAllChannels();
  }

  public async selectChannel(selected: MatSelectChange) {

    if (selected.value === this.NO_CHANNEL && !this.currentChannel) {
      return;
    }

    const foundChannel = this.channels.find((channel) => channel.name === selected.value);

    if (foundChannel && foundChannel.name === this.currentChannel?.name) {
      return;
    }

    let selectedElement = this.elem.nativeElement.querySelectorAll('.mat-select-value')[0];

    const date = new Date();
    const messageTimeStamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;

    this.renderer.removeStyle(selectedElement, 'color');

    if (selected.value === this.NO_CHANNEL) {

      await this.glueService.leaveChannel();

      this.messages.unshift({ text: `Left channel: ${this.currentChannel?.name}`, time: messageTimeStamp });

      delete this.currentChannel;

      return;
    }

    this.currentChannel = foundChannel;

    await this.glueService.joinChannel(this.currentChannel.name);

    this.messages.unshift({ text: `Joined channel: ${this.currentChannel.name}`, time: messageTimeStamp });

    this.renderer.setStyle(selectedElement, 'color', this.currentChannel.meta.color);
  }

  public clearLogs() {
    this.messages = [];
  }

  private setGlueConnectionStatus() {
    this.glueConnectedBadgeSrc = '/assets/connected.svg';
    this.glueConnectionStatus = 'Connected';
  }
}
