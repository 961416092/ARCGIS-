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
  'widgets/RenderPanel/renderer'
], function (
  lang,
  on,
  topic,
  mouse,
  ioquery,
  domReady,
  domStyle,
  html,
  HeadWidget,
  rendererWidget
) {
  var mo = {};

  dgpConfig = lang.mixin({
    mapId: 'map',
    mainPageId: 'main-page',
  }, dgpConfig);

  function initApp() {
    headWidget = new HeadWidget();
    headWidget.placeAt(dgpConfig.mainPageId);
    // require(['widgets/RenderPanel/renderer'], function (rendererWidget) {
    headWidget.startup();
    var renderer = new rendererWidget({
      map: window.map
    }, "RightPanel");
    renderer.startup();
    // });
  };

  mo.initApp = initApp;
  return mo;
});