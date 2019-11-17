define([
  "esri/map",
  "dojo/on",
  "dojo/_base/declare",
  'esri/request',
  'dojo/Deferred',
  "dojo/dom",
  'dojo/dom-style',
  "dojo/dom-construct",
  "esri/Color",
  "esri/InfoTemplate",
  "esri/tasks/query",
  "dojo/_base/lang",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "dojo/_base/array",
  "dojo/dom",
  "esri/renderers/BlendRenderer",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!widgets/RightPanel/template.html"
],
  function (
    Map,
    on,
    declare,
    esriRequest,
    Deferred,
    dom,
    domStyle,
    domCon,
    Color,
    InfoTemplate,
    Query,
    lang,
    SimpleLineSymbol,
    SimpleFillSymbol,
    SimpleMarkerSymbol,
    array,
    dom,
    BlendRenderer,
    _WidgetBase,
    _TemplatedMixin,
    template
  ) {
    return declare("rasterAnalysisClass",
      [_WidgetBase, _TemplatedMixin], {
      baseClass: "rasterAnalysisClass", //模板的根div
      templateString: template,

      constructor: function (args) {
        this.map = args;
      },

      postCreate: function () {
        this._setLayer()
      },

      _setLayer: function () {
        var DynamicLayer = this.map.getLayer("DynamicLayer")
        DynamicLayer.setVisibleLayers([46]);

        // 获取图层信息
        this.getLayerInfos(DynamicLayer.url + "/46").then(function (result) {
          var DOM = $("#normalizationField")[0]
          for (var i = 0; i < result.length; i++) {
            var item = result[i];
            domCon.create('option', {
              innerHTML: item.name
            }, DOM)
          }
        })
      },

      getLayerInfos: function (url) {
        var deferred = new Deferred();
        esriRequest({
          url: url,
          content: {
            f: 'json'
          },
          handleAs: 'json',
          callbackParamName: 'callback'
        }).then(lang.hitch(this, function (result) {
          deferred.resolve(result.fields);
        }), function (err) {
          console.error(err.message || err);
          deferred.resolve(null);
        });
        return deferred;
      },

      _doRenderer: function () {
        var blendRendererOptions = {
          blendMode: "darken",
          symbol: new SimpleFillSymbol().setOutline(new SimpleLineSymbol().setWidth(1)),
          fields: [
            {
              field: "VALUE1",
              color: new Color([230, 0, 0])
            }, {
              field: "VALUE2",
              color: new Color([56, 168, 0])
            }, {
              field: "VALUE3",
              color: new Color([0, 169, 230])
            }, {
              field: "VALUE4",
              color: new Color([255, 0, 197])
            }
          ],
          opacityStops: [
            {
              value: 0,
              opacity: 0
            },
            {
              value: 1,
              opacity: 1
            }
          ],
          normalizationField: "Total",
        };

        renderer = new BlendRenderer(blendRendererOptions);
      },

      //添加事件
      _bindEvents: function () {

      },

      _afreshLayer: function () {

      },

      startup: function () {
        this.inherited(arguments);
        this._initColor();
        this._bindEvents();
      },
      _initColor: function () {
        $(this.inputColorStart).minicolors({
          change: lang.hitch(this, function (hex, opacity) {
            this._afreshLayer();
          })
        });
        $(this.inputColorEnd).minicolors({
          change: lang.hitch(this, function (hex, opacity) {
            this._afreshLayer();
          })
        });
      },


    });
  });