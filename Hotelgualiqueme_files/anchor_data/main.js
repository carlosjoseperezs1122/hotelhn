(function(){
var KasperskyLab = {SIGNATURE:"7D8B79A2-8974-4D7B-A76A-F4F29624C06BWVjU51_wvkC80Ejiupd5BUMHEVYPqpLieYu3hpcsJ-45g-Q1MWgk5k2xwHUvB9On5g4zrhSCTSI0NX5oPPu_Mg",PREFIX:"https://ff.kis.v2.scr.kaspersky-labs.com/",INJECT_ID:"FD126C42-EBFA-4E12-B309-BB3FDD723AC1",RESOURCE_ID:"E3E8934C-235A-4B0E-825A-35A08381A191",IsWebExtension: function(){return false;}}; var KasperskyLab = (function IeJsonMain(context) 
{
    function GetClass(obj) {
        if (typeof obj === "undefined")
            return "undefined";
        if (obj === null)
            return "null";
        return Object.prototype.toString.call(obj)
            .match(/^\[object\s(.*)\]$/)[1];
    }
    var exports = {}, undef;
    function ObjectToJson(object) {
        if (object === null || object === Infinity || object === -Infinity || object === undef)
            return "null";
        var className = GetClass(object);
        if (className === "Boolean") {
            return "" + object;
        } else if (className === "Number") {
            return window.isNaN(object) ? "null" : "" + object;
        } else if (className === "String") {
            var escapedStr = "" + object;
            return "\"" + escapedStr.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + "\"";
        }
        if (typeof object === "object") {
            if (!ObjectToJson.check) ObjectToJson.check = [];
            for (var i=0, chkLen=ObjectToJson.check.length ; i<chkLen ; ++i) {
                if (ObjectToJson.check[i] === object) {
                    throw new TypeError();
                }
            }
            ObjectToJson.check.push(object);
            var str = '';
            if (className === "Array" || className === "Array Iterator") {
                for (var index = 0, length = object.length; index < length; ++index) {
                    str += ObjectToJson(object[index]) + ',';
                }
                ObjectToJson.check.pop();
                return "["+str.slice(0,-1)+"]";
            } else {
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        str += '"' + property + '":' + ObjectToJson(object[property]) + ',';
                    }
                }
                ObjectToJson.check.pop();
                return "{"+str.slice(0,-1)+"}";
            }
        }
        return undef;
    }
    exports.stringify = function stringify(source) {
        return ObjectToJson(source);
    };
    var parser = {
        source : null,
        grammar : /^[\x20\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/,
        ThrowError : function ThrowError() {
            throw new SyntaxError('JSON syntax error');
        },
        NextToken : function NextToken(token) {
            this.source = token.input.slice(token[0].length);
            return this.grammar.exec(this.source);
        },
        ParseArray : function ParseArray(){
            var token = this.grammar.exec(this.source),
                parseItem = token && token[1] !== ']',
                result = [];
            for(;;token = this.NextToken(token)) {
                if (!token)
                    this.ThrowError();
                if (parseItem) {
                    result.push(this.ParseValue(token));
                    token = this.grammar.exec(this.source);
                } else {
                    if (token[1]) {
                        if (token[1] === ']') {
                            break;
                        } else if (token[1] !== ',') {
                            this.ThrowError();
                        }
                    } else {
                        this.ThrowError();
                    }
                }
                parseItem = !parseItem;
            }
            return result;
        },
        ParseObject : function ParseObject(){
            var propertyName, parseProperty = true, result = {};
            for(var token = this.grammar.exec(this.source);;token = this.NextToken(token)) {
                if (!token)
                    this.ThrowError();
                if (parseProperty) {
                    if (token[1] && token[1] === '}') {
                        break;
                    } else if (token[1] || token[2] || !token[3]) {
                        this.ThrowError();
                    }
                    propertyName = token[3];
                    token = this.NextToken(token);
                    if (!token || !token[1] || token[1] !== ':')
                        this.ThrowError();
                    parseProperty = false;
                } else {
                    if (!propertyName)
                        this.ThrowError();
                    result[ propertyName ] = this.ParseValue(token);
                    token = this.NextToken(this.grammar.exec(this.source));
                    if (token[1]) {
                        if (token[1] === '}') {
                            break;
                        } else if (token[1] !== ',') {
                            this.ThrowError();
                        }
                    } else {
                        this.ThrowError();
                    }
                    propertyName = undef;
                    parseProperty = true;
                }
            }
            return result;
        },
        ParseValue : function ParseValue(token){
            if (token[1]) {
                switch (token[1]){
                    case '[' :
                        this.source = this.source.slice(token[0].length);
                        return this.ParseArray();
                    case '{' :
                        this.source = this.source.slice(token[0].length);
                        return this.ParseObject();
                    case 'true' :
                        return true;
                    case 'false' :
                        return false;
                    case 'null' :
                        return null;
                    default:
                        this.ThrowError();
                }
            } else if (token[2]) {
                return  +token[2];
            }
            return token[3].replace(/\\(?:u(.{4})|(["\\\/'bfnrt]))/g, function replaceCallback(substr, utfCode, esc){
                if(utfCode)
                {
                    return String.fromCharCode(parseInt(utfCode, 16));
                }
                else
                {
                    switch(esc) {
                        case 'b': return '\b';
                        case 'f': return '\f';
                        case 'n': return '\n';
                        case 'r': return '\r';
                        case 't': return '\t';
                        default:
                            return esc;
                    }
                }
            });
        },
        Parse : function Parse(str) {
            if ('String' !== GetClass(str))
                throw new TypeError();
            this.source = str;
            var token = this.grammar.exec(this.source);
            if (!token)
                this.ThrowError();
            return this.ParseValue(token);
        }
    };
    exports.parse = function parse(source) {
        return parser.Parse(source);
    };
    if (window.JSON)
    {
        var originStringify = JSON.stringify;
        function StringifyWrapper(source)
        {
            if (Array.prototype.toJSON || String.prototype.toJSON)
                return exports.stringify(source);
            return originStringify(source);
        }
        context["JSONStringify"] = JSON.stringify ? StringifyWrapper : exports.stringify;
        context["JSONParse"] = JSON.parse || exports.parse;
    }
    else
    {
        context["JSONStringify"] = exports.stringify;
        context["JSONParse"] = exports.parse;
    }
    return context;
})(KasperskyLab || {});
(function CommonMain(ns)
{
    ns.XMLHttpRequest = window.XMLHttpRequest;
    ns.XDomainRequest = window.XDomainRequest;
    ns.XMLHttpRequestOpen = window.XMLHttpRequest && window.XMLHttpRequest.prototype.open;
    ns.XMLHttpRequestSend = window.XMLHttpRequest && window.XMLHttpRequest.prototype.send;
    ns.XMLHttpRequestSetRequestHeader = window.XMLHttpRequest && window.XMLHttpRequest.prototype.setRequestHeader;
    ns.EmptyFunc = function EmptyFunc()
    {
    };
    ns.MaxRequestDelay = 2000;
    ns.Log = ns.EmptyFunc;
    ns.SessionLog = ns.Log;
    ns.SessionError = ns.Log;
    function GetHostAndPort(url)
    {
        var urlString = typeof url !== "string" ? url.toString() : url;
        var hostBeginPos = urlString.indexOf("//");
        if (hostBeginPos === -1)
        {
            urlString = document.baseURI || "";
            hostBeginPos = urlString.indexOf("//");
            if (hostBeginPos === -1)
                return "";
        }
        hostBeginPos += 2;
        var hostEndPos = urlString.indexOf("/", hostBeginPos);
        if (hostEndPos === -1)
            hostEndPos = urlString.length;
        var originParts = urlString.substring(0, hostEndPos).split("@");
        var origin = originParts.length > 1 ? originParts[1] : originParts[0];
        return origin[0] === "/" ? document.location.protocol + origin : origin;
    }
    ns.IsCorsRequest = function IsCorsRequest(url, initiator)
    {
        var urlOrigin = GetHostAndPort(url);
        var initiatorOrigin = GetHostAndPort(initiator);
        return Boolean(urlOrigin) && Boolean(initiatorOrigin) && urlOrigin !== initiatorOrigin;
    };
    ns.TryCreateUrl = function TryCreateUrl(url)
    {
        try
        {
            return new URL(url);
        }
        catch (e)
        {
            ns.SessionLog("Can't create URL from " + url);
            return null;
        }
    };
    ns.GetResourceSrc = function GetResourceSrc(resourceName)
    {
        return ns.GetBaseUrl() + ns.RESOURCE_ID + resourceName;
    };
    ns.IsRelativeTransport = function IsRelativeTransport()
    {
        return ns.PREFIX === "/";
    };
    ns.GetBaseUrl = function GetBaseUrl()
    {
        if (!ns.IsRelativeTransport())
            return ns.PREFIX;
        return document.location.protocol + "//" + document.location.host + "/";
    };
    ns.AddEventListener = function AddEventListener(element, name, func, pluginId)
    {
        if (typeof element.addEventListener === "function")
        {
            element.addEventListener(name, 
                function EventListenerCallback(e) 
                {
                    try
                    {
                        func(e || window.event);
                    }
                    catch (ex)
                    {
                        ns.SessionError(ex, pluginId);
                    }
                }, 
                true);
        }
        else
        {
            element.attachEvent("on" + name, 
                function EventListenerCallback(e)
                {
                    try
                    {
                        func.call(element, e || window.event);
                    }
                    catch (ex)
                    {
                        ns.SessionError(ex, pluginId);
                    }
                });
        }
    };
    ns.AddRemovableEventListener = function AddRemovableEventListener(element, name, func)
    {
        if (element.addEventListener)
            element.addEventListener(name, func, true);
        else
            element.attachEvent("on" + name, func);
    };
    ns.RunModule = function RunModule(func, timeout)
    {
        if (document.readyState === "loading")
        {
            if (timeout)
                ns.SetTimeout(func, timeout);
            var delayFunc = function DelayFunc() { ns.SetTimeout(func, 0); };
            if (document.addEventListener)
                ns.AddEventListener(document, "DOMContentLoaded", delayFunc);
            ns.AddEventListener(window, "load", delayFunc);
        }
        else
        {
            try
            {
                func();
            }
            catch (e)
            {
                ns.SessionError(e);
            }
        }
    };
    ns.RemoveEventListener = function RemoveEventListener(element,  name, func)
    {
        if (element.removeEventListener)
            element.removeEventListener(name, func, true);
        else
            element.detachEvent("on" + name, func);
    };
    var oldSetTimeout = setTimeout;
    ns.SetTimeout = function SetTimeout(func, timeout, pluginId)
    {
        return oldSetTimeout(function TimerCallback()
            {
                try
                {
                    func();
                }
                catch (e)
                {
                    ns.SessionError(e, pluginId);
                }
            },
            timeout);
    };
    var oldSetInterval = setInterval;
    ns.SetInterval = function SetInterval(func, interval, pluginId)
    {
        return oldSetInterval(function IntervalCallback()
            {
                try
                {
                    func();
                }
                catch (e)
                {
                    ns.SessionError(e, pluginId);
                }
            },
            interval);
    };
    function InsertStyleRule(style, rule)
    {
        if (style.styleSheet)
        {
            style.styleSheet.cssText += rule + "\n";
        }
        else
        {
            style.appendChild(document.createTextNode(rule));
            ns.SetTimeout(function TimerCallback()
                {
                    if (!style.sheet)
                        return;
                    var rules = style.sheet.cssRules || style.sheet.rules;
                    if (rules && rules.length === 0)
                        style.sheet.insertRule(rule);
                }, 500);
        }
    }
    function AddDocumentStyles(document, rules)
    {
        if (typeof rules !== "object" || rules.constructor !== Array)
            return [];
        var styles = [];
        for (var i = 0, len = rules.length; i < len;)
        {
            var style = document.createElement("style");
            style.type = "text/css";
            style.setAttribute("nonce", ns.ContentSecurityPolicyNonceAttribute);
            for (var n = 0; n < 4 && i < len; ++n, ++i)
            {
                var rule = rules[i];
                if (document.querySelectorAll)
                {
                    InsertStyleRule(style, rule);
                }
                else
                {
                    var styleBegin = rule.lastIndexOf("{");
                    if (styleBegin === -1)
                        continue;
                    var styleText = rule.substr(styleBegin);
                    var selectors = rule.substr(0, styleBegin).split(",");
                    if (style.styleSheet)
                    {
                        var cssText = "";
                        for (var j = 0; j !== selectors.length; ++j)
                            cssText += selectors[j] + styleText + "\n";
                        style.styleSheet.cssText += cssText;
                    }
                    else
                    {
                        for (var k = 0; k !== selectors.length; ++k)
                            style.appendChild(document.createTextNode(selectors[k] + styleText));
                    }
                }
            }
            if (document.head)
            {
                document.head.appendChild(style);
            }
            else
            {
                var head = document.getElementsByTagName("head")[0];
                if (head)
                {
                    head.appendChild(style);
                }
                else
                {
                    ns.AddEventListener(document, "load", function AddStyle()
                    {
                        var element = document.getElementsByTagName("head")[0];
                        for (var l = 0; l !== styles.length; ++l)
                            element.appendChild(styles[l]); 
                    });
                }
            }
            styles.push(style);
        }
        return styles;
    }
    ns.AddStyles = function AddStyles(rules)
    {
        return AddDocumentStyles(document, rules);
    };
    ns.GetCurrentTime = function GetCurrentTime()
    {
        try
        {
            var date = new Date();
            if (date && date.getTime)
                return date.getTime();
            throw new Error("Cannot call getTime for date: " + date);
        }
        catch (e)
        {
            ns.SessionError(e);
            return 0;
        }
    };
    ns.GetPageScroll = function GetPageScroll()
    {
        return {
                left: (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft,
                top: (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
            };
    };
    ns.GetPageHeight = function GetPageHeight()
    {
        return document.documentElement.clientHeight || document.body.clientHeight;
    };
    ns.GetPageWidth = function GetPageWidth()
    {
        return document.documentElement.clientWidth || document.body.clientWidth;
    };
    ns.IsDefined = function IsDefined(variable)
    {
        return typeof variable !== "undefined";
    };
    ns.StopProcessingEvent = function StopProcessingEvent(evt)
    {
        if (evt.preventDefault)
            evt.preventDefault();
        else
            evt.returnValue = false;
        if (evt.stopPropagation)
            evt.stopPropagation();
        if (ns.IsDefined(evt.cancelBubble))
            evt.cancelBubble = true;
    };
    ns.ToBase64 = function ToBase64(value)
    {
        if (ns.IsDefined(window.btoa))
            return btoa(value);
        var Base64Alphabit = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var plain = value;
        var padLength = 0;
        if (plain.length % 3)
        {
            padLength = 3 - (plain.length % 3);
            for (var j = 0; j < padLength; ++j)
                plain += "\0";
        }
        var result = "";
        for (var i = 0; i < plain.length; i += 3)
        {
            var byte1 = plain.charCodeAt(i);
            var byte2 = plain.charCodeAt(i + 1);
            var byte3 = plain.charCodeAt(i + 2);
            var temp = (byte1 << 16) | (byte2 << 8) | byte3;
            var sixBit1 = (temp >> 18) & 0x3f;
            var sixBit2 = (temp >> 12) & 0x3f;
            var sixBit3 = (temp >> 6) & 0x3f;
            var sixBit4 = temp & 0x3f;
            result += Base64Alphabit.charAt(sixBit1) + Base64Alphabit.charAt(sixBit2) + Base64Alphabit.charAt(sixBit3) + Base64Alphabit.charAt(sixBit4);
        }
        if (padLength > 0)
        {
            result = result.slice(0, result.length - padLength);
            for (var k = 0; k < padLength; ++k)
                result += "=";
        }
        return result;
    };
    ns.StartLocationHref = document.location.href;
    ns.IsTopLevel = window && window === window.top;
    ns.GetPageStartTime = function GetPageStartTime()
    {
        return window && window.performance && window.performance.timing && window.performance.timing.domContentLoadedEventStart
            ? window.performance.timing.domContentLoadedEventStart
            : 0;
    };
    return ns;
})(KasperskyLab);
(function CommonMutation(ns)
{
    function IsElementNode(node)
    {
        return node.nodeType === 1; 
    }
    function IsNodeContainsElementWithTag(node, observeTag)
    {
        try
        {
            return observeTag === "*" || (IsElementNode(node) && ((node.tagName && node.tagName.toLowerCase() === observeTag) || node.getElementsByTagName(observeTag).length > 0));
        }
        catch (e)
        {
            return false;
        }
    }
    function MutationChangeObserver(observeTag, pluginId)
    {
        var m_observer = null;
        var m_callback = null;
        var m_functionCheckInteresting = observeTag ? function functionCheckInteresting(node) { return IsNodeContainsElementWithTag(node, observeTag); } : IsElementNode;
        function ProcessNodeList(nodeList)
        {
            for (var i = 0; i < nodeList.length; ++i)
            {
                if (m_functionCheckInteresting(nodeList[i]))
                    return true;
            }
            return false;
        }
        function ProcessDomChange(records)
        {
            try
            {
                if (!m_callback)
                    return;
                for (var i = 0; i < records.length; ++i)
                {
                    var record = records[i];
                    if ((record.addedNodes.length && ProcessNodeList(record.addedNodes))
                        || (record.removedNodes.length && ProcessNodeList(record.removedNodes)))
                    {
                        m_callback();
                        return;
                    }
                }
            }
            catch (e)
            {
                ns.SessionError(e, pluginId);
            }
        }
        this.Start = function Start(callback)
        {
            m_callback = callback;
            m_observer = new MutationObserver(ProcessDomChange);
            m_observer.observe(document, { childList: true, subtree: true });
        };
        this.Stop = function Stop()
        {
            m_observer.disconnect();
            m_callback = null;
        };
    }
    function DomEventsChangeObserver(observeTag, pluginId)
    {
        var m_callback = null;
        var m_functionCheckInteresting = observeTag ? function functionCheckInteresting(node) { return IsNodeContainsElementWithTag(node, observeTag); } : IsElementNode;
        function ProcessEvent(event)
        {
            try
            {
                if (!m_callback)
                    return;
                if (m_functionCheckInteresting(event.target))
                    m_callback();
            }
            catch (e)
            {
                ns.SessionError(e, pluginId);
            }
        }
        this.Start = function Start(callback)
        {
            ns.AddRemovableEventListener(window, "DOMNodeInserted", ProcessEvent);
            ns.AddRemovableEventListener(window, "DOMNodeRemoved", ProcessEvent);
            m_callback = callback;
        };
        this.Stop = function Stop()
        {
            ns.RemoveEventListener(window, "DOMNodeInserted", ProcessEvent);
            ns.RemoveEventListener(window, "DOMNodeRemoved", ProcessEvent);
            m_callback = null;
        };
    }
    function TimeoutChangeObserver(observeTag)
    {
        var m_interval = null;
        var m_callback = null;
        var m_tagCount = 0;
        var m_attribute = "klot_" + ns.GetCurrentTime();
        function IsChangesOccure(nodeList)
        {
            for (var i = 0; i < nodeList.length; ++i)
            {
                if (!nodeList[i][m_attribute])
                    return true;
            }
            return false;
        }
        function FillTagInfo(nodeList)
        {
            m_tagCount = nodeList.length;
            for (var i = 0; i < m_tagCount; ++i)
                nodeList[i][m_attribute] = true;
        }
        function TimeoutProcess()
        {
            if (!m_callback)
                return;
            var nodeList = observeTag ? document.getElementsByTagName(observeTag) : document.getElementsByTagName("*");
            if (nodeList.length !== m_tagCount || IsChangesOccure(nodeList))
            {
                FillTagInfo(nodeList);
                m_callback();
            }
        }
        this.Start = function Start(callback)
        {
            m_callback = callback;
            FillTagInfo(document.getElementsByTagName(observeTag));
            m_interval = ns.SetInterval(TimeoutProcess, 10 * 1000);
            if (document.readyState !== "complete")
                ns.AddEventListener(window, "load", TimeoutProcess);
        };
        this.Stop = function Stop()
        {
            clearInterval(m_interval);
            m_callback = null;
        };
    }
    ns.GetDomChangeObserver = function GetDomChangeObserver(observeTag, pluginId)
    {
        var observeTagLowerCase = observeTag ? observeTag.toLowerCase() : observeTag;
        if (window.MutationObserver && document.documentMode !== 11)    
            return new MutationChangeObserver(observeTagLowerCase, pluginId);
        if (window.addEventListener)
            return new DomEventsChangeObserver(observeTagLowerCase, pluginId);
        return new TimeoutChangeObserver(observeTagLowerCase);
    };
    return ns;
})(KasperskyLab);
(function Md5Main(ns) {
    function md5cycle(x, k) {
        var a = x[0],
        b = x[1],
        c = x[2],
        d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b^c^d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c^(b | (~d)), a, b, x, s, t);
    }
    function md51(s) {
        var n = s.length,
        state = [1732584193, -271733879, -1732584194, 271733878],
        i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++)
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++)
                tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }
    function md5blk(s) {
        var md5blks = [],
        i;
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) +
                 (s.charCodeAt(i + 1) << 8) +
                 (s.charCodeAt(i + 2) << 16) +
                 (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }
    var hex_chr = '0123456789abcdef'.split('');
    function rhex(n) {
        var s = '',
        j = 0;
        for (; j < 4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]+hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }
    function hex(x) {
        for (var i = 0; i < x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('');
    }
    ns.md5 = function md5(s) {
        return hex(md51(s));
    };
    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }
    if (ns.md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
        add32 = function add32(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
    }
})(KasperskyLab);
(function AjaxTransportMain(ns)
{
var oldEncodeUri = encodeURI;
var ajaxRequestProvider = (function ajaxRequestProvider()
    {
        return {
            GetAsyncRequest: function GetAsyncRequest()
                {
                    var xmlhttp = ns.XDomainRequest ? new ns.XDomainRequest() : new ns.XMLHttpRequest();
                    if (!ns.XDomainRequest)
                    {
                        xmlhttp.open = ns.XMLHttpRequestOpen;
                        xmlhttp.send = ns.XMLHttpRequestSend;
                        xmlhttp.setRequestHeader = ns.XMLHttpRequestSetRequestHeader;
                    }
                    xmlhttp.onprogress = ns.EmptyFunc;
                    return xmlhttp;
                },
            GetSyncRequest: function GetSyncRequest()
                {
                    var xmlhttp = new ns.XMLHttpRequest();
                    xmlhttp.open = ns.XMLHttpRequestOpen;
                    xmlhttp.send = ns.XMLHttpRequestSend;
                    xmlhttp.setRequestHeader = ns.XMLHttpRequestSetRequestHeader;
                    xmlhttp.onprogress = ns.EmptyFunc;
                    return xmlhttp;
                }
        };
    })();
var restoreSessionCallback = ns.EmptyFunc;
var PingPongCallReceiver = function PingPongCallReceiver(caller)
{
    var m_caller = caller;
    var m_isProductConnected = false;
    var m_pingWaitResponse = false;
    var m_requestDelay = ns.MaxRequestDelay;
    var m_requestTimer = null;
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    var m_updateCallback = ns.EmptyFunc;
    var m_pluginId = "ajax";
    var m_waitRequestsCount = 0;
    function SendRequest()
    {
        try 
        {
            m_waitRequestsCount++;
            m_caller.Call(
                "from",
                null,
                null,
                 true,
                function CallCallback(result, parameters, method)
                {
                    m_pingWaitResponse = false;
                    m_isProductConnected = true;
                    if (parameters === "undefined" || method === "undefined") 
                    {
                        m_errorCallback("AJAX pong is not received. Product is deactivated");
                        m_waitRequestsCount--;
                        return;
                    }
                    if (method)
                    {
                        ns.SetTimeout(function TimerCallback() { SendRequest(); }, 0, m_pluginId);
                        m_callCallback(method, parameters);
                    }
                    m_waitRequestsCount--;
                },
                function ErrorCallback(error)
                {
                    m_pingWaitResponse = false;
                    m_isProductConnected = false;
                    restoreSessionCallback();
                    m_errorCallback(error);
                    m_waitRequestsCount--;
                }
                );
            m_pingWaitResponse = true;
        }
        catch (e)
        {
            m_errorCallback("Ajax send ping exception: " + (e.message || e));
        }
    }
    function Ping()
    {
        try
        {
            if (m_pingWaitResponse)
            {
                m_requestTimer = ns.SetTimeout(Ping, 100, m_pluginId);
                return;
            }
            m_requestDelay = m_updateCallback();
            SendRequest();
            m_requestTimer = ns.SetTimeout(Ping, m_requestDelay, m_pluginId);
        }
        catch (e)
        {
            m_errorCallback("Send ping request: " + (e.message || e));
        }
    }
    this.StartReceive = function StartReceive(callCallback, errorCallback, updateCallback)
    {
        m_isProductConnected = true;
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        m_updateCallback = updateCallback;
        m_requestDelay = m_updateCallback();
        m_requestTimer = ns.SetTimeout(Ping, m_requestDelay, m_pluginId);
    };
    this.ForceReceive = function ForceReceive()
    {
        clearTimeout(m_requestTimer);
        m_requestTimer = ns.SetTimeout(Ping, 0, m_pluginId);
    };
    this.StopReceive = function StopReceive()
    {
        if (m_requestTimer)
        {
            clearTimeout(m_requestTimer);
            m_requestTimer = null;
        }
        m_callCallback = ns.EmptyFunc;
        m_errorCallback = ns.EmptyFunc;
        m_updateCallback = ns.EmptyFunc;
    };
    this.IsStarted = function IsStarted()
    {
        return m_requestTimer !== null;
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_isProductConnected;
    };
    this.GetWaitRequests = function GetWaitRequests()
    {
        if (m_requestTimer)
        {
            clearTimeout(m_requestTimer);
            m_requestTimer = null;
        }
        return m_waitRequestsCount;
    };
};
var LongPoolingReceiver = function LongPoolingReceiver(caller)
{
    var m_caller = caller;
    var m_isProductConnected = false;
    var m_isStarted = false;
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    var m_pluginId = "long_pooling";
    function SendRequest(onResponseCallback)
    {
        try 
        {
            m_isProductConnected = true;
            m_caller.Call(
                "longpooling",
                null,
                null,
                 true,
                onResponseCallback,
                function ErrorCallback(error)
                {
                    m_isProductConnected = false;
                    restoreSessionCallback();
                    m_errorCallback(error);
                },
                true
                );
        }
        catch (e)
        {
            ns.SessionError(e, "ajax_longpooling");
            m_errorCallback("Ajax send ping exception: " + (e.message || e));
        }
    }
    function OnResponse(result, parameters, method)
    {
        if (!ns.IsDefined(parameters) || !ns.IsDefined(method))
        {
            m_errorCallback("AJAX pong is not received. Product is deactivated");
            return;
        }
        ns.SetTimeout(function TimerCallback() { SendRequest(OnResponse); }, 0, m_pluginId);
        if (method)
            m_callCallback(method, parameters);
    }
    this.StartReceive = function StartReceive(callCallback, errorCallback)
    {
        m_isStarted = true;
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        SendRequest(OnResponse);
    };
    this.ForceReceive = ns.EmptyFunc;
    this.StopReceive = function StopReceive()
    {
        m_isStarted = false;
        m_callCallback = ns.EmptyFunc;
        m_errorCallback = ns.EmptyFunc;
    };
    this.IsStarted = function IsStarted()
    {
        return m_isStarted;
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_isProductConnected;
    };
};
var AjaxCallerImpl = function AjaxCallerImpl(onLongPoolingEnable)
{
    var m_path = ns.GetBaseUrl() + ns.SIGNATURE;
    var m_longPoolingRequest = null;
    var m_pluginId = "ajax_caller";
    function NoCacheParameter() 
    {
        return "&nocache=" + Math.floor((1 + Math.random()) * 0x10000).toString(16);
    }
    function PrepareRequestObject(command, commandAttribute, isPost, isAsync)
    {
        var request = isAsync ? ajaxRequestProvider.GetAsyncRequest() : ajaxRequestProvider.GetSyncRequest();
        if (request)
        {
            var urlPath = m_path + "/" + command;
            if (commandAttribute)
                urlPath += "/" + commandAttribute;
            if (isPost)
            {
                request.open("POST", urlPath);
            }
            else
            {
                if (urlPath.indexOf("?") === -1)
                    urlPath += "?get";
                urlPath += NoCacheParameter();
                request.open("GET", urlPath, isAsync);
            }
            if (request.setRequestHeader && ns.IsRelativeTransport())
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
        return request;
    }
    function ClearRequest(request)
    {
        request.onerror = ns.EmptyFunc;
        request.onload = ns.EmptyFunc;
    }
    function GetResponseText(request)
    {
        try
        {
            if (!ns.IsDefined(request.status) || request.status === 200)
                return request.responseText.toString();
        }
        catch (e)
        {
            ns.SessionLog(e);
        }
        return "";
    }
    function AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall)
    {
        try
        {
            var request = PrepareRequestObject(command, commandAttribute, Boolean(data), true);
            if (!request) 
            {
                callbackError && callbackError("Cannot create AJAX request!");
                return;
            }
            request.onerror = function onerror()
                {
                    ClearRequest(request);
                    callbackError && callbackError("AJAX request error for calling " + command + "/" + commandAttribute);
                };
            request.onload = function onload()
                {
                    try
                    {
                        ClearRequest(request);
                        var responseText = GetResponseText(request);
                        if (responseText)
                        {
                            if (callbackResult)
                                callbackResult(responseText);
                            return;
                        }
                        if (callbackError)
                            callbackError("AJAX request with unsupported url type!"); 
                    }
                    catch (e)
                    {
                        ns.SessionError(e, m_pluginId);
                    }
                };
            if (isLongPoolingCall)
                m_longPoolingRequest = request;
            request.send(data);
        }
        catch (e)
        {
            if (callbackError)
                callbackError("AJAX request " + command  + "/" + commandAttribute + " exception: " + (e.message || e));
        }
    }
    function SyncCall(command, commandAttribute, data, callbackResult, callbackError)
    {
        try
        {
            var request = PrepareRequestObject(command, commandAttribute + "?" + oldEncodeUri(data), false, false);
            if (!request)
            {
                callbackError && callbackError("Cannot create AJAX request!");
                return false;
            }
            request.send();
            if (!ns.IsDefined(request.status) || request.status === 200)
            {
                if (callbackResult && request.responseText)
                    callbackResult(request.responseText);
                request = null;
                return true;
            }
        }
        catch (e)
        {
            if (callbackError)
                callbackError("AJAX request " + command + " exception: " + (e.message || e));
        }
        return false;
    }
    this.Start = function Start(callbackSuccess)
    {
        callbackSuccess();
    };
    this.SendLog = function SendLog(message)
    {
        AsyncCall("log?" + encodeURIComponent(message));
    };
    this.SendResult = function SendResult(methodName, data)
    {
        AsyncCall("callResult", methodName, data);
    };
    this.Call = function Call(command, commandAttribute, data, isAsync, callbackResult, callbackError, isLongPoolingCall) 
    {
        var callFunction = (isAsync || !ns.IsDefined(isAsync)) ? AsyncCall : SyncCall;
        return callFunction(
            command,
            commandAttribute,
            data,
            function CallCallback(responseText)
            {
                var commandResponse = ns.JSONParse(responseText);
                if (commandResponse.result === -1610612735)
                {
                    callFunction(
                        command,
                        commandAttribute,
                        data,
                        function callCallback(response)
                        {
                            if (!callbackResult)
                                return;
                            commandResponse = ns.JSONParse(response);
                            callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
                        },
                        callbackError,
                        isLongPoolingCall
                        );
                }
                else if (callbackResult)
                {
                    callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
                }
            },
            callbackError,
            isLongPoolingCall
            );
    };
    this.Shutdown = function Shutdown()
    {
        if (m_longPoolingRequest)
        {
            if (m_longPoolingRequest.abort)
                m_longPoolingRequest.abort();
            ClearRequest(m_longPoolingRequest);
            m_longPoolingRequest = null;
        }
    };
    this.InitCall = function InitCall(initData, callbackResult, callbackError)
    {
        restoreSessionCallback = callbackError;
        if (ns.StartLocationHref === "data:text/html,chromewebdata")
            return callbackError();
        AsyncCall(
            "init?data=" + encodeURIComponent(ns.ToBase64(ns.JSONStringify(initData))),
            null,
            null,
            function AsyncCallCallback(responseText)
            {
                try
                {
                    var initSettings = ns.JSONParse(responseText);
                    m_path = ns.GetBaseUrl() + initSettings.ajaxId + "/" + initSettings.sessionId;
                    if (initSettings.longPooling)
                        onLongPoolingEnable();
                    callbackResult(initSettings);
                } 
                catch (e)
                {
                    restoreSessionCallback && restoreSessionCallback("Error " + e.name + ": " + e.message);
                }
            },
            callbackError
            );
    };
};
ns.AjaxCaller = function AjaxCaller()
{
    var m_switchToLongPooling = false;
    var m_caller = new AjaxCallerImpl(OnLongPoolingEnable);
    var m_receiver = new PingPongCallReceiver(m_caller);
    var m_callCallback = ns.EmptyFunc;
    var m_errorCallback = ns.EmptyFunc;
    function StartLongPooling(needRestartReceive)
    {
        m_receiver = new LongPoolingReceiver(m_caller);
        if (needRestartReceive)
            m_receiver.StartReceive(m_callCallback, m_errorCallback);
        ns.SessionLog("Switch to longpooling, receiver restarted: " + needRestartReceive);
    }
    function RestartReceiver()
    {
        var requestsCount = m_receiver.GetWaitRequests();
        if (requestsCount !== 0)
        {
            ns.SessionLog("Wait requests count: " + requestsCount);
            ns.SetTimeout(RestartReceiver, 100, "ajax_caller");
        }
        else
        {
            m_receiver.StopReceive();
            StartLongPooling(true);
        }
    }
    function SwitchToLongPooling()
    {
        var needRestartReceive = m_receiver.IsStarted();
        if (needRestartReceive)
            RestartReceiver();
        else
            StartLongPooling(false);
    }
    function OnLongPoolingEnable()
    {
        if (document.readyState === "complete")
            SwitchToLongPooling();
        else
            m_switchToLongPooling = true;
    }
    this.Start = function Start(callbackSuccess)
    {
        m_caller.Start(callbackSuccess);
    };
    this.SendLog = function SendLog(message)
    {
        m_caller.SendLog(message);
    };
    this.SendResult = function SendResult(methodName, data)
    {
        m_caller.SendResult(methodName, data);
    };
    this.Call = function Call(command, commandAttribute, data, isAsync, callbackResult, callbackError, isLongPoolingCall)
    {
        return m_caller.Call(command, commandAttribute, data, isAsync, callbackResult, callbackError, isLongPoolingCall);
    };
    this.Shutdown = function Shutdown()
    {
        m_caller.Shutdown();
    };
    this.InitCall = function InitCall(initData, callbackResult, callbackError)
    {
        return m_caller.InitCall(initData, callbackResult, callbackError);
    };
    this.GetReceiver = function GetReceiver()
    {
        return this;
    };
    this.StartReceive = function StartReceive(callCallback, errorCallback, updateCallback)
    {
        m_callCallback = callCallback;
        m_errorCallback = errorCallback;
        m_receiver.StartReceive(callCallback, errorCallback, updateCallback);
    };
    this.ForceReceive = function ForceReceive()
    {
        m_receiver.ForceReceive();
    };
    this.StopReceive = function StopReceive()
    {
        m_receiver.StopReceive();
    };
    this.IsStarted = function IsStarted()
    {
        return m_receiver.IsStarted();
    };
    this.IsProductConnected = function IsProductConnected()
    {
        return m_receiver.IsProductConnected();
    };
    ns.AddEventListener(window, "load", function onLoad()
    {
        if (m_switchToLongPooling)
            SwitchToLongPooling();
    }, "ajax_caller");
};
return ns;
})(KasperskyLab);
var kaspersyLabSessionInstance = null;
(function SessionMain(ns)
{
    var runners = {};
    var lastPostponedInitTime = (new Date()).getTime();
    var postponedInitTimeout = null;
    var enableTracing = false;
    var ajaxId = "";
    var sessionId = "";
    if (ns.WORK_IDENTIFIERS)
    {
        var workIdentifiers = ns.WORK_IDENTIFIERS.split(",");
        for (var id = 0; id < workIdentifiers.length; ++id)
        {
            if (window[workIdentifiers[id]])
            {
                ns.AddRunner = ns.EmptyFunc;
                ns.AddRunner2 = ns.EmptyFunc;
                return;
            }
            window[workIdentifiers[id]] = true;
        }
    }
    function removeThisScriptElement(injectId)
    {
        var pattern = injectId.toLowerCase();
        for (var i = 0, scriptsCount = document.scripts.length; i < scriptsCount; ++i) 
        {
            var tag = document.scripts[i];
            if (typeof tag.src === "string" && tag.src.length > 45 
                && tag.src.toLowerCase().indexOf(pattern) > 0 
                && (/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/main.js/).test(tag.src))
            {
                tag.parentElement.removeChild(tag);
                break; 
            }
        }
    }
    if (ns.INJECT_ID)
        removeThisScriptElement(ns.INJECT_ID);
    var CallReceiver = function CallReceiver(caller)
    {
        var m_plugins = {};
        var m_receiver = caller.GetReceiver();
        var m_caller = caller;
        var m_selfMethods = {};
        function GetPluginIdFromMethodName(methodName)
        {
            if (methodName)
            {
                var names = methodName.split(".", 2);
                if (names.length === 2)
                    return names[0];
            }
            return null;
        }
        function GetPluginMethods(pluginId)
        {
            var plugin = m_plugins[pluginId];
            return plugin ? plugin.methods : null;
        }
        function CheckCommonMethodName(methodName)
        {
            if (methodName)
            {
                var names = methodName.split(".", 2);
                if (names.length === 1 && names[0] === methodName)
                    return true;
            }
            return false;
        }
        this.RegisterMethod = function RegisterMethod(methodName, callback)
        {
            var pluginId = GetPluginIdFromMethodName(methodName);
            if (pluginId)
            {
                var methods = GetPluginMethods(pluginId);
                if (methods)
                {
                    if (methods[methodName])
                        return;
                    methods[methodName] = callback;
                }
                else
                {
                    throw new Error("Cannot registered " + methodName);
                }
            }
            else if (CheckCommonMethodName(methodName))
            {
                if (m_selfMethods[methodName])
                    throw new Error("Already registered method " + methodName);
                m_selfMethods[methodName] = callback;
            }
        };
        function CallPluginMethod(pluginId, methodName, args)
        {
            var callback = null;
            if (pluginId)
            {
                var methods = GetPluginMethods(pluginId);
                if (methods) 
                    callback = methods[methodName];
            } 
            else
            {
                callback = m_selfMethods[methodName];
            }
            if (callback)
            {
                var result = {};
                try 
                {
                    if (args)
                        callback(ns.JSONParse(args));
                    else
                        callback();
                    result.success = true;
                    m_caller.SendResult(methodName, ns.JSONStringify(result));
                    return true;
                }
                catch (e)
                {
                    result.success = false;
                    m_caller.SendResult(methodName, ns.JSONStringify(result));
                    m_caller.SendLog("Call " + methodName + " in plugin " + (pluginId ? pluginId : "common") + " error: " + (e.message || e));
                    return false;
                }
            }
            m_caller.SendLog("Cannot call " + methodName + " for plugin " + (pluginId ? pluginId : "common"));
            return false;
        }
        function CallMethod(methodName, args)
        {
            var pluginId = GetPluginIdFromMethodName(methodName);
            if (pluginId || CheckCommonMethodName(methodName))
                CallPluginMethod(pluginId, methodName, args);
        }
        function ReportPluginError(pluginId, status)
        {
            var onError = m_plugins[pluginId].onError;
            if (onError)
                onError(status);
        }
        function ReportError(status)
        {
            for (var pluginId in m_plugins)
            {
                if (Object.prototype.hasOwnProperty.call(m_plugins, pluginId))
                    ReportPluginError(pluginId, status);
            }
        }
        function UpdateDelay()
        {
            var newDelay = ns.MaxRequestDelay;
            var currentTime = ns.GetCurrentTime();
            for (var pluginId in m_plugins)
            {
                if (!Object.prototype.hasOwnProperty.call(m_plugins, pluginId))
                    continue;
                try 
                {   
                    var onPing = m_plugins[pluginId].onPing;
                    if (onPing)
                    {
                        var delay = onPing(currentTime);
                        if (delay < newDelay && delay > 0 && delay < ns.MaxRequestDelay)
                            newDelay = delay;
                    }
                }
                catch (e)
                {
                    ReportPluginError(pluginId, "UpdateDelay: " + (e.message || e));
                }
            }
            return newDelay;
        }
        this.RegisterPlugin = function RegisterPlugin(pluginId, callbackPing, callbackError)
        {
            if (m_plugins[pluginId])
                return;
            var plugin = {
                onError: callbackError,
                onPing: callbackPing,
                methods: {}
            };
            m_plugins[pluginId] = plugin;
            if (!m_receiver.IsStarted())
                m_receiver.StartReceive(CallMethod, ReportError, UpdateDelay);
        };
        function IsPluginListEmpty()
        {
            for (var key in m_plugins)
            {
                if (Object.prototype.hasOwnProperty.call(m_plugins, key))
                    return false;
            }
            return true;
        }
        this.UnregisterPlugin = function UnregisterPlugin(pluginId)
        {
            delete m_plugins[pluginId];
            if (IsPluginListEmpty())
                m_receiver.StopReceive();
        };
        this.ForceReceive = function ForceReceive()
        {
            m_receiver.ForceReceive();
        };
        this.UnregisterAll = function UnregisterAll()
        {
            if (IsPluginListEmpty())
                return;
            m_receiver.StopReceive();
            m_plugins = {};
        };
        this.IsEmpty = IsPluginListEmpty;
        this.IsProductConnected = function IsProductConnected()
        {
            return m_receiver.IsProductConnected();
        };
    };
    function LocalizationObjectFromDictionary(dictionary)
    {
        var object = {};
        if (dictionary)
        {
            for (var i = 0; i < dictionary.length; i++)
                object[dictionary[i].name] = dictionary[i].value;
        }
        return object;
    }
    function SettingsObjectFromSettingsJson(settingsJson)
    {
        var object = {};
        if (settingsJson)
            object = ns.JSONParse(settingsJson);
        return object;
    }
    var KasperskyLabSessionClass = function KasperskyLabSessionClass(caller)
    {
        var self = this;
        var m_caller = caller;
        var m_callReceiver = new CallReceiver(caller);
        function BeaconSend(command, commandAttribute, data)
        {
            try
            {
                var maxBeaconPackageSize = 64 * 1024;
                var size = maxBeaconPackageSize;
                if (typeof window.TextEncoder === "function")
                    size = (new TextEncoder("utf-8").encode(data)).length;
                if (navigator && navigator.sendBeacon && size < maxBeaconPackageSize)
                {
                    var urlPath = ns.GetBaseUrl() + ajaxId + "/" + sessionId + "/" + command + "/" + commandAttribute;
                    return navigator.sendBeacon(urlPath, data);
                }
            }
            catch (e)
            {
                ns.Log("Error on beacon send " + e);
            }
            return false;
        }
        function CallImpl(methodName, argsObj, callbackResult, callbackError, onUnload)
        {
            if (!m_callReceiver.IsProductConnected())
                return false;
            var data = (argsObj) 
                ? ns.JSONStringify(
                    {
                        result: 0,
                        method: methodName,
                        parameters: ns.JSONStringify(argsObj)
                    }
                    )
                : null;
            if (onUnload && BeaconSend("to", methodName, data))
                return true;
            var callback = function callback(result, args, method)
                {
                    if (callbackResult)
                        callbackResult(result, args ? ns.JSONParse(args) : null, method);
                };
            return m_caller.Call("to", methodName, data, !onUnload, callback, callbackError);
        }
        function Call(methodName, arrayOfArgs, callbackResult, callbackError)
        {
            CallImpl(methodName, arrayOfArgs, callbackResult, callbackError, false);
        }
        function OnUnloadCall(methodName, arrayOfArgs, callbackResult, callbackError)
        {
            return CallImpl(methodName, arrayOfArgs, callbackResult, callbackError, true);
        }
        function Stop()
        {
            try
            {
                m_callReceiver.UnregisterAll();
                if (m_callReceiver.IsProductConnected())
                {
                    if (!m_caller.Call("shutdown", null, null, false))
                        m_caller.Call("shutdown");
                }
                if (m_caller.Shutdown)
                    m_caller.Shutdown();
            }
            catch (e)
            {
            }
        }
        function DeactivatePlugin(pluginId)
        {
            m_callReceiver.UnregisterPlugin(pluginId);
            if (m_callReceiver.IsEmpty())
                Stop();
        }
        function ActivatePlugin(pluginId, callbackPing, callbackError)
        {
            m_callReceiver.RegisterPlugin(pluginId, callbackPing, function RegisterPluginOnError(e)
            {
                callbackError && callbackError(e);
                m_callReceiver.UnregisterPlugin(pluginId);
                if (m_callReceiver.IsEmpty())
                    Stop();
            });
        }
        function RegisterMethod(methodName, callback)
        {
            m_callReceiver.RegisterMethod(methodName, callback);
        }
        function ReloadImpl()
        {
            window.location.reload(true);
        }
        function ReloadPage()
        {
            if (navigator && navigator.serviceWorker && navigator.serviceWorker.controller && navigator.serviceWorker.controller.state === "activated")
            {
                ns.SetTimeout(ReloadImpl, 1000);
                navigator.serviceWorker.getRegistrations()
                    .then(function getRegistrationsThen(regs)
                        {
                            var countUnregistered = 0;
                            var rest = function rest()
                                {
                                    ++countUnregistered;
                                    if (countUnregistered === regs.length)
                                        ReloadImpl();
                                }; 
                            for (var i = 0; i < regs.length; ++i)
                            {
                                regs[i].unregister()
                                    .then(rest, rest);
                            }
                        }, ReloadImpl);
            }
            else
            {
                ns.SetTimeout(ReloadImpl, 300);
            }
        }
        function OnStartError(injectorName)
        {
            try 
            {
                var connectionErrorCallback = runners[injectorName].onConnectionError;
                if (connectionErrorCallback)
                    connectionErrorCallback();
            }
            catch (e)
            {
                ns.Log(e);
            }
        }
        function StartInjector(param)
        {
            var pluginStartData = {};
            var runner = runners[param.injectorName];
            if (runner && runner.getParameters)
                pluginStartData = { plugin: runner, parameters: ns.JSONStringify(runner.getParameters()) };
            var startData =
                {
                    url: ns.StartLocationHref,
                    plugins: param.injectorName,
                    data: { data: pluginStartData },
                    isTopLevel: ns.IsTopLevel,
                    pageStartTime: ns.GetPageStartTime()
                };
            m_caller.StartCall(
                startData,
                function StartCallCallback(plugin)
                {
                    if (runner && plugin)
                    {
                        var settings = ns.IsDefined(plugin.settingsJson) ? SettingsObjectFromSettingsJson(plugin.settingsJson) : plugin.settings;
                        var localization = ns.IsDefined(plugin.localizationDictionary) ? LocalizationObjectFromDictionary(plugin.localizationDictionary) : {};
                        runner.runner(KasperskyLab, kaspersyLabSessionInstance, settings, localization);
                    }
                },
                function StartCallOnError()
                { 
                    OnStartError(param.injectorName);
                }
                );
        }
        function OnStopError(injectorName)
        {
            ns.Log("Stop " + injectorName + "injector failed");
        }
        function StopInjector(param)
        {
            var runner = runners[param.injectorName];
            m_caller.StopCall(
                param.injectorName,
                function StopCallCallback(plugin)
                {
                    if (runner && plugin && runner.stop)
                        runner.stop(KasperskyLab, kaspersyLabSessionInstance);
                },
                function StopCallOnError() { OnStopError(param.injectorName); }
                );
        }
        function GetErrorMessage(error)
        {
            var msg = "";
            if (error instanceof Error)
            {
                msg = error.message;
                if (error.stack)
                    msg += "\r\n" + error.stack;
            }
            else if (error instanceof Object)
            {
                msg = ns.JSONStringify(error);
            }
            else
            {
                msg = String(error);
            }
            return msg.length <= 2048 ? msg : (msg.substring(0, 2048) + "<...>");
        }
        RegisterMethod("reload", ReloadPage);
        RegisterMethod("start", StartInjector);
        RegisterMethod("stop", StopInjector);
        this.Reload = function Reload()
        {
            ReloadPage();
        };
        this.Log = function Log(error)
        {
            try
            {
                if (!(this.IsProductConnected() && enableTracing))
                    return;
                m_caller.SendLog(GetErrorMessage(error));
            }
            catch (e)
            {
                ns.Log(e.message || e);
            }
        };
        this.LogError = function LogError(error, injector)
        {
            try
            {
                if (!m_callReceiver.IsProductConnected())
                    return;
                if (!injector)
                    injector = "common"; 
                var result = { injector: injector };
                if (typeof error === "object")
                {
                    result.error2 = error.message ? error.message : "unknown";
                    result.stack = error.stack;
                    result.details = error.details; 
                    result.error = result.error2;
                    if (result.details)
                        result.error += "\n" + result.details;
                    if (result.stack)
                        result.error += "\n" + result.stack;
                }
                else
                {
                    result.error  = error;
                    var m = error.split("\n");
                    result.error2 = m[0];
                    result.details = m.slice(1).join("\n");
                }
                m_caller.Call("logerr", null, ns.JSONStringify(result));
            }
            catch (e)
            {
                ns.Log(e.message || e);
            }
        };
        this.UnhandledException = function UnhandledException(e)
        {
            try
            {
                if (!m_callReceiver.IsProductConnected())
                    return;
                if (!e.filename)
                    return;
                if (e.klSkipUnhandled)
                    return;
                var val = ns.INJECT_ID;
                if (!val || e.filename.indexOf(val) === -1)
                    return;
                var errInfo = {};
                errInfo.error = e.message && e.message.length > 1024 ? (e.message.substring(0, 1019) + "<...>") : e.message;
                errInfo.script = e.filename && e.filename.length > 1024 ? (e.filename.substring(0, 1019) + "<...>") : e.filename;
                errInfo.line = e.lineno;
                errInfo.column = e.colno;
                if (e.error)
                    errInfo.stack = e.error.stack && e.error.stack.length > 2048 ? (e.error.stack.substring(0, 2043) + "<...>") : e.error.stack;
                m_caller.Call("except", null, ns.JSONStringify(errInfo));
                return;
            }
            catch (ex)
            {
                ns.Log(ex.message || ex);
            }
        };
        this.ForceReceive = function ForceReceive()
        {
            m_callReceiver.ForceReceive();
        };
        this.IsProductConnected = function IsProductConnected()
        {
            return m_callReceiver.IsProductConnected();
        };
        this.InitializePlugin = function InitializePlugin(init)
        {
            init(
                function OnInitActivatePlugin()
                {
                    ActivatePlugin.apply(self, arguments);
                },
                function OnInitRegisterMethod()
                {
                    RegisterMethod.apply(self, arguments);
                },
                function OnInitCall()
                {
                    Call.apply(self, arguments);
                },
                function OnInitDeactivatePlugin()
                {
                    DeactivatePlugin.apply(self, arguments);
                },
                function OnInitOnUnloadCall()
                {
                    return OnUnloadCall.apply(self, arguments);
                }
            );
        };
        this.GetResource = function GetResource(resourcePostfix, callbackSuccess, callbackError)
        {
            if (!m_caller.ResourceCall)
                throw new Error("Not implemented on transport GetResource");
            m_caller.ResourceCall(resourcePostfix, callbackSuccess, callbackError);
        };
        ns.AddEventListener(window, "unload", function onUnload() 
            {
                if (!m_callReceiver.IsEmpty())
                    Stop();
            });
    };
    ns.AddRunner = function AddRunner(pluginName, runnerFunc, initParameters, onConnectionError)
    {
        var options = {
            name: pluginName,
            runner: runnerFunc
        };
        if (initParameters)
            options.getParameters = function getParameters() { return initParameters; };
        if (onConnectionError)
            options.onConnectionError = onConnectionError;
        ns.AddRunner2(options);
    };
    ns.AddRunner2 = function AddRunner2(options)
    {
        var runnerItem = {
            runner: options.runner
        };
        if (options.onConnectionError)
            runnerItem.onConnectionError = options.onConnectionError;
        if (options.getParameters)
            runnerItem.getParameters = options.getParameters;
        if (options.stop)
            runnerItem.stop = options.stop;
        if (options.reject)
            runnerItem.reject = options.reject;
        runners[options.name] = runnerItem;
    };
    ns.SessionLog = function SessionLog(e)
    {
        if (kaspersyLabSessionInstance)
            kaspersyLabSessionInstance.Log(e);
    };
    ns.SessionError = function SessionError(e, injector)
    {
        if (kaspersyLabSessionInstance && kaspersyLabSessionInstance.IsProductConnected())
            kaspersyLabSessionInstance.LogError(e, injector);
        else
            ns.Log(e);
    };
    ns.AddEventListener(window, "error", function onError(e)
    {
        if (kaspersyLabSessionInstance)
            kaspersyLabSessionInstance.UnhandledException(e);
        else
            ns.Log(e);
    });
    ns.ContentSecurityPolicyNonceAttribute = ns.CSP_NONCE;
    function CreateCaller()
    {
        return new ns.AjaxCaller();
    }
    function Init(postponeInitCallback, onInitErrorCallback)
    {
        var caller = CreateCaller();
        caller.Start(
            function StartCallback() 
            {
                var injectors = "";
                var pluginsInitData = [];
                var injectorNames = [];
                for (var runner in runners)
                {
                    if (!Object.prototype.hasOwnProperty.call(runners, runner))
                        continue;
                    if (injectors)
                        injectors += "&";
                    injectors += runner;
                    injectorNames.push(runner);
                    if (runners[runner].getParameters)
                        pluginsInitData.push({ plugin: runner, parameters: ns.JSONStringify(runners[runner].getParameters()) });
                }
                var initData = 
                    {
                        url: ns.StartLocationHref,
                        plugins: injectors,
                        data: { data: pluginsInitData },
                        isTopLevel: ns.IsTopLevel,
                        pageStartTime: ns.GetPageStartTime()
                    };
                caller.InitCall(
                    initData,
                    function InitCallCallback(initSettings)
                    {
                        ns.IsRtl = initSettings.rtl;
                        enableTracing = ns.IsDefined(initSettings.enableTracing) ? initSettings.enableTracing : true;
                        ajaxId = initSettings.ajaxId;
                        sessionId = initSettings.sessionId;
                        ns.GetCommandSrc = function GetCommandSrc()
                        {
                            return ns.GetBaseUrl() + initSettings.ajaxId + "/" + initSettings.sessionId;
                        };
                        kaspersyLabSessionInstance = new KasperskyLabSessionClass(caller);
                        ns.SetInterval(function IntervalCallback() { if (!kaspersyLabSessionInstance.IsProductConnected()) postponeInitCallback(onInitErrorCallback); }, 60000);
                        var plugins = initSettings.plugins || [];
                        for (var i = 0, pluginsCount = plugins.length; i < pluginsCount; ++i)
                        {
                            try
                            {
                                var plugin = plugins[i];
                                var runnerItem = runners[plugin.name];
                                if (runnerItem)
                                {
                                    var settings = ns.IsDefined(plugin.settingsJson) ? SettingsObjectFromSettingsJson(plugin.settingsJson) : plugin.settings;
                                    var localization = ns.IsDefined(plugin.localizationDictionary) 
                                        ? LocalizationObjectFromDictionary(plugin.localizationDictionary) 
                                        : plugin.localization;
                                    runnerItem.runner(KasperskyLab, kaspersyLabSessionInstance, settings, localization);
                                }
                            }
                            catch (e)
                            {
                                ns.SessionError(e);
                            }
                        }
                        for (var j = 0; j < injectorNames.length; ++j)
                        {
                            try
                            {
                                var injectorName = injectorNames[j];
                                var runnerItemHolder = runners[injectorName];
                                if (!IsInjectorInActiveList(plugins, injectorName) && runnerItemHolder.reject)
                                    runnerItemHolder.reject();
                            }
                            catch (e)
                            {
                                ns.SessionError(e);
                            }
                        }
                        var date = new Date();
                        ns.SessionLog("Session: " + initSettings.sessionId + " initialization complete time: " + date.toISOString());
                    },
                    onInitErrorCallback
                    );
            },
            onInitErrorCallback
            );
    }
    function IsInjectorInActiveList(plugins, injectorName)
    {
        for (var i = 0; i < plugins.length; ++i)
        {
            if (plugins[i].name === injectorName)
                return true;
        }
        return false;
    }
    function PostponeInit(onInitErrorCallback)
    {
        var nowPostponeTime = (new Date()).getTime();
        var postponeDelay = (nowPostponeTime - lastPostponedInitTime) > 5000 ? 200 : 60 * 1000;
        lastPostponedInitTime = nowPostponeTime;
        clearTimeout(postponedInitTimeout);
        postponedInitTimeout = ns.SetTimeout(function postponedInitTimerCallback() { Init(PostponeInit, onInitErrorCallback); }, postponeDelay);
    }
    function OnInitError()
    {
        PostponeInit(OnInitError);
        for (var runner in runners)
        {
            if (!Object.prototype.hasOwnProperty.call(runners, runner))
                continue;
            try
            {
                var connectionErrorCallback = runners[runner].onConnectionError;
                if (connectionErrorCallback)
                    connectionErrorCallback();
            }
            catch (e)
            {
                ns.Log(e);
            }
        }
    }
    ns.StartSession = function StartSession()
    {
        var postponeInitIfNeed = function PostponeInitIfNeed() { if (!kaspersyLabSessionInstance.IsProductConnected()) PostponeInit(OnInitError); };
        ns.AddEventListener(document, "DOMContentLoaded", postponeInitIfNeed);
        ns.AddEventListener(window, "load", postponeInitIfNeed);
        Init(PostponeInit, OnInitError);
    };
})(KasperskyLab);
KasperskyLab.AddRunner("wsm", function AddRunnerWsm(ns, session)
{
    if (window !== window.top)
        return;
    var m_callFunction = null;
    var m_activatedState = 0;
    var m_activatedStateChangeTimeout = null;
    var m_documentTitleIsAvailable = false;
    var m_stateChangeDelayTimeout = null;
    var m_processActivate = null;
    var m_pluginId = "wsm";
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function ForceRedirect(args)
    {
        ns.SessionLog("Force reload to address: " + args.url);
        document.location.href = args.url;
    }
    function FireDeactivateEventImpl()
    {
        if (m_callFunction)
        {
            m_callFunction("wsm.sessionDeactivated", { title: document.title }, function SessionDeactivatedCallback()
            {
                if (m_activatedState === 1)
                    m_processActivate();
                m_activatedState = 0;
            });
        }
        m_activatedState = 3;
    }
    function FireDeactivateEvent()
    {
        if (m_documentTitleIsAvailable)
            FireDeactivateEventImpl();
        else
            clearTimeout(m_stateChangeDelayTimeout);
    }
    function ProcessDeactivate()
    {
        clearTimeout(m_activatedStateChangeTimeout);
        m_activatedStateChangeTimeout = ns.SetTimeout(function TimerCallback()
            {
                if (m_activatedState === 2)
                    FireDeactivateEvent();
                else if (m_activatedState === 1)
                    m_activatedState = 3;
            }, 0, m_pluginId);
    }
    function FireActivateEventImpl()
    {
        if (m_callFunction)
        {
            m_callFunction("wsm.sessionActivated", { title: document.title }, function SessionActivatedCallback()
            {
                if (m_activatedState === 3)
                    ProcessDeactivate();
                m_activatedState = 2;
            });
        }
        m_activatedState = 1;
    }
    function FireActivateEvent()
    {
        clearTimeout(m_stateChangeDelayTimeout);
        if (m_documentTitleIsAvailable || document.title)
        {
            m_documentTitleIsAvailable = true;
            FireActivateEventImpl();
        }
        else
        {
            m_stateChangeDelayTimeout = ns.SetTimeout(function TimerCallback()
                {
                    m_documentTitleIsAvailable = true;
                    m_processActivate();
                }, 500, m_pluginId);
        }
    }
    function ProcessActivate()
    {
        clearTimeout(m_activatedStateChangeTimeout);
        m_activatedStateChangeTimeout = ns.SetTimeout(function TimerCallback()
            {
                if (m_activatedState === 0)
                    FireActivateEvent();
                else if (m_activatedState === 3)
                    m_activatedState = 1;
            }, 0, m_pluginId);
    }
    function OnFocus()
    {
        if (m_callFunction)
            ProcessActivate();
    }
    function OnBlur()
    {
        if (m_callFunction && !document.hasFocus())
            ProcessDeactivate();
    }
    function OnHashChange()
    {
        var args = { newLocationUrl: ns.ToBase64(document.location.href), urlEncrypted: true };
        if (m_callFunction)
            m_callFunction("wsm.onHashChange", args);
    }
    function DelayHashChange()
    {
        ns.SetTimeout(OnHashChange, 100, m_pluginId);
    }
    function Initialize()
    {
        m_processActivate = ProcessActivate;
        session.InitializePlugin(function InitializePluginWsm(activatePlugin, registerMethod, callFunction)
        {
            m_callFunction = callFunction;
            activatePlugin(m_pluginId, OnPing);
            registerMethod("wsm.forceRedirect", ForceRedirect);
        });
        if (document.hasFocus())
        {
            FireActivateEvent();
            ns.AddEventListener(window, "load", function OnLoad()
                {
                    if (!document.hasFocus())
                        ProcessDeactivate();
                }, m_pluginId);
        }
        if (window.addEventListener)
        {
            ns.AddEventListener(window, "focus", OnFocus, m_pluginId);
            ns.AddEventListener(window, "blur", OnBlur, m_pluginId);
        }
        else
        {
            ns.AddEventListener(document, "focusin", OnFocus, m_pluginId);
            ns.AddEventListener(document, "focusout", OnBlur, m_pluginId);
        }
        ns.AddEventListener(window, "unload", function OnUnload()
            {
                clearTimeout(m_activatedStateChangeTimeout);
                m_activatedStateChangeTimeout = null;
                m_callFunction = null;
            }, m_pluginId);
        if ("onhashchange" in window)
            window.addEventListener("hashchange", OnHashChange);
        if (window.history)
        {
            var oldBack = window.history.back;
            var oldForward = window.history.forward;
            var oldGo = window.history.go;
            var oldPushState = window.history.pushState;
            var oldReplaceState = window.history.replaceState;
            window.history.back = function WrapperBack()
            {
                oldBack.apply(window.history);
                DelayHashChange();
            };
            window.history.forward = function WrapperForward()
            {
                oldForward.apply(window.history);
                DelayHashChange();
            };
            window.history.go = function WrapperGo()
            {
                oldGo.apply(window.history, arguments);
                DelayHashChange();
            };
            window.history.pushState = function WrapperPushState()
            {
                oldPushState.apply(window.history, arguments);
                DelayHashChange();
            };
            window.history.replaceState = function WrapperReplaceState()
            {
                oldReplaceState.apply(window.history, arguments);
                DelayHashChange();
            };
        }
    }
    Initialize();
}, {
    referrer: document.referrer,
    stubId: (function stubId()
    {
        var scripts = [];
        if (document.querySelectorAll)
        {
            scripts = document.querySelectorAll("[stubid]");
        }
        else
        {
            var allElements = document.getElementsByTagName("*");
            for (var i = 0; i < allElements.length; i++)
            {
                if (allElements[i].getAttribute("stubid") !== null)
                    scripts.push(allElements[i]);
            }
        }
        if (scripts && scripts.length > 0)
            return scripts[0].getAttribute("stubid");
        return "";
    })()
});
KasperskyLab.AddRunner("wnt", function AddRunnerWnt(ns, session)
{
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function Initialize()
    {
        session.InitializePlugin(function InitializePluginWnt(activatePlugin)
            {
                activatePlugin("wnt", OnPing);
            });
    }
    Initialize();
}, { referrer: document.referrer });
KasperskyLab.AddRunner("vs", function AddRunnerVs(ns, session)
{
    var VisitedSites = function VisitedSites()
    {
        var m_callFunction = ns.EmptyFunc;
        var m_domParser = ns.GetDomParser(session);
        var m_subscribedElements = [];
        var m_flags = {
            onPasswordEntered: false,
            onAddressEntered: false,
            onCardEntered: false
        };
        function OnPing()
        {
            return ns.MaxRequestDelay;
        }
        function IsElementSubscribed(element)
        {
            for (var i = 0; i < m_subscribedElements.length; ++i)
            {
                if (m_subscribedElements[i] === element)
                    return true;
            }
            return false;
        }
        function MakeCallFunctionCallback(flag, onKeyDown)
        {
            return function callback()
            {
                m_flags[flag] = true;
                if (m_flags.onPasswordEntered && m_flags.onAddressEntered && m_flags.onCardEntered)
                {
                    ns.RemoveEventListener(document, "keydown", onKeyDown);
                    ns.RemoveEventListener(document, "change", onKeyDown);
                }
                m_callFunction("vs." + flag);
            };
        }
        function MakeCallback(flag, target, onKeyDown)
        {
            if (m_flags[flag] || !target)
                return ns.EmptyFunc;
            var flagCallFunction = MakeCallFunctionCallback(flag, onKeyDown);
            return function Callback(result, selectors)
            {
                if (result || m_flags[flag])
                    return;
                for (var i = 0; i < selectors.length; i++)
                {
                    if (m_flags[flag])
                        return;
                    var element = document.querySelector(selectors[i]);
                    if (window.MutationObserver && element && element.tagName && element.tagName.toLowerCase() !== "input" && !IsElementSubscribed(element))
                    {
                        var mutationObserver = new MutationObserver(flagCallFunction);
                        mutationObserver.observe(element, { childList: true, characterData: true, subtree: true });
                        m_subscribedElements.push(element);
                    }
                    if (element && element === target)
                        flagCallFunction();
                }
            };
        }
        function OnKeyDown(evt)
        {
            try 
            {
                if (!evt || !evt.target || !evt.target.tagName || evt.target.tagName.toLowerCase() !== "input")
                    return;
                m_domParser.GetPasswordSelectors(MakeCallback("onPasswordEntered", evt.target, OnKeyDown));
                m_domParser.GetNewPasswordSelectors(MakeCallback("onPasswordEntered", evt.target, OnKeyDown));
                m_domParser.GetAddressSelectors(MakeCallback("onAddressEntered", evt.target, OnKeyDown));
                m_domParser.GetCardSelectors(MakeCallback("onCardEntered", evt.target, OnKeyDown));
            }
            catch (e)
            {
                ns.SessionError(e, "vs");
            }
        }
        function Initialize()
        {
            session.InitializePlugin(function InitializePluginVs(activatePlugin, registerMethod, callFunction)
                {
                    m_callFunction = callFunction;
                    activatePlugin("vs", OnPing);
                    ns.AddRemovableEventListener(document, "keydown", OnKeyDown);
                    ns.AddRemovableEventListener(document, "change", OnKeyDown);
                });
        }
        Initialize();
    };
    var instance = null;
    ns.RunModule(function RunModuleVisitedSites()
    {
        if (!instance)
            instance = new VisitedSites();
    });
});
(function UrlAdvisorBalloonMain(ns)
{
ns.UrlAdvisorBalloon = function UrlAdvisorBalloon(session, locales)
{
    var m_balloon = null;
    var m_currentVerdict = null;
    var m_mouseX = 0;
    var m_mouseY = 0;
    var ratingIds = [
        { className: "green", headerNode: locales["UrlAdvisorBalloonHeaderGood"], textNode: locales["UrlAdvisorSetLocalContentOnlineGood"] },
        { className: "grey", headerNode: locales["UrlAdvisorBalloonHeaderSuspicious"], textNode: locales["UrlAdvisorSetLocalContentOnlineSuspicious"] },
        { className: "red", headerNode: locales["UrlAdvisorBalloonHeaderDanger"], textNode: locales["UrlAdvisorSetLocalContentOnlineDanger"] },
        { className: "yellow", headerNode: locales["UrlAdvisorBalloonHeaderWmuf"], textNode: locales["UrlAdvisorSetLocalContentOnlineWmuf"] },
        { className: "orange", headerNode: locales["UrlAdvisorBalloonHeaderCompromised"], textNode: locales["UrlAdvisorSetLocalContentOnlineCompromised"] }
    ];
    function OnCloseHandler(arg)
    {
        if (arg === 0)
            m_balloon.Hide();
    }
    function OnDataReceiveHandler()
    {
    }
    function GetCoord(balloonSize, clientX, clientY)
    {
        var coord = { x: 0, y: 0 };
        var clientWidth = ns.GetPageWidth();
        var halfWidth = balloonSize.width / 2;
        if (halfWidth > clientX)
            coord.x = 0;
        else if (halfWidth + clientX > clientWidth)
            coord.x = clientWidth - balloonSize.width;
        else
            coord.x = clientX - halfWidth;
        var clientHeight = ns.GetPageHeight();
        coord.y = (clientY + balloonSize.height > clientHeight) ? clientY - balloonSize.height : clientY;
        if (coord.y < 0)
            coord.y = 0;
        var scroll = ns.GetPageScroll();
        coord.y += scroll.top;
        coord.x += scroll.left;
        return coord;
    }
    function GetCoordsCallback(balloonSize)
    {
        return GetCoord(balloonSize, m_mouseX, m_mouseY);
    }
    this.HideBalloon = function HideBalloon()
    {
        m_balloon.Hide();
    };
    this.ShowBalloon = function ShowBalloon(clientX, clientY, verdict)
    {
        m_mouseX = clientX;
        m_mouseY = clientY;
        m_currentVerdict = verdict;
        m_balloon.Show(ratingIds[m_currentVerdict.rating - 1].className + " " + ns.md5(verdict.url), { verdict: m_currentVerdict, locales: locales });
    };
    m_balloon = new ns.Balloon2("ua", "/ua/url_advisor_balloon.html", "/ua/balloon.css", session, GetCoordsCallback, OnCloseHandler, locales, OnDataReceiveHandler);
};
})(KasperskyLab || {});
var PostponeCheckAtributeName = "kl_" + KasperskyLab.GetCurrentTime();
var IconName = "kl_" + KasperskyLab.GetCurrentTime();
KasperskyLab.AddRunner("ua", function AddRunnerUa(ns, session, settings, locales)
{
var UrlAdvisor = function UrlAdvisor()
{
    var m_urlAdvisorBalloon = new ns.UrlAdvisorBalloon(session, locales);
    var m_enabled = settings.enable;
    var m_checkOnlySearchResults = settings.mode;
    var m_linkSelector = settings.linkSelector;
    var m_elementAfterSelector = settings.elementAfterSelector;
    var m_emptySearchResultSent = false;
    var m_isVerdictSuitableForContinueFunc = function AlwaysSuitable() { return true; };
    var m_postponeCategorizeStarted = false;
    var m_urlCategorizeRequestTime = 0;
    var m_observer = null;
    var m_callFunction = ns.EmptyFunc;
    var m_categorizingObjects = {};
    var m_clearCategorizingObjectsTimerId = null;
    var m_pluginId = "ua";
    function AddToCategorizeList(url, linkElement)
    {
        if (url in m_categorizingObjects)
            m_categorizingObjects[url].push(linkElement);
        else
            m_categorizingObjects[url] = [linkElement];
    }
    function OnPing(currentTime)
    {
        var timeFormRequest = (currentTime >= m_urlCategorizeRequestTime) ? currentTime - m_urlCategorizeRequestTime : 0;
        return timeFormRequest <= 10000 ? 500 : ns.MaxRequestDelay;
    }
    function GetHref(link)
    {
        try { return link.href; } 
        catch (e) {}
        try { return link.getAttribute("href"); } 
        catch (e) {}
        return "";
    }
    function CreateIcon()
    {
        var icon = document.createElement("img");
        icon.name = IconName;
        icon.width = 16;
        icon.height = 16;
        icon.style.cssText = "width: 16px!important; height: 16px!important;display: inline !important;";
        icon.onclick = function onclick(evt) { ns.StopProcessingEvent(evt); };
        return icon;
    }
    function GetLinkIcon(linkElement)
    {
        var nextElement = linkElement.nextSibling;
        if (m_elementAfterSelector)
        {
            nextElement = linkElement.querySelector(m_elementAfterSelector);
            if (nextElement)
                nextElement = nextElement.nextSibling;
            else
                nextElement = linkElement.nextSibling;
        }
        return (nextElement !== null && nextElement.name === IconName) ? nextElement : null;
    }
    function GetOrCreateLinkIcon(linkElement)
    {
        var icon = GetLinkIcon(linkElement);
        if (icon)
            return icon;
        var nextElement = linkElement;
        if (m_elementAfterSelector)
        {
            nextElement = linkElement.querySelector(m_elementAfterSelector);
            if (!nextElement)
                nextElement = linkElement;
        }
        nextElement.style.display = "inline-block";
        if (nextElement.parentNode)
        {
            nextElement.parentNode.insertBefore(CreateIcon(), nextElement.nextSibling);
        }
        else
        {
            ns.SessionLog("Can not find parent node for: " + nextElement.nodeType);
            return null;
        }
        return nextElement.nextSibling;
    }
    function GetLinkElementByIcon(icon)
    {
        if (!m_elementAfterSelector)
            return icon.previousSibling;
        var searchLinks = [];
        if (KasperskyLab.GetSearchLinks)
            searchLinks = KasperskyLab.GetSearchLinks();
        else
            searchLinks = document.querySelectorAll(m_linkSelector);
        for (var i = 0; i < searchLinks.length; i++)
        {
            var link = searchLinks[i].element || searchLinks[i];
            var elem = link.querySelector(m_elementAfterSelector);
            if (link.nextSibling === icon || (elem && elem.nextSibling === icon))
                return link;
        }
        return icon.previousSibling;
    }
    function UpdateIconImage(icon, verdict)
    {
        if (verdict.rating === 1)
        {
            icon.src = locales["UrlAdvisorGoodImage.png"];
            icon["kis_status"] = 16;
        }
        else if (verdict.rating === 2)
        {
            icon.src = locales["UrlAdvisorSuspiciousImage.png"];
            icon["kis_status"] = 8;
        } 
        else if (verdict.rating === 3)
        {
            icon.src = locales["UrlAdvisorDangerImage.png"];
            icon["kis_status"] = 4;
        }
        else if (verdict.rating === 4)
        {
            icon.src = locales["UrlAdvisorwmufImage.png"];
        }
        else if (verdict.rating === 5)
        {
            icon.src = locales["UrlAdvisorCompromisedImage.png"];
        }
    }
    function SubscribeIconOnMouseEvents(icon, verdict)
    {
        var balloonTimerId = 0;
        ns.AddEventListener(icon, "mouseout", function OnMouseout()
            {
                if (balloonTimerId)
                {
                    clearTimeout(balloonTimerId);
                    balloonTimerId = 0;
                }
            }, m_pluginId);
        ns.AddEventListener(icon, "mouseover", function OnMouseover(args)
            {
                if (!balloonTimerId)
                {
                    var clientX = args.clientX;
                    var clientY = args.clientY;
                    balloonTimerId = ns.SetTimeout(function TimerCallback()
                        {
                            m_urlAdvisorBalloon.ShowBalloon(clientX, clientY, verdict);
                            balloonTimerId = 0;
                        }, 300, m_pluginId);
                }
            }, m_pluginId);
    }
    function IsElementEmpty(linkElement)
    {
        return !linkElement.offsetHeight && !linkElement.offsetWidth
            && !linkElement.outerText && !linkElement.text;
    }
    function SetVerdictForUrl(verdict)
    {
        try
        {
            if (!(verdict.url in m_categorizingObjects))
                return;
            var linkElements = m_categorizingObjects[verdict.url];
            for (var linkIndex = 0; linkIndex < linkElements.length; ++linkIndex)
            {
                if (IsElementEmpty(linkElements[linkIndex]))
                    continue;
                linkElements[linkIndex][PostponeCheckAtributeName] = false;
                if (!m_isVerdictSuitableForContinueFunc(verdict))
                    continue;
                var icon = GetOrCreateLinkIcon(linkElements[linkIndex]);
                if (!icon)
                    continue;
                UpdateIconImage(icon, verdict);
                SubscribeIconOnMouseEvents(icon, verdict);
            }
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
        delete m_categorizingObjects[verdict.url];
    }
    function SetVerdict(argument)
    {
        for (var currentVerdict = 0; currentVerdict < argument.verdicts.length; currentVerdict++)
            SetVerdictForUrl(argument.verdicts[currentVerdict]);
    }
    function SetVerdictDelayed(argument)
    {
        ns.SetTimeout(function TimerCallback() { SetVerdict(argument); }, 1000, m_pluginId);
    }
    function SetSettingsImpl(argument)
    {
        m_enabled = argument.enable;
        if (!m_enabled)
            return;
        m_checkOnlySearchResults = argument.mode;
    }
    function ClearImages()
    {
        var images = document.getElementsByName(IconName);
        while (images.length > 0)
            images[0].parentNode.removeChild(images[0]);
    }
    function ClearAttributes()
    {
        for (var i = 0; i < document.links.length; ++i)
        {
            if (document.links[i][PostponeCheckAtributeName])
                document.links[i][PostponeCheckAtributeName] = false;
        }
    }
    function IsNeedCategorizeLink(linkElement)
    {
        try
        {
            return !linkElement.isContentEditable && Boolean(linkElement.parentNode)
                && !GetLinkIcon(linkElement) && !linkElement[PostponeCheckAtributeName]
                && !IsElementEmpty(linkElement);
        }
        catch (e)
        {
            ns.SessionLog("check link exception: " + (e.message || e));
            return false;
        }
    }
    function UrlToBase64(url)
    {
        try
        {
            return ns.ToBase64(url);
        }
        catch (e)
        {
            return "";
        }
    }
    function CategorizeUrl()
    {
        try
        {
            if (!m_enabled)
            {
                ns.SessionLog("skip categorize links because UA disabled");
                return;
            }
            ns.SessionLog("UA: collect links for categorize");
            m_postponeCategorizeStarted = false;
            var linksForCategorize = [];
            var linksForCheck = [];
            if (!m_checkOnlySearchResults)
                linksForCheck = document.links;
            else if (KasperskyLab.GetSearchLinks)
                linksForCheck = KasperskyLab.GetSearchLinks();
            else if (m_linkSelector && m_checkOnlySearchResults)
                linksForCheck = document.querySelectorAll(m_linkSelector);
            ns.SessionLog("UA: links for categorize size: " + linksForCheck.length);
            for (var i = 0; i < linksForCheck.length; i++)
            {
                var link = linksForCheck[i].element || linksForCheck[i];
                if (IsNeedCategorizeLink(link))
                {
                    link[PostponeCheckAtributeName] = true; 
                    var href = linksForCheck[i].href || GetHref(link);
                    var linkToCategorize = href;
                    if (href)
                    {
                        var base64Url = UrlToBase64(href);
                        if (!base64Url)
                        {
                            href = encodeURI(href);
                            base64Url = UrlToBase64(href);
                            if (!base64Url)
                                continue;
                        }
                        linkToCategorize = base64Url;
                        linksForCategorize.push(linkToCategorize);
                        AddToCategorizeList(href, link);
                    } 
                    else 
                    {
                        ns.Log("access to href blocked by browser"); 
                    }
                }
            }
            var isEmptySearchResult = m_linkSelector && m_checkOnlySearchResults && linksForCheck.length === 0;
            if (isEmptySearchResult || linksForCategorize.length)
            {
                if (isEmptySearchResult)
                {
                    if (m_emptySearchResultSent)
                        return;
                    m_emptySearchResultSent = true;
                }
                ns.SessionLog("UA send links for categorization");
                var args = { links: linksForCategorize };
                args.urlEncrypted = true;
                m_callFunction("ua.categorize", args);
                m_urlCategorizeRequestTime = ns.GetCurrentTime();
                clearTimeout(m_clearCategorizingObjectsTimerId);
                m_clearCategorizingObjectsTimerId = ns.SetTimeout(function TimerCallback()
                {
                    m_categorizingObjects = {};
                }, 1000 * 60 * 5, m_pluginId);
            }
            else
            {
                ns.SessionLog("UA not found links for categorization");
            }
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
    }
    function ProcessDomChange()
    {
        try
        {
            ns.SessionLog("UA: Process dom change");
            if (!m_postponeCategorizeStarted)
            {
                ns.SetTimeout(CategorizeUrl, 500, m_pluginId);
                m_postponeCategorizeStarted = true;
            }
            var images = document.getElementsByName(IconName);
            for (var i = 0; i < images.length; ++i)
            {
                var linkNode = GetLinkElementByIcon(images[i]);
                if (!linkNode || !linkNode.nodeName || linkNode.nodeName.toLowerCase() !== "a")
                {
                    var imageNode = images[i];
                    imageNode.parentNode.removeChild(imageNode);
                }
            }
        }
        catch (e)
        {
            ns.SessionError(e, m_pluginId);
        }
    }
    function SetSettings(argument)
    {
        ClearImages();
        ClearAttributes();
        SetSettingsImpl(argument);
        CategorizeUrl();
    }
    function Run()
    {
        CategorizeUrl();
        m_observer = ns.GetDomChangeObserver("a", m_pluginId);
        m_observer.Start(ProcessDomChange);
        ns.AddEventListener(window, "load", CategorizeUrl, m_pluginId);
    }
    session.InitializePlugin(function InitializePluginUa(activatePlugin, registerMethod, callFunction) 
        {
            m_callFunction = callFunction;
            if (settings.needCheckVerdicts)
            {
                m_isVerdictSuitableForContinueFunc = function CheckVerdict(verdict) 
                    {
                        return verdict.rating === 3 || verdict.rating === 4 || verdict.rating === 5;
                    };
            }
            activatePlugin(m_pluginId, OnPing);
            registerMethod("ua.verdict", SetVerdictDelayed);
            registerMethod("ua.settings", SetSettings);
        });
    Run();
};
var instance = null;
ns.RunModule(function RunModuleUrlAdvisor()
{
    if (!instance)
        instance = new UrlAdvisor();
}, 2500);
});
KasperskyLab.AddRunner("cb", function AddRunnerCB(ns, session)
{
    function ContentBlocker()
    {
        var m_idleStartTime = ns.GetCurrentTime();
        var m_callFunction = ns.EmptyFunc;
        function OnPing(currentTime)
        {
            var idleTime = (currentTime >= m_idleStartTime) ? currentTime - m_idleStartTime : 0;
            return idleTime <= 10000 ? 500 : ns.MaxRequestDelay;
        }
        function ReloadUrl()
        {
            m_idleStartTime = ns.GetCurrentTime();
            session.Reload();
        }
        function blockImageByPath(url, blockImageResponse)
        {
            var endsWithUrl = function endsWithUrl(pattern)
                {
                    var d = pattern.length - url.length;
                    return d >= 0 && pattern.lastIndexOf(url) === d;
                };
            var images = document.getElementsByTagName("img");
            for (var i = 0; i !== images.length; ++i)
            {
                if (endsWithUrl(images[i].src) && images[i].style.display !== "none")
                {
                    images[i].style.display = "none";
                    ++blockImageResponse.blockedImagesCount;
                }
            }
        }
        function BlockImage(blockImageRequest)
        {
            var blockImageResponse = { blockedImagesCount: 0, requestId: "" };
            var SendResponse = function SendResponseImpl() 
            {
                m_callFunction("cb.BlockResults", blockImageResponse);
                SendResponse = ns.EmptyFunc;
            };
            try
            {
                blockImageResponse.requestId = blockImageRequest.requestId;
                for (var i = 0; i !== blockImageRequest.urls.length; ++i)
                    blockImageByPath(blockImageRequest.urls[i], blockImageResponse);
                SendResponse();
            }
            catch (e)
            {
                SendResponse();
                throw e;
            }
        }
        session.InitializePlugin(function InitializePluginContentBlocker(activatePlugin, registerMethod, callFunction, deactivatePlugin)
        {
            m_callFunction = callFunction;
            activatePlugin("cb", OnPing);
            registerMethod("cb.reloadUrl", ReloadUrl);
            registerMethod("cb.blockImage", BlockImage);
            registerMethod("cb.shutdown",
                function ShutdownCB()
                {
                    deactivatePlugin("cb");
                });
        });
    }
    var m_contentBlocker = new ContentBlocker(); 
});
(function DomParserMain(ns)
{
function DomParser(session)
{
    var m_callFunction = ns.EmptyFunc;
    var m_logins = [];
    var m_passwords = [];
    var m_newPasswords = [];
    var m_address = [];
    var m_card = [];
    var m_cachedFlag = false;
    var m_pathName = document.location.pathname;
    var m_selectorsRequested = false;
    var m_callbacksQueue = [];
    var m_idCounter = 0;
    var m_pluginId = "dp";
    function OnGetFieldsCallback(result, selectors)
    {
        if (result === 0 && selectors)
        {
            if (selectors.loginSelectors)
                Array.prototype.push.apply(m_logins, selectors.loginSelectors);
            if (selectors.passwordSelectors)
                Array.prototype.push.apply(m_passwords, selectors.passwordSelectors);
            if (selectors.newPasswordSelectors)
                Array.prototype.push.apply(m_newPasswords, selectors.newPasswordSelectors);
            if (selectors.addressSelectors)
                Array.prototype.push.apply(m_address, selectors.addressSelectors);
            if (selectors.cardSelectors)
                Array.prototype.push.apply(m_card, selectors.cardSelectors);
            m_cachedFlag = true;
        }
        m_selectorsRequested = false;
        for (var i = 0; i < m_callbacksQueue.length; ++i)
            m_callbacksQueue[i](result);
    }
    function CleanupElements()
    {
        if (!document.querySelectorAll)
            return;
        var elements = document.querySelectorAll("[wfd-value],[wfd-invisible]");
        for (var i = 0; i < elements.length; ++i)
        {
            var element = elements[i];
            if (element.hasAttribute("wfd-value"))
                element.removeAttribute("wfd-value");
            if (element.hasAttribute("wfd-invisible"))
                element.removeAttribute("wfd-invisible");
        }
    }
    function CallService(argObject)
    {
        m_callFunction("dp.onGetFields", argObject, OnGetFieldsCallback);
        CleanupElements();
    }
    function IsVisible(element)
    {
        var style = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;
        return style.display !== "none";
    }
    function ProcessChilds(childNodes)
    {
        for (var i = 0; i < childNodes.length; ++i)
        {
            var element = childNodes[i];
            if (element.nodeType !== Node.ELEMENT_NODE)
                continue;
            if (!IsVisible(element))
            {
                element.setAttribute("wfd-invisible", true);
            }
            else
            {
                element.setAttribute("wfd-id", "id" + m_idCounter);
                ++m_idCounter;
                ProcessChilds(element.childNodes);
            }
        }
    }
    function ProcessNextGroupElement(tree, finishCallback)
    {
        var counter = 0;
        while (tree.nextNode())
        {
            ++counter;
            tree.currentNode.setAttribute("wfd-invisible", true);
            if (counter === 100)
            {
                ns.SetTimeout(function TimerCallback() { ProcessNextGroupElement(tree, finishCallback); }, 0, m_pluginId);
                return;
            }
        }
        finishCallback();
    }
    function GetSelectorsWithTreeWalker()
    {
        if (!document.body)
        {
            ns.AddEventListener(window, "load", GetSelectorsWithTreeWalker, m_pluginId);
            return;
        }
        var filter = {
            acceptNode: function acceptNode(node)
            {
                if (!node)
                    return NodeFilter.FILTER_SKIP;
                if (node.tagName === "INPUT")
                {
                    node.setAttribute("wfd-id", "id" + m_idCounter);
                    ++m_idCounter;
                }
                if (node.parentNode && node.parentNode.getAttribute("wfd-invisible") === true)
                    return NodeFilter.FILTER_REJECT;
                if (!IsVisible(node))
                    return NodeFilter.FILTER_ACCEPT;
                return NodeFilter.FILTER_SKIP;
            }
        };
        var tree = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, filter.acceptNode, false);
        function finishCallback()
        {
            CallService({ dom: "<body>" + document.body.innerHTML + "</body>" });
        }
        ProcessNextGroupElement(tree, finishCallback);
    }
    function GetSelectorsFromService()
    {
        try
        {
            ProcessChilds(document.body.childNodes);
        }
        catch (e)
        {
            ns.SessionLog(e);
        }
        CallService({ dom: document.documentElement.innerHTML });
    }
    function GetSelectorsInternal(callback, selectors)
    {
        if (m_cachedFlag)
        {
            if (selectors.length > 0)
                callback(0, selectors);
            return;
        }
        function clientCallback(result) { callback(result, selectors); }
        m_callbacksQueue.push(clientCallback);
        if (!m_selectorsRequested)
        {
            m_selectorsRequested = true;
            if (document.createTreeWalker)
                GetSelectorsWithTreeWalker();
            else
                GetSelectorsFromService();
        }
    }
    function AddWfdAttribute(input, settings)
    {
        try
        {
            if (!input || !input.value)
                return;
            if (settings && settings.avoidTypes && input.type && settings.avoidTypes.includes(input.type))
                return;
            if (input.type === "password")
                return;
            input.setAttribute("wfd-value", ns.ToBase64(input.value));
        }
        catch (e)
        {
            ns.SessionLog(e);
        }
    }
    this.GetLoginSelectors = function GetLoginSelectors(clientCallback)
    {
        GetSelectorsInternal(clientCallback, m_logins);
    };
    this.GetPasswordSelectors = function GetPasswordSelectors(clientCallback)
    {
        GetSelectorsInternal(clientCallback, m_passwords);
    };
    this.GetNewPasswordSelectors = function GetNewPasswordSelectors(clientCallback)
    {
        GetSelectorsInternal(clientCallback, m_newPasswords);
    };
    this.GetAddressSelectors = function GetAddressSelectors(clientCallback)
    {
        GetSelectorsInternal(clientCallback, m_address);
    };
    this.GetCardSelectors = function GetCardSelectors(clientCallback)
    {
        GetSelectorsInternal(clientCallback, m_card);
    };
    this.GetHtmlWithWfd = function GetHtmlWithWfd(settings)
    {
        var inputs = document.getElementsByTagName("input");
        if (inputs)
        {
            for (var i = 0; i < inputs.length; i++)
                AddWfdAttribute(inputs[i], settings);
        }
        if (settings && settings.wfdIdSelector)
        {
            var elements = document.querySelectorAll(settings.wfdIdSelector);
            if (elements)
            {
                var count = 1;
                for (var j = 0; j < elements.length; j++)
                {
                    elements[j].setAttribute("wfd-id", count);
                    count++;
                }
            }
        }
        return document.documentElement.innerHTML;
    };
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function OnInitializeCallback(activatePlugin, registerMethod, callFunction)
    {
        m_callFunction = callFunction;
        activatePlugin(m_pluginId, OnPing);
    }
    function ResetCacheFlag()
    {
        m_cachedFlag = false;
    }
    function UpdateLocationPathName()
    {
        if (m_pathName !== document.location.pathname) 
        {
            m_pathName = document.location.pathname;
            ResetCacheFlag();
        }
    }
    var m_originalPushState = ns.EmptyFunc;
    function PushStateWrapper()
    {
        m_originalPushState.apply(window.history, [].slice.call(arguments));
        ResetCacheFlag();
    }
    function InitializePlugin()
    {
        session.InitializePlugin(OnInitializeCallback);
        ns.AddEventListener(window, "popstate", ResetCacheFlag, m_pluginId);
        ns.AddEventListener(document, "load", UpdateLocationPathName, m_pluginId);
        if (window.history && window.history.pushState)
        {
            m_originalPushState = window.history.pushState;
            window.history.pushState = PushStateWrapper;
        }
    }
    InitializePlugin();
}
var gDomParser = null;
ns.GetDomParser = function GetDomParser(session)
{
    if (!gDomParser)
        gDomParser = new DomParser(session);
    return gDomParser;
};
return ns;
})(KasperskyLab);
var oldFetch = window.fetch;
var xhrProxyEnabled = true;
var processPostAjaxInSession = KasperskyLab.EmptyFunc;
var functionBind = Function.prototype.bind;
function NormalizeUrl(url)
{
    var e = document.createElement("a");
    e.href = url;
    return e.href;
}
function IsInternalUrl(url)
{
    return KasperskyLab.IsRelativeTransport() ? false : url.indexOf(KasperskyLab.PREFIX) === 0;
}
var oldRequest = void 0;
function fetchCallImpl()
{
    var clsNew = function clsNew(Cls)
    {
        return new (functionBind.apply(Cls, arguments))();
    };
    var args = [].slice.call(arguments);
    args.unshift(oldRequest);
    var request = clsNew.apply(this, args);
    if (xhrProxyEnabled && KasperskyLab.IsDefined(request.url) && !KasperskyLab.IsCorsRequest(request.url, document.location.href))
        request.headers.append(KasperskyLab.RequestCustomHeader, "Ajax_Request");
    return oldFetch.apply(this, [request]);
}
if (oldFetch)
{
    oldRequest = Request;
    var oldFunctionToString = Function.prototype.toString;
    window.fetch = function fetch() { return fetchCallImpl.apply(this, [].slice.call(arguments)); };
    window.fetch.toString = function toString() { return oldFunctionToString.apply(oldFetch, [].slice.call(arguments)); };
}
var m_requests = {};
var m_idCounter = 0;
function addDescriptor(requestDescriptor)
{
    var id = ++m_idCounter;
    KasperskyLab.SetTimeout(function TimerCallback()
    {
        delete m_requests[id];
    }, 60 * 1000, "xhr");
    m_requests[id] = requestDescriptor;
}
function findRequestDescriptor(request)
{
    for (var index in m_requests)
    {
        if (m_requests[index].request === request)
            return m_requests[index];
    }
    return null;
}
function deleteDescriptor(request)
{
    for (var index in m_requests)
    {
        if (m_requests[index].request === request)
            delete m_requests[index];
    }
}
function xhrOpenProcessor()
{
    try
    {
        if (xhrProxyEnabled && arguments.length > 1 && typeof (arguments[0]) === "string" && KasperskyLab.IsDefined(arguments[1]))
        {
            var requestDescriptor = { request: this, isCORS: KasperskyLab.IsCorsRequest(arguments[1], document.location.href) };
            if (requestDescriptor.isCORS && arguments[0].toLowerCase() === "post" && !IsInternalUrl(NormalizeUrl(arguments[1])))
            {
                var sendCallback = processPostAjaxInSession.apply(this, [].slice.call(arguments));
                if (sendCallback)
                    requestDescriptor.RequestSend = sendCallback;
            }
            addDescriptor(requestDescriptor);
        }
    }
    catch (e)
    {
        KasperskyLab.SessionError(e, "xhr");
    }
    try
    {
        KasperskyLab.XMLHttpRequestOpen.apply(this, [].slice.call(arguments));
    }
    catch (err)
    {
        err.klSkipUnhandled = true;
        throw err;
    }
}
function xhrSetRequestHeaderProcessor()
{
    try
    {
        if (arguments.length && typeof arguments[0] === "string" && arguments[0].toLowerCase().indexOf(KasperskyLab.RequestCustomHeader.toLowerCase()) === 0)
        {
            var requestDescriptor = findRequestDescriptor(this);
            if (requestDescriptor)
            {
                requestDescriptor.headerSet = true;
                delete requestDescriptor.RequestSend;
            }
            else
            {
                requestDescriptor = { request: this, headerSet: true };
                addDescriptor(requestDescriptor);
            }
        }
    }
    catch (e)
    {
        KasperskyLab.SessionError(e, "xhr");
    }
    try
    {
        return KasperskyLab.XMLHttpRequestSetRequestHeader.apply(this, [].slice.call(arguments));
    }
    catch (err)
    {
        err.klSkipUnhandled = true;
        throw err;
    }
}
function xhrSendProcessor()
{
    try
    {
        var requestDescriptor = findRequestDescriptor(this);
        if (xhrProxyEnabled && requestDescriptor)
        {
            deleteDescriptor(this);
            if (!requestDescriptor.isCORS && !requestDescriptor.headerSet)
                KasperskyLab.XMLHttpRequestSetRequestHeader.apply(this, [KasperskyLab.RequestCustomHeader, "Ajax_Request"]);
            if (requestDescriptor.RequestSend)
            {
                requestDescriptor.RequestSend.apply(this, [].slice.call(arguments));
                return;
            }
        }
    }
    catch (e)
    {
        if (e.klSkipUnhandled)
            throw e;
        KasperskyLab.SessionError(e, "xhr");
    }
    try
    {
        KasperskyLab.XMLHttpRequestSend.apply(this, [].slice.call(arguments));
    }
    catch (err)
    {
        err.klSkipUnhandled = true;
        throw err;
    }
}
if (KasperskyLab.XMLHttpRequestSend)
{
    window.XMLHttpRequest.prototype.open = function open()
    {
        return xhrOpenProcessor.apply(this, [].slice.call(arguments));
    };
    window.XMLHttpRequest.prototype.send = function send()
    {
        xhrSendProcessor.apply(this, [].slice.call(arguments));
    };
    window.XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader()
    {
        return xhrSetRequestHeaderProcessor.apply(this, [].slice.call(arguments));
    };
}
KasperskyLab.AddRunner("xhr_content", function AddRunnerXhrContent(ns, session)
{
    var m_callFunction = null;
    function OnPing()
    {
        return ns.MaxRequestDelay;
    }
    function OnError()
    {
        xhrProxyEnabled = false;
    }
    function Initialize()
    {
        xhrProxyEnabled = true;
        session.InitializePlugin(function InitializePluginXhrContent(activatePlugin, registerMethod, callFunction) 
        {
            m_callFunction = callFunction;
            activatePlugin("xhr_content", OnPing, OnError);
            processPostAjaxInSession = function processPostAjaxInSession() 
            {
                var sendArguments = "";
                var request = null;
                var notifyComplete = false;
                var async = arguments.length < 3 || typeof arguments[2] !== "boolean" || arguments[2];
                var callback = function callback()
                {
                    if (request)
                    {
                        try
                        {
                            KasperskyLab.XMLHttpRequestSend.apply(request, sendArguments);
                        }
                        catch (e)
                        {
                            ns.SessionLog("Failed origin send + " + e.toString());
                        }
                    }
                    else
                    {
                        notifyComplete = true;
                    }
                };
                var remoteFunctionName = "xhr.ajaxRequestNotify";
                var targetUrl = NormalizeUrl(arguments[1]);
                var remoteFunctionArguments = { url: ns.ToBase64(targetUrl), urlEncrypted: true };
                var result = m_callFunction(remoteFunctionName, remoteFunctionArguments, callback, callback, async);
                if (!result && !async)
                {
                    m_callFunction(remoteFunctionName, remoteFunctionArguments, callback, callback);
                    notifyComplete = true;
                }
                return function processPostAjax()
                {
                    if (notifyComplete)
                    {
                        try
                        {
                            KasperskyLab.XMLHttpRequestSend.apply(this, [].slice.call(arguments));
                        }
                        catch (err)
                        {
                            err.klSkipUnhandled = true;
                            throw err;
                        }
                    }
                    else
                    {
                        sendArguments = arguments.length > 0
                            ? [arguments[0] && arguments[0].slice ? arguments[0].slice() : arguments[0]]
                            : [];
                        request = this; 
                    }
                };
            };
        });
    }
    Initialize();
}, { referrer: document.referrer });
(function XhrTrackerConstants(ns)
{
ns.RequestCustomHeader = "X-KL-kfa-Ajax-Request";
})(KasperskyLab || {});
(function BallonMain(ns)
{
ns.Balloon2 = function Balloon2(pluginName, balloonSrc, balloonCssPostfix, session, getCoordCallback, onCloseHandler, locales, onDataReceiveHandler)
{
    var m_balloon = document.createElement("iframe");
    var m_shadowRoot = null;
    var m_balloonId = pluginName + "_b";
    var m_balloonSize = null;
    var m_sizeCache = {};
    var m_initStyleDataPair = {};
    var m_isInitSent = false;
    var m_updateTimeout = null;
    var m_firstCreate = true;
    var m_isBalloonLoaded = false;
    var m_callQueue = [];
    function ChangeSchemeIfNeed(url)
    {
        if (document.location.protocol === "https:")
            return url.replace("http:", "https:");
        return url;
    }
    function GetResourceUrl()
    {
        return balloonCssPostfix
            ? ns.GetResourceSrc(balloonSrc) + "?cssSrc=" + encodeURIComponent(ChangeSchemeIfNeed(ns["GetResourceSrc"](balloonCssPostfix)))
            : ns.GetResourceSrc(balloonSrc);
    }
    function HideBalloon()
    {
        m_balloon.style.display = "none";
    }
    function InitializeBalloon()
    {
        if (!document.body)
        {
            ns.AddEventListener(window, "load", InitializeBalloon, m_balloonId);
            return;
        }
        m_balloon.scrolling = "no";
        m_balloon.frameBorder = "0";
        m_balloon.style.border = "0";
        m_balloon.style.height = "1px";
        m_balloon.style.width = "1px";
        m_balloon.style.left = "1px";
        m_balloon.style.top = "1px";
        m_balloon.allowTransparency = "true"; 
        m_balloon.style.zIndex = "2147483647";
        m_balloon.style.position = "absolute";
        m_balloon.id = "KlIFrameId";
        if (Element.prototype.attachShadow)
        {
            m_shadowRoot = document.createElement("div");
            m_shadowRoot.setAttribute("class", "KlBalloonClass");
            var shadowRoot = m_shadowRoot.attachShadow({ mode: "open" });
            shadowRoot.appendChild(m_balloon);
            document.body.appendChild(m_shadowRoot);
        }
        else
        {
            document.body.appendChild(m_balloon);
        }
        HideBalloon();
    }
    function IsDisplayed()
    {
        return !m_firstCreate && m_balloon.style.display === "";
    }
    function OnPing()
    {
        return IsDisplayed() ? 100 : ns.MaxRequestDelay;
    }
    function SendToFrame(args)
    {
        if (m_isBalloonLoaded)
            m_balloon.contentWindow.postMessage(ns.JSONStringify(args), GetResourceUrl());
        else
            m_callQueue.push(function DeferSend() { m_balloon.contentWindow.postMessage(ns.JSONStringify(args), GetResourceUrl()); });
    }
    function SendInit(dataToFrame)
    {
        dataToFrame.style = m_initStyleDataPair.style;
        dataToFrame.data = m_initStyleDataPair.data;
        m_isInitSent = true;
        SendToFrame(dataToFrame);
        session.ForceReceive();
    }
    function PutSizeInCache(style, size)
    {
        m_sizeCache[style ? style.toString() : ""] = size;
    }
    function PositionBalloon()
    {
        if (!m_balloonSize)
            return;
        var coords = getCoordCallback(m_balloonSize);
        var newHeight = m_balloonSize.height + "px";
        var newWidth = m_balloonSize.width + "px";
        if (newHeight !== m_balloon.style.height 
            || newWidth !== m_balloon.style.width)
        {
            m_balloon.style.height = newHeight;
            m_balloon.style.width = newWidth;
            ns.SessionLog("Change balloon size " + m_balloonId + " height: " + newHeight + " width: " + newWidth);
        }
        var newX = Math.round(coords.x).toString() + "px";
        var newY = Math.round(coords.y).toString() + "px";
        if (newX !== m_balloon.style.left 
            || newY !== m_balloon.style.top)
        {
            m_balloon.style.left = newX;
            m_balloon.style.top = newY;
            ns.SessionLog("Change balloon position " + m_balloonId + " x: " + newX + " y: " + newY);
        }
    }
    function SetupBalloon(balloonSize)
    {
        m_balloonSize = balloonSize;
        PositionBalloon();
    }
    function OnSizeMessage(sizeMessage)
    {
        var size = {
            height: sizeMessage.height,
            width: sizeMessage.width
        };
        if (size.height !== 0 && size.width !== 0)
            PutSizeInCache(sizeMessage.style, size);
        SetupBalloon(size);
    }
    function OnCloseMessage(closeData)
    {
        HideBalloon();
        if (onCloseHandler && closeData.closeAction)
            onCloseHandler(closeData.closeAction);
    }
    function OnDataMessage(data)
    {
        if (onDataReceiveHandler)
            onDataReceiveHandler(data);
    }
    function GetSizeFromCache(style)
    {
        return m_sizeCache[style ? style.toString() : ""];
    }
    function DisplayBalloon()
    {
        m_balloon.style.display = "";
        session.ForceReceive();
    }
    function UpdateBalloon(style, data)
    {
        if (!m_isInitSent)
            m_initStyleDataPair = { style: style, data: data };
        var sizeFromCache = GetSizeFromCache(style);
        clearTimeout(m_updateTimeout);
        if (sizeFromCache)
        {
            m_updateTimeout = ns.SetTimeout(function UpdateTimerCallback() { SetupBalloon(sizeFromCache); }, 0, "balloon_" + pluginName);
        }
        else
        {
            m_balloon.style.height = "1px";
            m_balloon.style.width = "1px";
            m_balloonSize = { height: 1, width: 1 };
        }
        var dataToFrame = {
            command: "update",
            style: style,
            data: data,
            needSize: !sizeFromCache
        };
        SendToFrame(dataToFrame);
    }
    function CreateBalloon(style, data, size)
    {
        if (m_firstCreate)
        {
            InitializeBalloon();
            m_firstCreate = false;
        }
        DisplayBalloon();
        if (m_balloon.src)
        {
            UpdateBalloon(style, data);
            return;
        }
        m_initStyleDataPair = { style: style, data: data };
        m_balloon.src = GetResourceUrl();
        var balloonSize = size ? size : GetSizeFromCache(style);
        var dataToFrame = {
            command: "init",
            pluginName: m_balloonId,
            isRtl: ns.IsRtl,
            needSize: !balloonSize,
            style: style
        };
        if (data)
            dataToFrame.data = data;
        if (size)
            dataToFrame.explicitSize = size;
        if (locales)
            dataToFrame.locales = locales;
        dataToFrame.commandUrl = ChangeSchemeIfNeed(ns.GetCommandSrc());
        ns.AddEventListener(m_balloon, "load", function onLoad()
        { 
            m_isBalloonLoaded = true;
            SendInit(dataToFrame);
            while (m_callQueue.length)
                m_callQueue.shift()();
        }, "balloon");
        if (balloonSize)
        {
            clearTimeout(m_updateTimeout);
            m_updateTimeout = ns.SetTimeout(function UpdateTimerCallback() { SetupBalloon(balloonSize); }, 0);
        }
    }
    function DestroyBalloon()
    {
        m_balloon.blur(); 
        if (m_shadowRoot)
            document.body.removeChild(m_shadowRoot);
        else
            document.body.removeChild(m_balloon);
        m_firstCreate = true;
        m_balloonSize = null;
    }
    this.Show = function Show(style, data)
    {
        CreateBalloon(style, data);
    };
    this.ShowWithSize = function ShowWithSize(style, data, size)
    {
        CreateBalloon(style, data, size);
    };
    this.Resize = function Resize(size)
    {
        SetupBalloon(size);
    };
    this.Hide = function Hide()
    {
        HideBalloon();
    };
    this.Update = function Update(style, data)
    {
        UpdateBalloon(style, data);
    };
    this.UpdatePosition = function UpdatePosition()
    {
        PositionBalloon();
    };
    this.LightUpdatePosition = function LightUpdatePosition(x, y)
    {
        var newX = Math.round(x).toString() + "px";
        var newY = Math.round(y).toString() + "px";
        if (newX !== m_balloon.style.left 
            || newY !== m_balloon.style.top)
        {
            m_balloon.style.left = newX;
            m_balloon.style.top = newY;
        }
        var dataToFrame = {
            command: "update",
            data: {}
        };
        SendToFrame(dataToFrame);
    };
    this.Destroy = function Destroy()
    {
        DestroyBalloon();
    };
    this.IsFocused = function IsFocused()
    {
        if (!m_balloon)
            return false;
        return document.activeElement === m_balloon;
    };
    function OnFrameDataMessage(argument)
    {
        if (!argument)
        {
            ns.SessionLog(m_balloonId + " empty argument");
            return;
        }
        if (!argument.message)
        {
            ns.SessionLog(m_balloonId + " empty message.");
            return;
        }
        var message = ns.JSONParse(argument.message);
        if (message.type === "size")
            OnSizeMessage(message.data);
        else if (message.type === "close")
            OnCloseMessage(message.data);
        else if (message.type === "data")
            OnDataMessage(message.data);
        else if (message.type === "trace")
            ns.SessionLog(message.data);
        else
            ns.SessionError({ message: "Unknown message type", details: "type: " + message.type }, m_balloonId);
    }
    function Init()
    {
        session.InitializePlugin(function InitializePluginBalloon(activatePlugin, registerMethod)
            {
                activatePlugin(m_balloonId, OnPing);
                registerMethod(m_balloonId + ".message", OnFrameDataMessage);
            });
    }
    Init();
};
return ns;
})(KasperskyLab);
KasperskyLab.StartSession();
 })();
