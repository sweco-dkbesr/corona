/**
 * window.CustomEvent for IE9, IE10 and IE11 support. new Event is not supported by IE.
 */
(function () {

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: undefined};
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

mmLoader = {
    queuedMiniMaps: [],
    isInitialized: false,
    isDebug: false, // NOTE: debug mode doesn't work with version 2.5 and 2.6
    scriptOrigin: "",

    getScriptOrigin: function (scriptname) {
        var scriptOrigin = "";
        var scriptRegex = new RegExp("(^|(.*?\\/))" + scriptname + "(\\?|$)");

        var scripts = document.getElementsByTagName('script');
        for (var i = 0, len = scripts.length; i < len; i++) {
            var src = scripts[i].getAttribute('src');
            if (src) {
                var match = src.match(scriptRegex);
                if (match) {
                    var originRegex = new RegExp("^((http:|https:|)//[^/]+/).*" + scriptname + "(\\?|$)");
                    match = src.match(originRegex);
                    if (match)
                        scriptOrigin = match[1];
                    this.isDebug = src.split("?debug=")[1] === "true";
                    break;
                }
            }
        }

        if (scriptOrigin === "") {
            scriptOrigin = window.location.origin + "/";
        }

        return scriptOrigin;
    },

    loadAPI: function (version) {
        var location = this.scriptOrigin;

        var script = document.createElement("script");

        if (this.isDebug) {
            script.src = location + "clientapi/minimap2/" + version + ".x/minimap.debug.js";
        } else {
            script.src = location + "clientapi/minimap2/" + version + ".x/minimap.js";
        }

        document.head.appendChild(script);
        var done = false;
        script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                var event = new CustomEvent("MINIMAP_API_LOADED"); // use 'new CustomEvent' because 'new Event' isn't supported in IE9,IE10, and IE11.
                window.dispatchEvent(event); // fire event to let custom implementation know that the API has been loaded.

                done = true;
                if (this.messageElement) {
                    this.messageElement.parentElement.removeChild(this.messageElement);
                }

                for (var i = 0; i < this.queuedMiniMaps.length; i++) {
                    new MiniMap.Widget(this.queuedMiniMaps[i]);
                }
                //cleanup
                delete window.mmLoader;
            }
        }.bind(this);
    },

    init: function (options) {
        this.options = options;

        //create a element for loading and error messages
        this.messageElement = document.createElement("p");
        var mapDiv = document.getElementById(this.options.mapDiv);

        if (mapDiv) {
            this.messageElement.setAttribute("style", "position: relative; top: 48%; left: 50%");

            mapDiv.appendChild(this.messageElement);

            this.browserLang = navigator.language ? navigator.language.substring(0, 2) : "en";

            if (!this.isBrowserSupported()) {
                this.messageBrowserNotSupported();
                return;
            }
        } else if (this.options.mapDiv !== undefined) {
            console.error("Could not find the element %o. Please check if it exist and that is has been loaded into the DOM.", this.options.mapDiv)
        }

        if (options && options.host) {
            if (options.host[options.host.length -1] === '/') {
                this.scriptOrigin = options.host;
            } else {
                this.scriptOrigin = options.host + '/';
            }
        } else {
            this.scriptOrigin = this.getScriptOrigin("mmloader.js");
        }
        var url = this.scriptOrigin + "spatialmap?page=minimap2.get-version-by-id&id=" + this.options.minimapId;

        this.messageLoadingMap();

        //create page request to retrieve minimap version by the minimap id.
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.onload = function () {
            if (xhr.status === 200) {
                var response;

                try {
                    response = JSON.parse(xhr.response);
                }
                catch (e) {
                    // We get here when server returns xml error message.
                    console.error("Unable to load the Minimap with id: " + this.options.minimapId + ". Server response: \n%o", xhr.response);
                    this.messageGeneralError();
                    return;
                }

                if (response.length === 0) {
                    console.error("Unable to load the Minimap with id: " + this.options.minimapId + ". It could not be found on the server.")
                    this.messageIdNotFound();
                    return;
                }

                this.mmVersionLoaded(response);
            }
        }.bind(this)

        xhr.send();
    },

    messageLoadingMap: function () {
        var loadingMessage = "Loading map...";
        if (this.browserLang === "da") {
            loadingMessage = "Henter kort..."
        } else if (this.browserLang === "sv") {
            loadingMessage = "Laddar karta...";
        }
        this.messageElement.textContent = loadingMessage;
    },

    messageBrowserNotSupported: function () {
        var errorMessage = "The map is not supported by your browser.";
        if (this.browserLang === "da") {
            errorMessage = "Kortet er ikke underst&oslash;ttet af din browser.";
        } else if (this.browserLang === "sv") {
            errorMessage = "Kartan underst&ouml;ds inte av denna browser";
        }
        this.messageElement.innerHTML = errorMessage;
    },

    messageGeneralError: function () {
        var errorMessage = "The map could not be loaded.";
        if (this.browserLang === "da") {
            errorMessage = "Kortet kunne ikke indl&aelig;ses."
        } else if (this.browserLang === "sv") {
            errorMessage = "Kartan kunde inte laddas.";
        }
        this.messageElement.innerHTML = errorMessage;
    },

    messageIdNotFound: function () {
        var errorMessage = "";
        if (this.browserLang === "da") {
            errorMessage = "Kortet blev ikke fundet p&aring; serveren."
        } else if (this.browserLang === "sv") {
            errorMessage = "Kartan kunde inte hittas p&aring; servern";
        } else {
            errorMessage = "The map could not be found on the server.";
        }
        this.messageElement.innerHTML = errorMessage;
    },

    mmVersionLoaded: function (response) {
        if (response.exception) {
            console.error(response.exception);
            this.messageGeneralError();
            return;
        }

        if (response.length === 0) {
            console.error("Unable to load the Minimap with id: " + this.options.minimapId + " could not be found on the server.");
            this.messageIdNotFound();
            return;
        }

        var version = response[0].version;
        this.loadAPI(version);
    },

    isBrowserSupported: function () {
        // We currently support Chrome, Firefox, Edge, and IE11.
        var _nua = navigator.userAgent || navigator.vendor || window.opera;

        // Check if the user is running a IE older than version 11.
        var isIE = _nua.indexOf("MSIE") > 1;
        if (isIE) {
            var version = parseInt(_nua.substring(_nua.indexOf("MSIE ") + 5, _nua.indexOf(".", _nua.indexOf("MSIE "))));
            return version > 10;
        }

        return true;
    }
};

MiniMap = {};

MiniMap.Widget = function (options) {
    // new MiniMap.Widget is deprecated. Please use MiniMap.CreateMiniMap instead.
    mmLoader.queuedMiniMaps.push(options);
    if (!mmLoader.isInitialized) {
        mmLoader.isInitialized = true;
        mmLoader.init(options);
    }
};

MiniMap.createMiniMap = function (options) {
    mmLoader.queuedMiniMaps.push(options);
    if (!mmLoader.isInitialized) {
        mmLoader.isInitialized = true;
        mmLoader.init(options);
    }
};

window.addEventListener("load", function () {
    // If a div in the page has class minimapwidget the mmloader should be initialized with that minimapId and mapDiv.
    // Only one minimap version is supported on each page, so we can initialize with the first div found.
    var minimapElements = document.querySelectorAll(".minimapwidget");
    if (window.mmLoader !== undefined && minimapElements[0]) {
        var options = {
            minimapId: minimapElements[0].getAttribute("minimapId"),
            mapDiv: minimapElements[0].getAttribute("id")
        };

        if (!mmLoader.isInitialized) {
            mmLoader.isInitialized = true;
            mmLoader.init(options);
        }
    }
});
