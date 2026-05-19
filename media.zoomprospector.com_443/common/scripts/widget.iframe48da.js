function getQueryStringOfScript() {
    // get latest script added to the page (this script)
    var scripts = document.getElementsByTagName("script");
    var index = scripts.length - 1;
    // Replace src text with empty string, up to the ? in the src
    var querystring = scripts[index].src.replace(/^[^\?]+\?/, '');
    return querystring;
}
function parseQueryString(querystring) {
    // options: sst, width, height, environment
    var options = querystring.split("&");
    var len = options.length;
    var i = 0;
    var qsObj = {};
    for (; i < len; i++) {
        var optionValue = options[i].split("=");
        qsObj[optionValue[0].toLowerCase()] = optionValue[1];
    }

    return qsObj;
}
function parseParentQueryStringAndAddToScriptQSObject(qsObj) {
    var querystring = document.URL.replace(/^[^\?]+\?/, '');
    var options = querystring.split("&");
    var len = options.length;
    var i = 0;
    for (; i < len; i++) {
        var optionValue = options[i].split("=");
        var optionParamName = (optionValue[0].indexOf("zpe") != -1) ? optionValue[0].replace("zpe", "").toLowerCase() : "";
        if (optionParamName != "")
            qsObj[optionParamName] = optionValue[1];
    }
    //remove the mode parameter if DID parameter is present
    if (qsObj.did != null && qsObj.mode != null)
        delete qsObj.mode;

    return qsObj;
}
function buildIframe(qsobj) {
    var url = "";
    var width = "250px";
    var height = "100%";
    var defaultWidget = "buildings.aspx";
    if (qsobj.defaultView != null && qsobj.defaultView == "communities")
        defaultWidget = "communities.aspx";

    if (qsobj.environment) {
        if (qsobj.environment == "local")
            url = "//localhost/main/widgets/" + defaultWidget;
        else if (qsobj.environment == "staging")
            url = "//zpebeta.zoomprospector.com/main/widgets/" + defaultWidget;
        else 
            url = "//" + qsobj.sst + ".zoomprospector.com/main/widgets/" + defaultWidget;
    }
    else
        url = "//" + qsobj.sst + ".zoomprospector.com/main/widgets/" + defaultWidget;

    //pass additional querystring values to the url
    var requiredParameters = /(width)/;
    var containsQuestionMark = /\?/;
    for (var qs in qsobj) {
        // If it's not a required param, let's add it to the end of the url
        if (!requiredParameters.test(qs.toLowerCase())) {
            if (!containsQuestionMark.test(url)) {
                    url += "?";
            }
            // If url ends with a &
            if (/(&|\?)$/.test(url)) {
                url += qs + "=" + qsobj[qs];
            }
            else {
                url += "&" + qs + "=" + qsobj[qs];
            }
        }
    }

    if (qsobj.width) {
        width = qsobj.width;
    }
    if (qsobj.height) {
        height = qsobj.height;
    }
    var iframe = document.createElement("iframe");
    iframe.id = "zpewidgetiframe";
    iframe.src = url;
    iframe.width = width;
    iframe.height = height;
    iframe.scrolling = 'auto';
    iframe['frameBorder'] = '0';
    iframe['border'] = '0';
    iframe.style['border'] = '0';
    return iframe;
}
function ZPEIframeResize(height) {
    var iframe = document.getElementById('zpewidgetiframe');
    iframe.height = height + "px";
}
var querystring = getQueryStringOfScript();
// parse the options
var parsedQueryString = parseQueryString(querystring);
// parse querystring for parent window and append
parsedQueryString = parseParentQueryStringAndAddToScriptQSObject(parsedQueryString);

// build the iframe html
var iframe = buildIframe(parsedQueryString);
var scripts = document.getElementsByTagName("script");
var index = scripts.length - 1;

var div = document.createElement("div");
div.id = "zpewidgetcontainer";
div.style["overflow"] = "hidden";
div.style["height"] = "auto";
//div.innerHTML = iframehtml;
div.appendChild(iframe);
scripts[index].parentNode.appendChild(div);
var handleEvent = function (event) {
    if (event.data) {
        var heightRegex = /height_([0-9]+)/;
        if (heightRegex.test(event.data)) {
            //parse the height
            var height = heightRegex.exec(event.data)[1];
            // get current height, if they're the same, don't try to resize iframe
            ZPEIframeResize(height);
        }
    }
};
if (window.addEventListener) {
    window.addEventListener("message", handleEvent);
}
else if (window.attachEvent) {
    window.attachEvent('onmessage', handleEvent);
}
