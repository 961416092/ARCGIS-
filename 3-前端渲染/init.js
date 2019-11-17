var dojoConfig = null,
  dgpConfig = null;

serverUrl = null, //server url
  path = null;

(function (global) {
  _loadJSON(function (response) {
    var appInfo = JSON.parse(response);

    window.appInfo = appInfo;

    initEnv();
  });


  function initEnv() {

    dgpConfig = {
      mainPageId: 'main-page',
      mapId: 'map',
    };

    continueLoad();

    function continueLoad() {
      if (typeof require === 'undefined' || typeof jQuery === 'undefined') {
        if (window.console) {
          console.log('Waiting for API loaded.');
        }
        setTimeout(continueLoad, 100);
        return;
      }

      require(['dgp/main'], function (Main) {
        Main.initApp();
      });
    }
  };

  path = "/";

  function _loadJSON(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType && xhr.overrideMimeType('application/json');
    xhr.open('GET', 'configs/appConfig.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == '200') {
        callback(xhr.responseText);
      }
    }
    xhr.send(null);
  }

})(window);
