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
  'esri/layers/FeatureLayer',
  "esri/layers/LayerDrawingOptions",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  'esri/renderers/SimpleRenderer',
  'esri/renderers/ClassBreaksRenderer',
  'esri/renderers/HeatmapRenderer',
  "esri/renderers/UniqueValueRenderer",
  "esri/renderers/DotDensityRenderer",
  "esri/renderers/ScaleDependentRenderer",
  "dojo/_base/array",
  "dojo/dom",
  "esri/renderers/BlendRenderer",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!widgets/RenderPanel/template.html"
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
    FeatureLayer,
    LayerDrawingOptions,
    SimpleLineSymbol,
    SimpleFillSymbol,
    SimpleMarkerSymbol,
    SimpleRenderer,
    ClassBreaksRenderer,
    HeatmapRenderer,
    UniqueValueRenderer,
    DotDensityRenderer,
    ScaleDependentRenderer,
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
        this.url = window.appInfo.mapServerURL
      },

      postCreate: function () {
        this._bindEvents();
      },

      setFeaturelayer: function (e) {
        this.DynamicLayer.setLayerDrawingOptions([]);
        this.DynamicLayer.setVisibleLayers([]);
        this.DynamicLayer.refresh();

        var layer = this.map.getLayer('FeatureLayer')
        if (layer) {
          this.map.removeLayer(layer)
        }

        var infoTemplate = new InfoTemplate("${OBJECTID}", "${*}");
        var featureLayer = new FeatureLayer(this.url + e.currentTarget.value, {
          id: 'FeatureLayer',
          mode: FeatureLayer.MODE_SNAPSHOT,
          infoTemplate: infoTemplate,
          outFields: ["*"]
        });
        this.layer = featureLayer;
        this.map.addLayer(featureLayer);
      },

      _setLayer: function (e) {
        this.DynamicLayer.setLayerDrawingOptions([]);

        var layer = this.map.getLayer('FeatureLayer')
        if (layer) {
          this.map.removeLayer(layer)
        }
        var value = e.currentTarget.value;
        this.DynamicLayer.setVisibleLayers([value]);
        this.DynamicLayer.refresh();

        this.setVisibleLayer = value;
        this.layer = this.DynamicLayer
      },

      // var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
      //   new Color([255, 0, 0]), 3)

      // var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
      //   new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
      //     new Color([0, 0, 0]), 3),
      //   new Color([255, 0, 0])
      // );

      simple: function () {
        var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 25,
          new SimpleLineSymbol(SimpleFillSymbol.STYLE_SOLID,
            new Color([0, 0, 0]), 3),
          new Color([255, 0, 0])
        );

        var renderer = new SimpleRenderer(symbol);

        var mode = parseInt($("#simple")[0].value);

        switch (mode) {
          case 1:
            renderer.setVisualVariables([{
              type: "colorInfo",
              field: "OBJECTID",
              "stops": [
                {
                  "value": 1,
                  "color": new Color([255, 255, 255]),
                },
                {
                  "value": 25,
                  "color": new Color([0, 0, 0]),
                }
              ]
            }]);
            break;
          case 2:
            renderer.setVisualVariables([{
              type: "opacityInfo",
              field: "OBJECTID",
              "stops": [{
                "value": 10,
                "opacity": 0
              }, {
                "value": 15,
                "opacity": 50
              }, {
                "value": 20,
                "opacity": 100
              }]
            }]);
            break;
          case 3:
            renderer.setVisualVariables([{
              type: "sizeInfo",
              field: "OBJECTID",
              minSize: 2,
              maxSize: 50,
              minDataValue: 1,
              maxDataValue: 25
            }]);
            break;
          case 4:
            renderer.setVisualVariables([{
              type: "colorInfo",
              field: "OBJECTID",
              "stops": [
                {
                  "value": 1,
                  "color": new Color([255, 255, 255]),
                  "label": "< 30.900"
                },
                {
                  "value": 25,
                  "color": new Color([0, 0, 0]),
                  "label": "37.415"
                }
              ]
            }, {
              type: "sizeInfo",
              field: "OBJECTID",
              minSize: 2,
              maxSize: 50,
              minDataValue: 1,
              maxDataValue: 25
            }]);
            break;
          default:
            break;
        }

        this._doRenderer(renderer)
      },

      ClassBreaks: function () {
        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([0, 0, 0]), 3),
          new Color([255, 0, 0])
        );
        var renderer = new ClassBreaksRenderer(symbol, "总人口");

        renderer.addBreak(0, 50, new SimpleFillSymbol().setColor(new Color([0, 0, 0])));
        renderer.addBreak(50, 100, new SimpleFillSymbol().setColor(new Color([125, 125, 125])));
        renderer.addBreak(100, 90000, new SimpleFillSymbol().setColor(new Color([255, 255, 255])));
        renderer.addBreak(90000, 180000, new SimpleFillSymbol().setColor(new Color([0, 255, 0])));
        renderer.addBreak(180000, 240000, new SimpleFillSymbol().setColor(new Color([0, 0, 255])));

        var mode = parseInt($("#ClassBreaks")[0].value);
        switch (mode) {
          case 1:
            renderer.normalizationType = "percent-of-total";
            renderer.normalizationTotal = 500000;
            break;
          case 2:
            alert('layerDrawingOptions不支持normalizationType=Field')
            renderer.normalizationType = "field";
            renderer.attributeField = '流动人口'
            renderer.normalizationField = "总人口";
            renderer.clearBreaks();
            renderer.addBreak(0, 0.3, new SimpleFillSymbol().setColor(new Color([0, 0, 0])));
            renderer.addBreak(0.3, 0.6, new SimpleFillSymbol().setColor(new Color([125, 125, 125])));
            renderer.addBreak(0.6, 1, new SimpleFillSymbol().setColor(new Color([255, 255, 255])));
            break;
          case 3:
            renderer.setVisualVariables([{
              type: "colorInfo",
              field: "OBJECTID",
              "stops": [
                {
                  "value": 1,
                  "color": new Color([255, 255, 255]),
                },
                {
                  "value": 50,
                  "color": new Color([0, 0, 0]),
                }
              ]
            }]);
            break;
          default:
            break;
        }

        this._doRenderer(renderer)
      },

      UniqueValue: function () {
        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([0, 0, 0]), 3),
          new Color([255, 0, 0])
        );

        var calculateField = function (Graphic) {
          var acres = (Graphic.hasOwnProperty("attributes")) ? Graphic.attributes.OBJECTID : Graphic;
          return (acres + 1);
        };
        var mode = parseInt($("#UniqueValue")[0].value);
        if (mode === 0) {
          var renderer = new UniqueValueRenderer(symbol, "OBJECTID");
        } else {
          // Dynamic Layers不支持用方法替代Field
          var renderer = new UniqueValueRenderer(symbol, calculateField);
          alert('Dynamic Layers不支持用方法替代Field')
        }

        // Dynamic Layers不支持透明度设置，只有透个不透(设置透明度会变色)
        renderer.addValue("2", new SimpleFillSymbol().setColor(new Color([0, 255, 0, 0.5])));
        renderer.addValue("1", new SimpleFillSymbol().setColor(new Color([0, 0, 255, 0.5])));
        // renderer.addValue("1", new SimpleFillSymbol().setColor(new Color([0, 255, 0])));
        // renderer.addValue("2", new SimpleFillSymbol().setColor(new Color([0, 0, 255])));

        this._doRenderer(renderer)
      },

      Blend: function () {
        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([0, 0, 0]), 3),
          new Color([255, 0, 0])
        );

        var blendRendererOptions = {
          blendMode: "lighten", //lighten darken
          symbol: symbol,
          fields: [
            {
              field: "户籍人口",
              color: new Color([255, 0, 0])
            }, {
              field: "流动人口",
              color: new Color([0, 0, 255])
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
          normalizationField: "总人口",
        };

        renderer = new BlendRenderer(blendRendererOptions);

        this._doRenderer(renderer)
      },

      Heatmap: function () {
        var renderer = new HeatmapRenderer({
          // 临时用colors，后面替换成colorStops，将颜色分级
          // colors: [
          //   "rgba(255, 0, 0, 0)","rgb(255, 0, 0)","rgb(255, 0, 255)", "rgb(0, 0, 255)"
          // ],
          colorStops: [
            { ratio: 0, color: "rgba(0, 0, 255, 0)" },
            { ratio: 0.7, color: "rgb(0, 0, 255)" },
            { ratio: 0.8, color: "rgb(255, 0, 255)" },
            { ratio: 0.9, color: "rgb(255, 0, 0)" }],
          blurRadius: 12,
          maxPixelIntensity: 100,
          minPixelIntensity: 1
        });

        this._doRenderer(renderer)
      },

      DotDensity: function () {
        var renderer = new DotDensityRenderer({
          backgroundColor: new Color([255, 255, 255]),
          dotShape: "circle",
          fields: [{
            name: "总人口",
            color: new Color([255, 0, 0])
          }],
          dotValue: 1000,
          dotSize: 2
        });

        this._doRenderer(renderer)
      },

      ScaleDependent: function () {
        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([0, 0, 0]), 3),
          new Color([255, 0, 0])
        );

        var renderer1 = new SimpleRenderer(symbol);
        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([0, 0, 0]), 3),
          new Color([0, 0, 255])
        );

        var renderer2 = new SimpleRenderer(symbol);

        var renderer3 = new ClassBreaksRenderer(symbol, "总人口");

        renderer3.addBreak(0, 50, new SimpleFillSymbol().setColor(new Color([0, 0, 0])));
        renderer3.addBreak(50, 100, new SimpleFillSymbol().setColor(new Color([125, 125, 125])));
        renderer3.addBreak(100, 90000, new SimpleFillSymbol().setColor(new Color([255, 255, 255])));
        renderer3.addBreak(90000, 180000, new SimpleFillSymbol().setColor(new Color([0, 255, 0])));
        renderer3.addBreak(180000, 240000, new SimpleFillSymbol().setColor(new Color([0, 0, 255])));

        var renderer = new ScaleDependentRenderer({
          rendererInfos: [{
            renderer: renderer1,
            maxScale: 100000,
            minScale: 200000
          }, {
            renderer: renderer2,
            maxScale: 200000,
            minScale: 300000
          }, {
            renderer: renderer3,
            maxScale: 300000,
            minScale: 500000
          }]
        });

        this._doRenderer(renderer)
      },

      _doRenderer: function (renderer) {
        if (this.layer.id == "DynamicLayer") {
          var layer = this.layer;
          var layerId = this.setVisibleLayer;

          var layerDrawingOptions = new LayerDrawingOptions();
          layerDrawingOptions.renderer = renderer;
          var optionsArray = [];
          optionsArray[layerId] = layerDrawingOptions;
          layer.setLayerDrawingOptions(optionsArray);

          this.map.removeLayer(layer);
          layer.refresh();
          this.map.addLayer(layer);
        } else {
          var layer = this.layer;
          layer.setRenderer(renderer);
          layer.refresh();
        }
      },

      //添加事件
      _bindEvents: function () {
        on($('.ui.button.blue.Dynamic'), 'click', lang.hitch(this, this._setLayer)),
          on($('.ui.button.blue.Feature'), 'click', lang.hitch(this, this.setFeaturelayer))
      },

      _afreshLayer: function () {

      },

      startup: function () {
        this.inherited(arguments);

        this.DynamicLayer = this.map.getLayer("DynamicLayer")
      }
    });
  });