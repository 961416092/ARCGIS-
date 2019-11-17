define([
  'dojo/_base/lang',
  'dojo/on',
  'dojo/topic',
  'dojo/mouse',
  'dojo/io-query',
  'dojo/domReady!',
  'dojo/dom-style',
  'dojo/_base/html',
  'dgp/dijit/HeadWidget',
], function (
  lang,
  on,
  topic,
  mouse,
  ioquery,
  domReady,
  domStyle,
  html,
  HeadWidget
) {
  var mo = {};

  dgpConfig = lang.mixin({
    mapId: 'map',
    mainPageId: 'main-page',
  }, dgpConfig);

  function initApp() {
    headWidget = new HeadWidget();
    headWidget.placeAt(dgpConfig.mainPageId);
    require(['widgets/RightPanel/rasterAnalysis'], function (rasterAnalysis) {
      headWidget.startup();
      rasterAnalysis = new rasterAnalysis({
        map: window.map
      }, "RightPanel");
      rasterAnalysis.startup();
    });
  };

  mo.initApp = initApp;
  return mo;
});