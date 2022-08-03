import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import Map from '@arcgis/core/Map';
import WebMap from '@arcgis/core/webmap';
import MapView from '@arcgis/core/views/MapView';
import SearchWidget from '@arcgis/core/widgets/Search';
import esriConfig from '@arcgis/core/config';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';
import esriId from '@arcgis/core/identity/IdentityManager';
import Portal from '@arcgis/core/portal/Portal';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import BookmarksWidget from '@arcgis/core/widgets/Bookmarks';
import BasemapLayerList from '@arcgis/core/widgets/BasemapGallery';
import { Logger } from '../state.services';
import Sketch from '@arcgis/core/widgets/Sketch';
import * as geometryEngineAsync from '@arcgis/core/geometry/geometryEngineAsync';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css'],
})
export class EsriMapComponent implements OnInit, OnDestroy {
  highlight: any;
  LayerView: any;
  constructor(private cLogger: Logger) {
    console.log(this.cLogger.view);
    this.cLogger.createLocalFeatureLayer();
  }

  @ViewChild('viewDiv', { static: true }) private viewDiv!: ElementRef;

  initializeMap(): Promise<any> {
    const mapcontainer = this.viewDiv.nativeElement;

    //For authentication
    const info = new OAuthInfo({
      appId: 'd9FM1TTjeEzIFlCJ',
      //part where we can point to the map service in our environment.
      portalUrl: 'https://zsolution.maps.arcgis.com',
      popup: false,
    });

    esriId.registerOAuthInfos([info]);

    this.cLogger.webmap = new WebMap({
      portalItem: {
        id: '8f0da2c8426d4b2882ca7051ea0af773',
      },
    });

    this.cLogger.view = new MapView({
      container: mapcontainer,
      map: this.cLogger.webmap,
      center: [-73.9304, 40.6971],
      scale: 144447,
      highlightOptions: {
        color: [255, 255, 0, 1],
        haloOpacity: 0.9,
        fillOpacity: 0.2,
      },
    });

    this.cLogger.webmap.when(() => {
      console.log(this.cLogger.view);
    });

    return this.cLogger.view.when();
  }

  initializeWidget(): void {
    const searchWidget = new SearchWidget({
      view: this.cLogger.view,
    });

    const sketchWidget = new Sketch({
      view: this.cLogger.view,
      layer: this.cLogger.DL,
    });

    this.cLogger.view.ui.add(sketchWidget, 'top-right');
    this.cLogger.view.ui.add(searchWidget, 'top-right');

    sketchWidget.on('create', async (event: any) => {
      if (event.state === 'complete') {
        let result = await this.cLogger.spatialQuery(
          this.cLogger.L6,
          event.graphic.geometry
        );

        if (this.highlight) {
          this.highlight.remove();
        }

        if (this.cLogger.L6LayerView) {
          console.log('masuk sini', this.cLogger.L6.popupEnabled);
          this.highlight = this.cLogger.L6LayerView.highlight(result);
        }
      }
    });
  }

  ngOnInit(): void {
    this.initializeMap().then(() => {
      console.log('map initialized');
    });
    this.initializeWidget();
    this.cLogger.initializeLayer();
  }

  ngOnDestroy(): void {
    this.cLogger.view.destroy();
  }
}
