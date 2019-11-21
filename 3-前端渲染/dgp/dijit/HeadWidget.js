define([
  "esri/map",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "dojo/dom",
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/dom-style',
  'dojo/dom-attr',
  'dojo/query',
  'dijit/_WidgetBase',
  'dojo/Evented',
  "esri/geometry/Extent",
  "esri/SpatialReference",
  'dojo/Deferred',
  'dojo/on',
  'dojo/topic',
  'dijit/popup',
  'dijit/_TemplatedMixin',
  'dojo/text!./templates/HeadWidget.html',
], function (
  Map,
  ArcGISDynamicMapServiceLayer,
  ArcGISTiledMapServiceLayer,
  dom,
  declare,
  lang,
  html,
  arrayUtils,
  domClass,
  domCon,
  domStyle,
  domAttr,
  query,
  _WidgetBase,
  Evented,
  Extent,
  SpatialReference,
  Deferred,
  on,
  topic,
  popup,
  _TemplatedMixin,
  template,
) {
  return declare([_WidgetBase, _TemplatedMixin, Evented], {
    'baseClass': 'dgp-head-widget',
    declaredClass: 'dgp.dijit.headWidget',
    templateString: template,

    postCreate: function () {

    },

    _event: function () {
      on(dom.byId("rasterbutton"), "click", lang.hitch(this, function () {
        if (this.isrightSlibarOpen) {
          domStyle.set(dom.byId("rightPane"), "transform", "translateX(0px)")
          // domStyle.set(dom.byId("rightPane"), "width", "0")
          this.isrightSlibarOpen = false;

        } else {
          this.isrightSlibarOpen = true;
          domStyle.set(dom.byId("rightPane"), "transform", "translateX(-550px)")
          // domStyle.set(dom.byId("rightPane"), "width", "500px")
        }
      })
      );
    },

    startup: function () {
      var map = new Map("map",
        {
          // basemap: "satellite",
          // basemap: "streets",
          // center: [87, 34],
          // zoom: 5,
          slider: false,
          logo: false,
        });

      window.map = map;

      var basemap = new ArcGISTiledMapServiceLayer(window.appInfo.basemapURL);
      window.map.addLayer(basemap);

      var extent = new Extent(521223, 2677120, 742440, 2772171,new SpatialReference({ wkid:4548 }));
      window.map.setExtent(extent)

      var DynamicLayer = new ArcGISDynamicMapServiceLayer(window.appInfo.mapServerURL,{
        id:"DynamicLayer"
      });
      DynamicLayer.setVisibleLayers([]);
      window.map.addLayer(DynamicLayer);

      this._event();
    }
  });
});