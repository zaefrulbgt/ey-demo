import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Logger } from '../state.services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  Layer1: boolean;
  Layer2: boolean;
  Layer3: boolean;
  Layer4: boolean;
  Layer5: boolean;
  Layer6: boolean;
  Layer7: boolean;
  nearbyActivate: boolean = false;

  changeL1(): void {
    console.log(this.Layer1);
    this.cLogger.layerSwitch.L1 = !this.Layer1;
    this.cLogger.onChangeL1();
  }
  changeL2(): void {
    console.log(this.Layer2);
    this.cLogger.layerSwitch.L2 = !this.Layer2;
    this.cLogger.onChangeL2();
  }
  changeL3(): void {
    console.log(this.Layer3);
    this.cLogger.layerSwitch.L3 = !this.Layer3;
    this.cLogger.onChangeL3();
  }
  changeL4(): void {
    console.log(this.Layer4);
    this.cLogger.layerSwitch.L4 = !this.Layer4;
    this.cLogger.onChangeL4();
  }
  changeL5(): void {
    console.log(this.Layer5);
    this.cLogger.layerSwitch.L5 = !this.Layer5;
    this.cLogger.onChangeL5();
  }
  changeL6(): void {
    console.log(this.Layer6);
    this.cLogger.layerSwitch.L6 = !this.Layer6;
    this.cLogger.onChangeL6();
  }
  changeL7(): void {
    console.log(this.Layer7);
    this.cLogger.layerSwitch.L7 = !this.Layer7;
    this.cLogger.onChangeL7();
  }

  changeNearbyActivate(): void {
    this.nearbyActivate = !this.nearbyActivate;
    this.cLogger.nearbyActivate.next(!this.nearbyActivate);
    this.cLogger.onChangeNearby();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cLogger: Logger
  ) {
    this.Layer1 = this.cLogger.layerSwitch.L1;
    this.Layer2 = this.cLogger.layerSwitch.L2;
    this.Layer3 = this.cLogger.layerSwitch.L3;
    this.Layer4 = this.cLogger.layerSwitch.L4;
    this.Layer5 = this.cLogger.layerSwitch.L5;
    this.Layer6 = this.cLogger.layerSwitch.L6;
    this.Layer7 = this.cLogger.layerSwitch.L7;
  }

  ngOnInit() {
    this.cLogger.nearbyActivate.subscribe((res) => {
      this.nearbyActivate = res;
    });
  }

  async onNearby() {
    await this.cLogger.nearbyCustomAPI();
  }
}
