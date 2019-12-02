/**
 * ****************************************************************************
 * QUYPN COMMON CODE
 * SECURE.JS
 * 
 * @description		:	Các phương thức và sự kiện liên quan đến mã hóa và bảo mật dữ liệu
 * @created at		:	2018/08/29
 * @created by		:	QuyPN – quypn09@gmail.com
 * @package		    :	COMMON
 * @copyright	    :	Copyright (c) QUYPN
 * @version		    :	1.0.0
 * ****************************************************************************
 */

/*** Module Secure ***/
/*
 * Module chứa các xử lý cho việc mã hóa và giải mã 1 chuỗi string
 * Author       :   QuyPN - 2018/08/29 - create
 * Param        :   
 * Output       :   Secure.EncodeMD5(str) - Mã hóa MD5 cho chuỗi str
 * Output       :   Secure.EncodeBase64(str) - Mã hóa Base64 cho chuỗi str
 * Output       :   Secure.DecodeBase64(str) - Giải mã Base64 cho chuỗi str
 */
var Secure = (function () {
    /**
     * ****************************************************************************
     * Các xử lý cho mã hóa MD5
     * ****************************************************************************
     */
    var _CONSTANTS = {
        HEX_CHAR : '0123456789abcdef',
        KEY_STR : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    };
    /*
     * Convert a 32-bit number to a hex string with ls-byte first
     */
    var _rhex = function (num) {
        str = "";
        for (j = 0; j <= 3; j++)
            str += _CONSTANTS.HEX_CHAR.charAt((num >> (j * 8 + 4)) & 0x0F) +
                   _CONSTANTS.HEX_CHAR.charAt((num >> (j * 8)) & 0x0F);
        return str;
    };
    /*
     * Convert a string to a sequence of 16-word blocks, stored as an array.
     * Append padding bits and the length, as described in the MD5 standard.
     */
    var _str2blksMD5 = function (str) {
        nblk = ((str.length + 8) >> 6) + 1;
        blks = new Array(nblk * 16);
        for (i = 0; i < nblk * 16; i++) blks[i] = 0;
        for (i = 0; i < str.length; i++)
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        blks[i >> 2] |= 0x80 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
    };
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    var _add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    /*
     * Bitwise rotate a 32-bit number to the left
     */
    var _rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };
    /*
     * These functions implement the basic operation for each round of the
     * algorithm.
     */
    var _cmn = function (q, a, b, x, s, t) {
        return _add(_rol(_add(_add(a, q), _add(x, t)), s), b);
    };
    var _ff = function (a, b, c, d, x, s, t) {
        return _cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };
    var _gg = function (a, b, c, d, x, s, t) {
        return _cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };
    var _hh = function (a, b, c, d, x, s, t) {
        return _cmn(b ^ c ^ d, a, b, x, s, t);
    };
    var _ii = function (a, b, c, d, x, s, t) {
        return _cmn(c ^ (b | (~d)), a, b, x, s, t);
    };
    /**
     * mã hóa MD5 1 chuỗi string
     * 
     * @author : QuyPN - 2018/08/29 - create
     * @params : str - string - chuỗi cần mã hóa
     * @return : string - chuỗi sau khi đã mã hóa
     * @access : public
     */
    var EncodeMD5 = function (str) {
        x = _str2blksMD5(str);
        a = 1732584193;
        b = -271733879;
        c = -1732584194;
        d = 271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = _ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = _ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = _ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = _ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = _ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = _ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = _ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = _ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = _ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = _ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = _ff(c, d, a, b, x[i + 10], 17, -42063);
            b = _ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = _ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = _ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = _ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = _ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = _gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = _gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = _gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = _gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = _gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = _gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = _gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = _gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = _gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = _gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = _gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = _gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = _gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = _gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = _gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = _gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = _hh(a, b, c, d, x[i + 5], 4, -378558);
            d = _hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = _hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = _hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = _hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = _hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = _hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = _hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = _hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = _hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = _hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = _hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = _hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = _hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = _hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = _hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = _ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = _ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = _ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = _ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = _ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = _ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = _ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = _ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = _ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = _ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = _ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = _ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = _ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = _ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = _ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = _ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = _add(a, olda);
            b = _add(b, oldb);
            c = _add(c, oldc);
            d = _add(d, oldd);
        }
        return _rhex(a) + _rhex(b) + _rhex(c) + _rhex(d);
    };
    /**
     * ****************************************************************************
     * Các chức năng về mã hóa Base64
     * ****************************************************************************
     */
    var _utf8Encode = function (string) {
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
    };
    var _utf8Decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

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
    /**
     * mã hóa Base64 1 chuỗi string
     * 
     * @author : QuyPN - 2018/08/29 - create
     * @params : input - string - chuỗi cần mã hóa
     * @return : string - chuỗi sau khi đã mã hóa
     * @access : public
     */
    var EncodeBase64 = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = _utf8Encode(input);

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

            output = output +
                _CONSTANTS.KEY_STR.charAt(enc1) + _CONSTANTS.KEY_STR.charAt(enc2) +
                _CONSTANTS.KEY_STR.charAt(enc3) + _CONSTANTS.KEY_STR.charAt(enc4);

        }
        return output;
    };
    /**
     * giải mã 1 chuỗi Base64 sang chuỗi bình thường
     * 
     * @author : QuyPN - 2018/08/29 - create
     * @params : str - string - chuỗi cần giải mã
     * @return : string - chuỗi sau khi đã giải mã
     * @access : public
     */
    var DecodeBase64 = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = _CONSTANTS.KEY_STR.indexOf(input.charAt(i++));
            enc2 = _CONSTANTS.KEY_STR.indexOf(input.charAt(i++));
            enc3 = _CONSTANTS.KEY_STR.indexOf(input.charAt(i++));
            enc4 = _CONSTANTS.KEY_STR.indexOf(input.charAt(i++));

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
        output = _utf8Decode(output);
        return output;
    };
    return {
        EncodeMD5 : EncodeMD5,
        EncodeBase64 : EncodeBase64,
        DecodeBase64 : DecodeBase64
    };
})();