define([
  "esri/map",
  "esri/layers/ArcGISDynamicMapServiceLayer",
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
  'dojo/Deferred',
  'dojo/on',
  'dojo/topic',
  'dijit/popup',
  'dijit/_TemplatedMixin',
  'dojo/text!./templates/HeadWidget.html',
], function (
  Map,
  ArcGISDynamicMapServiceLayer,
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
          domStyle.set(dom.byId("rightPane"), "width", "0")
          this.isrightSlibarOpen = false;

        } else {
          this.isrightSlibarOpen = true;
          domStyle.set(dom.byId("rightPane"), "transform", "translateX(-400px)")
          domStyle.set(dom.byId("rightPane"), "width", "400px")
        }
      })
      );
    },

    startup: function () {
      window.map = new Map("map",
        {
          // basemap: "satellite",
          // basemap: "streets",
          // center: [87, 34],
          // zoom: 5,
          slider: false,
          logo: false,
        });

      var basemap = new ArcGISDynamicMapServiceLayer(window.appInfo.basemapURL);
      window.map.addLayer(basemap);

      var DynamicLayer = new ArcGISDynamicMapServiceLayer("http://192.168.1.146:6080/arcgis/rest/services/XMGHY/XMGHYZT/MapServer",{
        id:"DynamicLayer"
      });
      DynamicLayer.setVisibleLayers([]);
      window.map.addLayer(DynamicLayer);

      this._event();
    }
  });
});