import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import { SimpleFillSymbol, SimpleMarkerSymbol } from '@arcgis/core/symbols';
import FeatureReductionBinning from '@arcgis/core/layers/support/FeatureReductionBinning';
import GraphicLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import Geometry from '@arcgis/core/geometry/Geometry';
import GeometryPoint from '@arcgis/core/geometry/Point';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import * as symbolUtils from '@arcgis/core/symbols/support/symbolUtils';
import Collection from '@arcgis/core/core/Collection';
import FeatureReductionCluster from '@arcgis/core/layers/support/FeatureReductionCluster';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
export class Logger {
  webmap: any;
  view: any;
  layerSwitch: any = {
    L1: false,
    L2: false,
    L3: true,
    L4: false,
    L5: false,
    L6: false,
    L7: false,
  };
  L1: FeatureLayer;
  L2: FeatureLayer;
  L3: FeatureLayer;
  L4: FeatureLayer;
  L5: GeoJSONLayer;
  L6: GeoJSONLayer;
  LayerHiddenFromList: FeatureLayer;
  LocalFL: FeatureLayer | null = null;
  DL: any;
  L2LayerView: any;
  L3LayerView: any;
  L4LayerView: any;
  L5LayerView: any;
  L6LayerView: any;
  L7LayerView: any;
  LocalFLLayerView: any;
  LocalFLGraphics: any;
  DrawLayer: GraphicLayer;
  drawedPoint: any;

  onChangeL1(): void {
    if (this.layerSwitch.L1) {
      this.view.map.add(this.L1);
    } else {
      this.view.map.remove(this.L1);
    }
  }

  onChangeL2(): void {
    if (this.layerSwitch.L2) {
      this.view.map.add(this.L2);
      this.view.whenLayerView(this.L2).then((layerView: any) => {
        this.L2LayerView = layerView;
        console.log('layerview', this.L2LayerView);
      });
    } else {
      this.view.map.remove(this.L2);
    }
  }

  onChangeL3(): void {
    if (this.layerSwitch.L3) {
      this.view.map.add(this.L3);
    } else {
      this.view.map.remove(this.L3);
    }
  }

  onChangeL4(): void {
    if (this.layerSwitch.L4) {
      this.view.map.add(this.L4);
      this.view.whenLayerView(this.L4).then((layerView: any) => {
        this.L4LayerView = layerView;
        console.log('layerview', this.L4LayerView);
      });
    } else {
      this.view.map.remove(this.L4);
    }
  }

  onChangeL5(): void {
    if (this.layerSwitch.L5) {
      this.view.map.add(this.L5);
      this.view.whenLayerView(this.L5).then((layerView: any) => {
        this.L5LayerView = layerView;
        console.log('layerview', this.L5LayerView);
      });
    } else {
      this.view.map.remove(this.L5);
    }
  }

  onChangeL6(): void {
    if (this.layerSwitch.L6) {
      this.view.map.add(this.L6);
      this.view.whenLayerView(this.L6).then((layerView: any) => {
        this.L6LayerView = layerView;
        console.log('layerview', this.L6LayerView);
      });
    } else {
      this.view.map.remove(this.L6);
    }
  }

  onChangeL7(): void {
    if (this.layerSwitch.L7) {
      this.view.map.add(this.LocalFL);
      // this.view.whenLayerView(this.LocalFL).then((layerView: any) => {
      //   this.L7LayerView = layerView;
      //   console.log('layerview', this.L7LayerView);
      // });
    } else {
      this.view.map.remove(this.LocalFL);
    }
  }

  initializeLayer(): void {
    // this.view.map.add(this.L1);
    if (this.layerSwitch.L2) {
      this.view.map.add(this.L2);
    }
    if (this.layerSwitch.L3) {
      this.view.map.add(this.L3);
      this.view.whenLayerView(this.L3).then((layerView: any) => {
        this.L3LayerView = layerView;
        // console.log('layerview', this.L3LayerView);
      });
    }
    if (this.layerSwitch.L5) {
      this.webmap.add(this.L5);
    }

    this.createLocalFeatureLayer();

    this.webmap.add(this.LayerHiddenFromList);
    this.webmap.add(this.DrawLayer);
  }

  async createCustomer(geometry: any): Promise<boolean> {
    if (this.L3 != null) {
      geometry.attributes = {
        Name: 'Customer',
        Age: 30,
        Salary: 100000.0,
      };
      console.log({ geometry });

      const a = await this.L3.applyEdits({
        addFeatures: [geometry],
      });
      console.log({ a });

      fetch('http://localhost:3000/posts')
        .then((response) => response.json())
        .then((data) => {
          console.log({ data });
        });
    }
    return true;
  }

  async createBuilding(geometry: any): Promise<boolean> {
    if (this.L1 != null) {
      geometry.attributes = {
        Name: 'Eifel Tower',
        Sizes: 10000,
      };
      console.log({ geometry });

      const a = await this.L1.applyEdits({
        addFeatures: [geometry],
      });
      console.log({ a });
    }
    return true;
  }

  async spatialQuery(Layer: any, geometry: Geometry) {
    let query = Layer.createQuery();
    query.geometry = geometry;
    query.outFields = ['*'];
    query.spatialRelationship = 'contains';
    let results = await Layer.queryFeatures(query);
    console.log({ results });
    return results.features;
  }

  async createLocalFeatureLayer() {
    let fetcher = await fetch('http://localhost:3000/data');
    let data = await fetcher.json();

    let sourceFL: Collection<Graphic> = new Collection<Graphic>();

    data.data.forEach((user: any) => {
      //create point
      let point = new GeometryPoint({
        latitude: user.latitude,
        longitude: user.longitude,
      });

      //create attribute
      // let attribute = {
      //   OBJECTID: user._id,
      //   name: user.name,
      //   age: user.age,
      //   gender: user.gender,
      //   address: user.address,
      // };
      let attribute = {
        OBJECTID: user.assetDetailsId,
        name: user.name,
        age: user.age,
        ownership: user.ownership,
        address: user.currentLocationDescription,
      };

      let simpleMarker = new SimpleMarkerSymbol({
        color: '#ffii99',
      });

      let userGraphic = new Graphic({
        geometry: point,
        attributes: attribute,
        symbol: simpleMarker,
      });

      sourceFL.push(userGraphic);
    });

    let cluster = new FeatureReductionCluster({
      clusterMaxSize: 100,
      clusterMinSize: 50,
      popupTemplate: {
        content: 'This cluster represents <b>{cluster_count}</b> features.',
        fieldInfos: [
          {
            fieldName: 'cluster_count',
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
        ],
        actions: new Collection([
          {
            title: 'Show features',
            id: 'show-features',
            className: 'esri-icon-maps',
          },
        ]),
      },
      labelingInfo: [
        {
          deconflictionStrategy: 'none',
          labelExpressionInfo: {
            expression: "Text($feature.cluster_count, '#,###')",
          },
          symbol: {
            type: 'text',
            color: '#ffffff',
            font: {
              weight: 'bold',
              family: 'Noto Sans',
              size: '12px',
            },
          },
          labelPlacement: 'center-center',
        },
      ],
    });

    this.LocalFL = new FeatureLayer({
      url: 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/ArcGIS/rest/services/Structures_Landmarks_v1/FeatureServer/0',
      // source: sourceFL,
      objectIdField: 'OBJECTID',
      fields: [
        {
          name: 'OBJECTID',
          type: 'oid',
        },
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'age',
          type: 'string',
        },
        {
          name: 'gender',
          type: 'string',
        },
        {
          name: 'address',
          type: 'string',
        },
      ],
      title: 'Local Feature Layer',
      // renderer: new SimpleRenderer({
      //   symbol: new PictureMarkerSymbol({
      //     url: 'https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png',
      //     width: '64px',
      //     height: '64px',
      //   }),
      // }),
      popupEnabled: true,
      outFields: ['*'],
      featureReduction: cluster,
    });

    // this.LocalFLLayerView = await this.view.whenLayerView(this.LocalFL); // this.webmap.add(this.LocalFL);
    // reactiveUtils.watch(
    //   () => [
    //     this.view.scale,
    //     this.view.popup.selectedFeature,
    //     this.view.popup.visible,
    //   ],
    //   this.clearViewGraphics
    // );
  }

  async showFeature(graphic: Graphic) {
    console.log('hahahaha');
    if (this.LocalFLGraphics && this.view) {
      this.view.graphics.removeMany(this.LocalFLGraphics);
      this.LocalFLGraphics = null;
    }
    this.LocalFLLayerView = await this.view.whenLayerView(this.LocalFL); // this.webmap.add(this.LocalFL);
    this.processParams(graphic, this.LocalFLLayerView);

    const query = this.LocalFLLayerView.createQuery();
    query.aggregateIds = [graphic.getObjectId()];
    const { features } = await this.LocalFLLayerView.queryFeatures(query);

    features.forEach(async (feature: Graphic) => {
      const symbol = await symbolUtils.getDisplayedSymbol(feature);
      feature.symbol = symbol;
      this.view.graphics.add(feature);
    });
    this.LocalFLGraphics = features;
  }

  processParams(graphic: Graphic, layerView: any) {
    console.log({ graphic });
    console.log({ layerView });
    if (!graphic || !layerView) {
      throw new Error('Graphic or layerView not provided.');
    }

    if (!graphic.isAggregate) {
      throw new Error('Graphic must represent a cluster.');
    }
  }

  clearViewGraphics() {
    // if (this.LocalFLGraphics && this.view) {
    //   this.view.graphics.removeMany(this.LocalFLGraphics);
    //   this.LocalFLGraphics = null;
    // }
  }

  constructor() {
    this.L1 = new FeatureLayer({
      url: 'https://services3.arcgis.com/kZLhFeSJ3zmoqnb1/arcgis/rest/services/Building/FeatureServer/0',
      renderer: new SimpleRenderer({
        symbol: new SimpleFillSymbol({
          color: [119, 173, 28, 0.5],
          outline: {
            width: 3,
            color: 'white',
          },
        }),
      }),
    });

    // this.L2 = new FeatureLayer({
    //   url: 'https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/HOLC_Neighborhood_Redlining/FeatureServer/0',
    // });

    this.L2 = new FeatureLayer({
      url: 'https://mygos.mygeoportal.gov.my/gisserver/rest/services/DOS/StatsGeo_Login/MapServer/1',
    });

    this.L3 = new FeatureLayer({
      title: 'Customer Information',
      url: 'https://services3.arcgis.com/kZLhFeSJ3zmoqnb1/arcgis/rest/services/Customer/FeatureServer/0',
      renderer: new SimpleRenderer({
        symbol: new SimpleMarkerSymbol({
          size: 8,
          color: '#00AFEB',
          outline: {
            width: 0.5,
            color: 'white',
          },
        }),
      }),
      popupEnabled: true,
      outFields: ['*'],
    });

    this.DL = new GraphicLayer({
      title: 'For input',
      visible: true,
    });

    this.L4 = new FeatureLayer({
      url: 'https://livingatlas.esri.in/server1/rest/services/Agriculture/IN_ST_FruitProduction_2019_20/MapServer/0',
    });

    this.L5 = new GeoJSONLayer({
      url: 'https://raw.githubusercontent.com/ICT4SD/Terrorism_Analysis/master/GTA/countries.geo.json',
    });

    this.L6 = new GeoJSONLayer({
      url: 'https://raw.githubusercontent.com/zaefrulbgt/ey-demo/main/poll-district.geo.json',
    });

    this.LayerHiddenFromList = new FeatureLayer({
      url: 'https://services2.arcgis.com/FiaPA4ga0iQKduv3/ArcGIS/rest/services/Structures_Landmarks_v1/FeatureServer/0',
      // Hide it from the list
      listMode: 'hide',
      // to makesure it available accross all zoom level
      minScale: 0,
      maxScale: 0,
      visible: false,
    });

    this.DrawLayer = new GraphicLayer({
      title: 'drawing layer',
    });
  }
}
