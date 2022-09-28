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
import Extent from '@arcgis/core/geometry/Extent';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import { BehaviorSubject } from 'rxjs';
import { listOfPoints, mainPoint } from './point.constant';
import Point from '@arcgis/core/geometry/Point';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';

// import Graphic from '@arcgis/core/Graphic';

export class Logger {
  webmap: any;
  view: any;
  nearbyCustom: boolean = false;
  nearbyActivate = new BehaviorSubject(false);
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

  onChangeNearby(): void {
    if (this.nearbyActivate) {
      if (this.view) {
        this.view.graphics = [];
        this.LocalFLGraphics = null;
      }
      if (this.LocalFL) this.LocalFL.visible = true;
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

  // zoom to cluster extent
  async zoomTo(graphic: Graphic) {
    // query on the view side and not query from rest api
    this.LocalFLLayerView = await this.view.whenLayerView(this.LocalFL);
    // check if the layer and graphic is not null
    this.processParams(graphic, this.LocalFLLayerView);

    // create query object from layer view
    const query = this.LocalFLLayerView.createQuery();

    // get id of cluster point
    query.aggregateIds = [graphic.getObjectId()];

    // query the layer view
    const { features } = await this.LocalFLLayerView.queryFeatures(query);

    // extent holder
    let extent: any = null;

    // flag indicate if all the cluster point has same latitude or longitude
    let clusterDifferentLatitudeLongitude = 0;

    // get the first latitude or longitude
    const latitude = features[0].geometry.latitude;
    const longitude = features[0].geometry.longitude;

    // interate results from query
    features.forEach((feature: any) => {
      // check if all point has same latitude or longitude
      if (
        latitude === feature.geometry.latitude &&
        longitude === feature.geometry.longitude
      ) {
        clusterDifferentLatitudeLongitude++;
      }
      // check if geometry is point then we need to combine the extent
      if (feature.geometry.type === 'point') {
        let geometryExtent = new Extent({
          xmin: feature.geometry.x,
          xmax: feature.geometry.x,
          ymin: feature.geometry.y,
          ymax: feature.geometry.y,
          spatialReference: feature.geometry.spatialReference,
        });
        // combine the extend of each point
        extent = extent ? extent.union(geometryExtent) : geometryExtent;
      }
    });
    // if has same latitude or longitude showing alert
    if (clusterDifferentLatitudeLongitude === features.length) {
      alert('Same coordinate');
    } else {
      // zoom to extent
      this.view.goTo(extent);
    }
  }

  async fakePromisePoint(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(listOfPoints);
    });
  }

  async nearbyCustomAPI() {
    // clear graphic
    if (this.view && this.DrawLayer) {
      this.DrawLayer.graphics.removeAll();
    }

    if (this.nearbyCustom) {
      this.nearbyCustom = !this.nearbyCustom;
      this.DrawLayer.graphics.removeAll();
    } else {
      // make buffer from the point click, it will create the buffer as polygon
      let nearbyPoint = new Point({
        latitude: mainPoint.latitude,
        longitude: mainPoint.longitude,
        spatialReference: new SpatialReference({ wkid: 3857 }),
      });
      // console.log(nearbyPoint, 'nearby point');
      const ptBuff: any = geometryEngine.buffer(nearbyPoint, 5, 'kilometers');

      // symbol configuration
      let polygonSymbol = {
        type: 'simple-fill', // autocasts as new SimpleFillSymbol()
        color: [0, 255, 255, 0.2],
        style: 'solid',
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: 'white',
          width: 1,
        },
      };

      // create graphic from polygon
      let polygon = new Graphic({
        geometry: ptBuff,
        symbol: polygonSymbol,
        attributes: mainPoint.attributes,
      });

      if (this.DrawLayer) {
        let results = await this.fakePromisePoint();
        console.log(results, 'data');
        results.forEach((d: any) => {
          let tempPoint = new Point({
            latitude: d.latitude,
            longitude: d.longitude,
            spatialReference: new SpatialReference({
              wkid: 3857,
            }),
          });
          const simpleMarkerSymbol = {
            type: 'simple-marker',
            color: [226, 119, 40], // Orange
            outline: {
              color: [255, 255, 255], // White
              width: 1,
            },
          };
          let graphic = new Graphic({
            geometry: tempPoint,
            symbol: simpleMarkerSymbol,
            attributes: d.attributes,
          });
          this.DrawLayer.graphics.add(graphic);
        });

        this.DrawLayer.graphics.add(polygon);
        this.view.goTo(polygon.geometry.extent);
        this.nearbyCustom = !this.nearbyCustom;
      }
    }
  }

  async nearby(graphic: Graphic) {
    // clear graphic
    if (this.LocalFLGraphics && this.view) {
      this.view.graphics.removeMany(this.LocalFLGraphics);
      this.view.graphics = [];
      this.LocalFLGraphics = null;
    }

    console.log(graphic.geometry, 'graphic geometry');
    // make buffer from the point click, it will create the buffer as polygon
    const ptBuff: any = geometryEngine.buffer(
      graphic.geometry,
      5,
      'kilometers'
    );

    // symbol configuration
    let polygonSymbol = {
      type: 'simple-fill', // autocasts as new SimpleFillSymbol()
      color: [0, 255, 255, 0.2],
      style: 'solid',
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: 'white',
        width: 1,
      },
    };

    // create graphic from polygon
    let polygon = new Graphic({
      geometry: ptBuff,
      symbol: polygonSymbol,
      attributes: {},
    });

    if (this.LocalFL) {
      this.LocalFLLayerView = await this.view.whenLayerView(this.LocalFL); // this.webmap.add(this.LocalFL);
      const query = this.LocalFLLayerView.createQuery();
      // use the polygon (buffer point) as geometry to query
      query.geometry = polygon.geometry;
      // check and query layer if those point is contain in polygon radius
      query.spatialRelationship = 'contains'; // this is the default

      // return geometry shape
      query.returnGeometry = true;

      // return all attributes fields
      query.outFields = ['*'];

      // query the layer
      const { features } = await this.LocalFLLayerView.queryFeatures(query);
      // const { features } = await this.LocalFL.queryFeatures(query);

      // iterate through each layer and add to graphic layer
      this.view.graphics = [];
      features.forEach(async (feature: Graphic) => {
        console.log(feature, 'feature');
        const symbol = await symbolUtils.getDisplayedSymbol(feature);
        feature.symbol = symbol;
        // add graphic to graphic layer
        this.view.graphics.add(feature);
      });
      // add polygon buffer to graphic layer
      this.view.graphics.add(polygon);
      // assign the value feat
      // zoom to buffer extent
      this.view.goTo(polygon.geometry.extent);
      // hide the cluster layer
      this.LocalFL.visible = false;
      this.nearbyActivate.next(true);
    }
  }

  async showFeature(graphic: Graphic) {
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
