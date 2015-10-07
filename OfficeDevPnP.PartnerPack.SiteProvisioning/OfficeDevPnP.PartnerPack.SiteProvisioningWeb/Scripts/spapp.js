﻿var context;
var spHostUrl;
var appWebUrl;
var spLanguage;

function spApp() {
    var self = this;

    this.ready = [];
    this.onReady = function (callback) {
        if (context) {
            callback(context);
        } else {
            this.ready.push(callback);
        }
    };

    this.setup = function () {
        //Get the URI decoded SharePoint site url from the SPHostUrl parameter.
        spHostUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
        appWebUrl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
        spLanguage = decodeURIComponent(getQueryStringParameter('SPLanguage'));

        //Build absolute path to the layouts root with the spHostUrl
        var layoutsRoot = spHostUrl + '/_layouts/15/';

        //load all appropriate scripts for the page to function
        $.getScript(layoutsRoot + 'SP.Runtime.js',
            function () {
                $.getScript(layoutsRoot + 'SP.js',
                    function () {
                        //load scripts for cross site calls (needed to use the people picker control in an IFrame)
                        $.getScript(layoutsRoot + 'SP.RequestExecutor.js', function () {
                            //context = new SP.ClientContext(appWebUrl);
                            //var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl.toLowerCase());
                            //context.set_webRequestExecutorFactory(factory);

                            $.each(self.ready, function (i, c) {
                                c(context);
                            });
                        });
                    });
            });
    }

    //function to get a parameter value by a specific key
    function getQueryStringParameter(urlParameterKey) {
        var params = document.URL.split('?')[1].split('&');
        var strParams = '';
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split('=');
            if (singleParam[0] == urlParameterKey)
                return singleParam[1];
        }
    }
};

var spApp = new spApp();

//Wait for the page to load
$(document).ready(spApp.setup);