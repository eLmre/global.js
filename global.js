!function(namespace) {
  'use strict';

  var GLOBAL = GLOBAL || {};

  GLOBAL.keyCode = {
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    LEFT: 37,
    LMB: 0,
    HOME: 36,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    SPACE: 32,
    TAB: 9,
    ESCAPE: 27,
    ENTER: 13,
    NUMPAD_ENTER: 108
  };

  GLOBAL.stopEvent = function stopEvent(event, mode) {
    if (arguments.length == 0 || !event || !jQuery) {
      return;
    } else {
      if ((arguments.length == 1 || ('' + mode).toLowerCase().search(/(^|\|)propagation($|\|)/) != -1) && jQuery.isFunction(event.stopPropagation)) {
        event.stopPropagation();
      }
      if ((arguments.length == 1 || ('' + mode).toLowerCase().search(/(^|\|)default($|\|)/) != -1) && jQuery.isFunction(event.preventDefault)) {
        event.preventDefault();
      }
      if ((arguments.length == 2 && ('' + mode).toLowerCase().search(/(^|\|)immediate($|\|)/) != -1) && jQuery.isFunction(event.stopImmediatePropagation)) {
        event.stopImmediatePropagation();
      }
    }
  };

  GLOBAL.parseData = function parseData(data) {
    if (typeof(data) === 'object') {
      return data;
    }

    try {
      data = JSON.parse(data.replace(/'/gim, '"'));
    } catch (e) {
      data = {};
    }

    return data;
  };

  GLOBAL.parseCallbacks = function parseCallbacks(data, callbacks) {
    var data = GLOBAL.parseData(data),
        callback,
        prop,
        l,
        i;

    for (prop in data) {
      if (callbacks[data[prop]]) {
        data[prop] = callbacks[data[prop]];
      }
    }

    return data;
  };

  GLOBAL.jqCSS = {};

  GLOBAL.jqCSS._get = function(style, prop) {
    var re = new RegExp('(?:^|;)\\s*' + prop + '\\s*:\\s*([^;]*)', 'gi'),
        result = (style || '').match(re);

    if (!result){
      return false;
    }

    result = result[result.length - 1];
    return result.replace(re, '$1');
  };

  GLOBAL.jqCSS._remove = function(style, prop) {
    var re = new RegExp('(^|;)\\s*' + prop + '\\s*:[^;]*;?', 'gi'),
        result = (style || '').replace(re, '$1');

    return result;
  };

  GLOBAL.jqCSS._store = function($elem, css) {
    var result,
        props = {};

    $elem.each(function() {
      var result,
          $elem = jQuery(this),
          style = $elem.attr('style');

      for (var prop in css || {}){
        result = GLOBAL.jqCSS._get(style || '', prop);
        if (!result){
          continue;
        }
        props[prop] = result;
      }

      var data = $elem.data('GLOBAL') || {};
      data.jqCSS = jQuery.extend(data.jqCSS || {}, props);
      $elem.data('GLOBAL', data);
    });
  };

  GLOBAL.jqCSS._restore = function($elem, css) {
    var props = css.split(/\s+/);

    $elem.each(function() {
      var $elem = jQuery(this),
          result = {},
          data = $elem.data('GLOBAL') || {};

      data.jqCSS = data.jqCSS || {};
      for (var prop, i = 0, l = props.length; i < l; i++){
        prop = props[i];
        if (prop.search(/\S/) == -1 || !data.jqCSS[prop]){
          continue;
        }
        result[prop] = data.jqCSS[prop];
      }

      $elem.css(result);
    });
  };

  GLOBAL.jqCSS.add = function($elem, css, isStore) {
    if (typeof(isStore) == 'undefined' || isStore){
      GLOBAL.jqCSS._store($elem, css);
    }

    $elem.css(css);
  };

  GLOBAL.jqCSS.remove = function($elem, css, isRestore) {
    var props = css.split(/\s+/);

    $elem.each(function() {
      var $elem = jQuery(this),
          style = $elem.attr('style');

      for (var prop, i = 0, l = props.length; i < l; i++){
        prop = props[i];
        if (prop.search(/\S/) == -1){
          continue;
        }
        style = GLOBAL.jqCSS._remove(style || '', prop);
      }
      $elem.attr('style', style);
    });

    if (typeof(isStore) == 'undefined' || isRestore){
      GLOBAL.jqCSS._restore($elem, css);
    }
  };

  GLOBAL.String = {};

  GLOBAL.String.trim = function(str, saveLastSpace) {
    var returnValue = '' + str,
        endSpace = saveLastSpace && returnValue.substr(returnValue.length).search(/\s/g) != -1;

    return returnValue.replace(/^\s*(\S.*\S)\s*$/, '$1') + (endSpace ? ' ' : '');
  };

  GLOBAL.String.normalizeSpaces = function(str) {
    return str.replace(/\s+/g, ' ');
  };

  GLOBAL.String.normalize = function(str, saveLastSpace) {
    return GLOBAL.String.normalizeSpaces(GLOBAL.String.trim(str, saveLastSpace));
  };

  GLOBAL.String.nospaces = function(str) {
    return str.replace(/\s/g, '');
  };

  GLOBAL.String.capitalizing = function(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
  };

  GLOBAL.declension = function declension(num, dict) {
    var numeral = ' ' + num,
      tens = numeral.substr(-2, 1),
      ones = numeral.substr(-1, 1);

    if ('' + num === '0') {
      numeral = (typeof(dict['zero']) !== 'undefined') ? 'zero' : 'many';
    } else if (tens === '1') {
      numeral = 'many';
    } else {
      switch (ones) {
        case '1':
          numeral = 'one';
          break;
        case '2':
        case '3':
        case '4':
          numeral = 'some';
          break;
        default:
          numeral = 'many';
          break;
      }
    }

    return ('' + dict[numeral]).replace(/%num%/gim, num);
  };

  GLOBAL.getCookie = function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  GLOBAL.setCookie = function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == 'number' && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + '=' + value;

    for (var propName in options) {
      updatedCookie += '; ' + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += '=' + propValue;
      }
    }

    document.cookie = updatedCookie;
  };

  GLOBAL.deleteCookie = function deleteCookie(name) {
    GLOBAL.setCookie(name, '', {
      expires: -1,
      path: '/'
    });
  };

  GLOBAL.getWidthScroll = function getWidthScroll() {
    var div = document.createElement('div'),
        scrollWidth = 0;

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.visibility = 'hidden';

    document.body.appendChild(div);
    scrollWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    return scrollWidth;
  };

  GLOBAL.isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (GLOBAL.isMobile.Android() || GLOBAL.isMobile.BlackBerry() || GLOBAL.isMobile.iOS() || GLOBAL.isMobile.Opera() || GLOBAL.isMobile.Windows());
    }
  };

  GLOBAL.getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  };

  GLOBAL.addUrlParameter = function addUrlParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
  }

  GLOBAL.Base64 = {

    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode: function(input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = GLOBAL.Base64._utf8_encode(input);

      while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

      }

      return output;
    },

    decode: function(input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }

      }

      output = GLOBAL.Base64._utf8_decode(output);

      return output;

    },

    _utf8_encode: function(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }

      }

      return utftext;
    },

    _utf8_decode: function(utftext) {
      var string = "";
      var i = 0;
      var c = 0;
      var c1 = 0;
      var c2 = 0;

      while (i < utftext.length) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        }
        else if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        }
        else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }

      }

      return string;
    }

  }

  namespace.GLOBAL = GLOBAL;
}(this);
