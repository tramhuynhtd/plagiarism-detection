/**
 * ****************************************************************************
 * QUYPN COMMON CODE
 * COMMON.JS
 * 
 * @description		:	Các phương thức và sự kiện chung hay xử lý trong web
 * @created at		:	2018/07/07
 * @created by		:	QuyPN – quypn09@gmail.com
 * @package		    :	COMMON
 * @copyright	    :	Copyright (c) QUYPN
 * @version		    :	1.0.0
 * ****************************************************************************
 */

/*** CONSTANTS OF COMMON ***/
/*** Lấy giá trị constants  CONSTANTS.msgRequired ***/
const CONSTANTS = {
    DATE_OPTION: { format: 'DD/MM/YYYY', minDate: '1975', maxDate: '9999', allowInputToggle: true },
    YM_OPTION: { format: 'MM/YYYY', minDate: '1975', maxDate: '9999', allowInputToggle: true },
    CONFIRM: 1,
    SUCCESS: 2,
    WARNING: 3,
    ERROR: 4,
    INFO: 5,
    ALERT: 6
}
$(document).ready(function () {
    NumberModule.InitEvents();
    DateModule.InitEvents();
    TimeModule.InitEvents();
    StringModule.InitEvents();
    ValidateModule.InitEvents();
    Common.InitEvents();
});

var NumberModule = (function () {
    var InitEvents = function () {
        //keydown numeric
        $(document).on('keydown', 'input.numeric', function (event) {
            OnlyTypeNumber(event);
        });
        $(document).on('keydown', 'input.decimal:enabled', function (e) {
            if (!((e.keyCode > 47 && e.keyCode < 58)
                || (e.keyCode > 95 && e.keyCode < 106)
                // ////////// PERIOD SIGN
                || ((e.keyCode == 190 || e.keyCode == 110) && $(this).val().indexOf('.') === -1)
                || e.keyCode == 173
                || e.keyCode == 109
                || e.keyCode == 189
                || e.keyCode == 116
                || e.keyCode == 46
                || e.keyCode == 37
                || e.keyCode == 39
                || e.keyCode == 8
                || e.keyCode == 9
                || e.keyCode == 229 // ten-key processing
                ||
                ($.inArray(e.keyCode, [65, 67, 86, 88, 116]) !== -1 && e.ctrlKey === true)
                ||
                // Allow: Ctrl+A, C, X, V
                ($.inArray(e.keyCode, [9]) !== -1 && e.shiftKey === true)
                ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)
            )) {
                e.preventDefault();
                return false;
            }
            // check numeric is negative ?
            var negativeEnabled = $(this).attr('negative');
            if (e.keyCode != 116
                && e.keyCode != 46
                && e.keyCode != 37
                && e.keyCode != 39
                && e.keyCode != 8
                && e.keyCode != 9
                && e.keyCode != 173
                && e.keyCode != 189
                && e.keyCode != 109
                && ($(this).get(0).selectionEnd - $(this).get(0).selectionStart) < $(this).val().length
            ) {
                // DEFAULT PARAMS (NUMERIC (10, 0))
                var ml = 10;
                var dc = 0;
                if (parseInt($(this).attr('maxlength')) * 1 > 2) {
                    //ml = 1 * $(this).attr('maxlength') - 1;
                    ml = 1 * $(this).attr('maxlength');
                }
                if (parseInt($(this).attr('decimal')) > 0) {
                    dc = 1 * $(this).attr('decimal');
                    if (dc >= ml - 1) {
                        dc = 0;
                    }
                }
                var it = (ml - (dc > 0 ? (dc + 1) : 0));
                // CURRENT STATES
                var val = $(this).val();
                var negative = val.indexOf('-') > -1;
                var selectionStart = $(this).get(0).selectionStart;
                var selectionEnd = $(this).get(0).selectionEnd;
                if (negative) {
                    val = val.substring(1);
                    selectionStart--;
                    selectionEnd--;
                }
                // OUTPUT STATES
                var destSelectionStart = undefined;
                var destSelectionEnd = undefined;
                var destVal = undefined;
                // SKIP PERIOD KEY WHEN DECIMAL = 0
                if (dc == 0 && (e.keyCode == 190 || e.keyCode == 110)) {
                    e.preventDefault();
                }
                // EXCEED THE ACCEPTED NUMBER OF INTEGERS
                if (val.match(new RegExp('[0-9]{' + it + '}')) && selectionStart <= it) {
                    // PERIOD DOES NOT EXIST
                    if (val.indexOf('.') === -1) {
                        // PERIOD KEY NOT RECEIVED (USER FORGETS TO TYPE PERIOD) DECIMAL > 0
                        if (e.keyCode != 190 && e.keyCode != 110 && dc > 0) {
                            e.preventDefault();
                            //var output = val.substring(0,selectionStart) + String.fromCharCode((96 <= e.keyCode && e.keyCode <= 105) ? e.keyCode - 48 : e.keyCode) + val.substring(selectionStart);   
                            var output = '';
                            if (e.keyCode >= 96 && e.keyCode <= 105) {
                                output = val.substring(0, selectionStart) + String.fromCharCode(e.keyCode - 48) + val.substring(selectionStart);
                                destVal = output.substring(0, ml - (dc + 1)) + '.' + output.substring(ml - (dc + 1));
                            } else if (e.keyCode == 229) {
                                if ($.inArray(e.key, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) !== -1) {
                                    output = val.substring(0, selectionStart) + e.key + val.substring(selectionStart);
                                }
                                if (output.substring(ml - (dc + 1)) != '') {
                                    destVal = output.substring(0, ml - (dc + 1)) + '.' + output.substring(ml - (dc + 1));
                                } else {
                                    destVal = output.substring(0, ml - (dc + 1));
                                }
                            } else {
                                output = val.substring(0, selectionStart) + String.fromCharCode(e.keyCode) + val.substring(selectionStart);
                                destVal = output.substring(0, ml - (dc + 1)) + '.' + output.substring(ml - (dc + 1));
                            }
                            // INSERT PERIOD    
                        }
                        // PERIOD EXISTS
                        // CARET STARTS NEXT TO THE PERIOD
                    } else if (selectionStart == val.indexOf('.')) {
                        // EXCEED THE ACCEPTED NUMBER OF
                        // DECIMALS
                        if (val.match(new RegExp('\\.[0-9]{' + dc + '}$'))) {
                            e.preventDefault();
                        } else {
                            // JUMP TO THE NEXT POSITION THEN
                            // INSERT THE DIGIT
                            destSelectionStart = selectionStart + 1;
                        }
                        // CARET STARTS BEFORE THE PERIOD AND
                        // NOTHING HIGHLIGHTED
                    } else if (selectionStart < val.indexOf('.') && selectionStart == selectionEnd) {
                        e.preventDefault();
                        // CARET STARTS BEFORE THE PERIOD AND
                        // ENDS AFTER THE PERIOD (HIGHLIGHTS
                        // OVER THE PERIOD)
                    } else if (selectionEnd > val.indexOf('.') && selectionStart < val.indexOf('.')) {
                        e.preventDefault();
                        var output = '';
                        if (e.keyCode >= 96 && e.keyCode <= 105) {
                            output = val.substring(0, selectionStart) + String.fromCharCode(e.keyCode - 48) + val.substring(selectionEnd);
                            destVal = output.substring(0, ml - (dc + 1)) + '.' + output.substring(ml - (dc + 1));
                        } else if (e.keyCode == 229) {
                            //output = val.substring(0,selectionStart)+ val.substring(selectionEnd);
                            if ($.inArray(e.key, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) !== -1) {
                                output = val.substring(0, selectionStart) + e.key + val.substring(selectionStart);
                            }
                            if (output.substring(ml - (dc + 1)) != '') {
                                destVal = output.substring(0, ml - (dc + 1)) + '.' + output.substring(ml - (dc + 1));
                            } else {
                                destVal = output.substring(0, ml - (dc + 1));
                            }
                        } else {
                            output = val.substring(0, selectionStart) + String.fromCharCode(e.keyCode) + val.substring(selectionEnd);
                            destVal = output.substring(0, ml - (dc + 1)) + '.' + output.substring(ml - (dc + 1));
                        }
                        //
                        destSelectionStart = selectionStart + 1;
                        destSelectionEnd = selectionStart + 1;
                    }
                    // INTEGERS CAN BE ADDED BUT...
                    // EXCEED THE ACCEPTED NUMBER OF DECIMALS
                } else if (val.match(new RegExp('\\.[0-9]{' + dc + '}$'))) {
                    // PERIOD EXISTS
                    // CARET STARTS AFTER THE PERIOD
                    if (val.indexOf('.') != -1 && selectionStart > val.indexOf('.')) {
                        //e.preventDefault();
                    }
                }
                // CARET RESULT
                if (typeof destVal != undefined) {
                    if (destVal && negative) {
                        destVal = '-' + destVal;
                    }
                    if (destVal) {
                        $(this).val(destVal);
                    }
                }
                //
                if (negative && destSelectionStart) {
                    destSelectionStart++;
                }
                if (destSelectionStart) {
                    $(this).get(0).selectionStart = destSelectionStart;
                }
                if (negative && destSelectionEnd) {
                    destSelectionEnd++;
                }
                if (destSelectionEnd) {
                    $(this).get(0).selectionEnd = destSelectionEnd;
                }
                // when click [-]
            } else if (e.keyCode == 173 || e.keyCode == 109 || e.keyCode == 189) {
                e.preventDefault();
                if (negativeEnabled) {
                    var val = $(this).val();
                    var negative = val.indexOf('-') > -1;
                    if (negative) {
                        $(this).val(val.substring(1));
                    } else {
                        $(this).val('-' + val);
                    }
                }
            }
            // fix maxlenght
            var val = $(this).val();
            if ($(this).attr('fixed') != undefined && val.indexOf('-') > -1) {
                var f_maxlenght = (parseInt($(this).attr('maxlengthfixed')) + 1) + '';
                if (val.length <= f_maxlenght) {
                    $(this).attr('maxlength', f_maxlenght);
                } else {
                    $(this).attr('maxlength', f_maxlenght);
                }
            } else if ($(this).attr('maxlength') > $(this).attr('maxlengthfixed')) {
                $(this).attr('maxlength', $(this).attr('maxlengthfixed'));
            }
        });

        // input method for decimal
        $(document).on('blur', 'input.decimal:enabled', function () {
            try {
                var negativeEnabled = $(this).attr('negative');
                var val = $(this).val();
                //
                if (typeof val != undefined && val != '') {
                    var negative = val.indexOf('-') > -1;
                    var negative_1 = val.indexOf('－') > -1;
                    if (negative || negative_1) {
                        val = val.substring(1);
                    }
                    var old = val;
                    val = val.replace('.', '');
                    val = old;
                    //
                    var dc = 1 * $(this).attr('decimal');
                    var result = parseFloat(val.replace(/,/g, ""));
                    if (result || result === 0) {
                        result = result.toFixed(dc);
                        if (result.indexOf('.') > -1) {
                            var integer = result.substring(0, result.indexOf('.')).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            var decimal = result.substring(result.indexOf('.'));
                            var ml = typeof $(this).attr('maxlength') != 'undefined' ? parseInt($(this).attr('maxlength')) : 0;
                            if (ml > 0 && integer.length > (ml - 2)) {
                                var num = ml - dc - 1;
                                var tmp = $(this).val().replace('.', "");
                                integer = parseFloat(tmp.substring(0, num));
                                decimal = parseFloat('0.' + tmp.substring(num, num + dc));
                            }
                            val = integer + decimal;
                        } else {
                            val = result.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                    } else {
                        val = '';
                    }
                    if (!isNaN((val+'').replace(/,/g, ''))) {
                        //
                        $(this).val((val != '' && val != '0' && val != 'NaN' && negativeEnabled && negative) ? ('-' + val) : val);
                    } else {
                        $(this).val('');
                    }
                }
            } catch (e) {
                alert('Error input.decimal blur event: ' + e.message);
            }
        });
        $(document).on('focus', 'input.money,input.decimal', function () {
            $(this).val($(this).val().replace(/,/g, ''));
        });
    };

    var OnlyTypeNumber = function (event) {
        try {
            if ((!((event.keyCode > 47 && event.keyCode < 58) // 0 ~ 9
                || (event.keyCode > 95 && event.keyCode < 106) // numpad 0 ~ 9
                || event.keyCode == 116 // F5
                || event.keyCode == 46 // del
                || event.keyCode == 35 // end
                || event.keyCode == 36 // home
                || event.keyCode == 37 // ←
                || event.keyCode == 39 // →
                || event.keyCode == 8 // backspace
                || event.keyCode == 9 // tab
                || (event.shiftKey && event.keyCode == 35) // shift + end
                || (event.shiftKey && event.keyCode == 36) // shift + home
                || event.ctrlKey))// allow all ctrl combination
                || (event.shiftKey && (event.keyCode > 47 && event.keyCode < 58))) {// exlcude
                event.preventDefault();
            }
        }
        catch (e) {
            console.log('OnlyTypeNumber: ' + e.message);
            return false;
        }
    };
    function ToNumber(string) {
        try {
            var num = 0;
            var convert = parseFloat(string.replace(/,/g, ''));
            if (!isNaN(convert)) {
                convert = parseInt(string.replace(/,/g, ''));
                if (!isNaN(convert)) {
                    num = convert;
                }
            }
            return num;
        } catch (e) {
            console.log('ToNumber: ' + e.message);
            return 0;
        }
    };
    function ValidateNumber(string) {
        try {
            var regexp = /^-*[0-9]+$/;
            if (regexp.test(string) || string == '') {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e.message);
        }
    };
    return {
        InitEvents: InitEvents,
        OnlyTypeNumber: OnlyTypeNumber,
        ToNumber: ToNumber,
        ValidateNumber: ValidateNumber
    };
})();

var DateModule = (function () {
    var InitEvents = function () {
        $(document).on('blur', 'input.date ', function () {
            try {
                var string = $(this).val();
                var reg1 = /^[0-9]{8}$/;
                var reg2 = /^[0-9]{2}[\/.][0-9]{2}[\/.][0-9]{4}$/;
                if (string.match(reg1)) {
                    $(this).val(
                        string.substring(0, 2) + '/'
                        + string.substring(2, 4) + '/'
                        + string.substring(4));
                } else if (string.match(reg2)) {
                    $(this).val(string);
                } else {
                    $(this).val('');
                }
                if (!ValidateModule.ValidateDate($(this).val())) {
                    $(this).val('');
                }
            } catch (e) {
                console.log(e.message);
                $(this).val('');
            }
        });
        $(document).on('focus', 'input.date', function () {
            try {
                var string = $(this).val();
                var reg = /^[0-9]{2}[\/.][0-9]{2}[\/.][0-9]{4}$/;
                if (string.match(reg)) {
                    $(this).val(string.replace(/\D/g, ''));
                }
            } catch (e) {
                console.log(e.message);
                $(this).val('');
            }
        });
        $(document).on('keydown', 'input.date, input.month', function (event) {
            //console.log(event.keyCode);
            if ((!((event.keyCode > 47 && event.keyCode < 58) // 0 ~
                // 9
                || (event.keyCode > 95 && event.keyCode < 106) // numpad
                // 0 ~
                // numpad
                // 9
                || event.keyCode == 116 // F5
                || event.keyCode == 46 // del
                || event.keyCode == 35 // end
                || event.keyCode == 36 // home
                || event.keyCode == 37 // ←
                || event.keyCode == 39 // →
                || event.keyCode == 8 // backspace
                || event.keyCode == 9 // tab
                || event.keyCode == 191 // forward slash
                || event.keyCode == 92 // forward slash
                || event.keyCode == 111 // divide
                || (event.shiftKey && event.keyCode == 35) // shift
                // +
                // end
                || (event.shiftKey && event.keyCode == 36) // shift
                // +
                // home
                || event.ctrlKey // allow all ctrl combination
            ))
                || (event.shiftKey && (event.keyCode > 47 && event.keyCode < 58)) // exlcude
                // Shift
                // +
                // [0~9]
            )
                event.preventDefault();
        });
    }
    var InitDatePicker = function () {
        try {
            $(".datetimepicker").datetimepicker(CONSTANTS.DATE_OPTION).on("dp.show", function () {
                return $(this).data('DateTimePicker').defaultDate(new Date());
            });
        }
        catch (e) {
            console.log('InitDatePicker: ' + e.message);
        }
    };
    return {
        InitEvents: InitEvents,
        InitDatePicker: InitDatePicker
    }
})();

var TimeModule = (function () {
    var InitEvents = function () {
        //keydown numeric
        $(document).on('keydown', 'input.time24,input.time', function (event) {
            _typeTime(event);
        });
        $(document).on('blur', 'input.time', function () {
            var string = PadZeroForTime($(this).val(), 4);
            var reg1 = /^((0[0-9])|([0-1][0-9])|(2[0-3])):[0-5][0-9]|[2][4]:[0][0]$/;
            var reg2 = /^((0[0-9])|([0-1][0-9])|(2[0-3]))[0-5][0-9]|[2][4][0][0]$/;
            if (string.match(reg1)) {
                $(this).val(string);
            } else if (string.match(reg2)) {
                $(this).val(string.substring(0, 2) + ':' + string.substring(2, 4));
            } else {
                $(this).val('');
            }
            if (!ValidateModule.ValidateTime($(this).val())) {
                $(this).val('');
            }
        });
        $(document).on('focus', 'input.time', function () {
            $(this).val($(this).val().replace(/:/g, ''));
        });
    };

    var _typeTime = function (event) {
        try {
            if ((!((event.keyCode > 47 && event.keyCode < 58) // 0 ~ 9
                || (event.keyCode > 95 && event.keyCode < 106) // numpad 0 ~ 9
                || event.keyCode == 116 // F5
                || event.keyCode == 46 // del
                || event.keyCode == 35 // end
                || event.keyCode == 36 // home
                || event.keyCode == 37 // ←
                || event.keyCode == 39 // →
                || event.keyCode == 8 // backspace
                || event.keyCode == 9 // tab
                || (event.shiftKey && event.keyCode == 186) // :
                || (event.shiftKey && event.keyCode == 35) // shift + end
                || (event.shiftKey && event.keyCode == 36) // shift + home
                || event.ctrlKey))// allow all ctrl combination
                || (event.shiftKey && (event.keyCode > 47 && event.keyCode < 58))) {// exlcude
                event.preventDefault();
            }
        }
        catch (e) {
            console.log('OnlyTypeNumber: ' + e.message);
            return false;
        }
    };

    var PadZeroForTime = function (string, maxLength) {
        var lengthOfString = string.length;
        if (string == '') {
            for (var i = 0; i < maxLength; i++) {
                string += '0';
            }
            return string;
        }

        if (lengthOfString == maxLength) {
            return string;
        }

        if (lengthOfString > maxLength) {
            for (var i = 0; i < maxLength; i++) {
                string = '0000';
            }
            return string;
        }

        if (lengthOfString == 1) {
            for (var i = 0; i < (maxLength - 3); i++) {
                string = "0" + string;
            }
            string = string + "00";
        } else if (lengthOfString == 2) {
            for (var i = 0; i < (maxLength - 4); i++) {
                string = "0" + string;
            }
            string = string + "00";
        } else if (lengthOfString == 3) {
            string = string + "0"
            for (var i = 0; i < (maxLength - 4); i++) {
                string = "0" + string;
            }
        } else {
            for (var i = 0; i < maxLength; i++) {
                string += '0';
            }
            return string;
        }
        return string;
    };

    return {
        InitEvents: InitEvents
    };
})();

var StringModule = (function () {
    var InitEvents = function () {

    };

    function OnlyAlphabetKeydown(event) {
        try {
            if ((!((event.keyCode > 47 && event.keyCode < 58) // 0 ~ 9
                || (event.keyCode > 95 && event.keyCode < 106) // numpad 0 ~ 9
                || (event.keyCode > 64 && event.keyCode < 91) //A-Z
                || (event.keyCode > 96 && event.keyCode < 123) //a-z
                || event.keyCode == 116 // F5
                || event.keyCode == 46 // del
                || event.keyCode == 35 // end
                || event.keyCode == 36 // home
                || event.keyCode == 37 // ←
                || event.keyCode == 39 // →
                || event.keyCode == 8 // backspace
                || event.keyCode == 9 // tab
                || event.keyCode == 109 // numpad -
                || event.keyCode == 189 // -
                || event.keyCode == 190 // .
                || event.keyCode == 110 // numpad .
                || (event.shiftKey && event.keyCode == 189) // _
                || (event.shiftKey && event.keyCode == 35) // shift + end
                || (event.shiftKey && event.keyCode == 36) // shift + home
                || event.ctrlKey)) // allow all ctrl combination
                || (event.shiftKey && (event.keyCode > 47 && event.keyCode < 58))) {// exlcude
                event.preventDefault();
            }
        }
        catch (e) {
            console.log('OnlyAlphabetKeydown: ' + e.message);
            return false;
        }
    }

    var CastString = function (stringInput) {
        try {
            if (stringInput == null) {
                return ('');
            } else {
                return (stringInput.toString());
            }
        } catch (e) {
            console.log('CastString: ' + e.message);
            return '';
        }
    };
    return {
        InitEvents: InitEvents,
        OnlyAlphabetKeydown: OnlyAlphabetKeydown,
        CastString: CastString,
    };
})();

var ValidateModule = (function () {
    var InitEvents = function () {
        // blur input item
        $(document).on('blur', 'input, textarea', function () {
            if ($(this).val() != '' && $(this).hasClass('required') && $(this).attr(Notification.TOOLTIP_ATTR) == _msg[MSG_NO.REQUIRED].content) {
                $(this).RemoveError();// file notification.js
            }
        });
        // blur select item
        $(document).on('blur', 'select', function () {
            if (NumberModule.ToNumber($(this).val()) > 0 && $(this).hasClass('required') && $(this).attr(Notification.TOOLTIP_ATTR) == _msg[MSG_NO.REQUIRED].content) {
                $(this).RemoveError();// file notification.js
            }
        });
    };

    var IsEmail = function (email) {
        try {
            if (email === '') {
                return false;
            }
            var pattern = /^[\w-.+]+@[a-zA-Z0-9_-]+?\.[a-zA-Z0-9._-]*$/;
            return pattern.test(email);
        }
        catch (e) {
            console.log('IsEmail: ' + e.message);
            return false;
        }
    };

    var IsURL = function (url) {
        try {
            var pattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            return pattern.test(url);
        }
        catch (e) {
            console.log('IsURL: ' + e.message);
            return false;
        }
    };

    var IsDate = function (string) {
        try {
            if (string == '') {
                return true;
            }
            if (string.length == 8) {
                string = string.substring(0, 2) + '/' + string.substring(2, 4) + '/'
                    + string.substring(6);
            }
            var reg = /^(31[\/.](0[13578]|1[02])[\/.]((19|[2-9][0-9])[0-9]{2}))|((29|30)[\/.](01|0[3-9]|1[0-2])[\/.](19|[2-9][0-9])[0-9]{2})|((0[1-9]|1[0-9]|2[0-8])[\/.](0[1-9]|1[0-2])[\/.](19|[2-9][0-9])[0-9]{2})|(29[\/.](02)[\/.](((19|[2-9][0-9])(04|08|[2468][048]|[13579][26]))|2000))$/;
            if (string.match(reg)) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log('IsDate: ' + e.message);
            return false;
        }
    };

    var ValidateTime = function (string) {
        var reg = /^((0[0-9])|([1-3][0-9])|(2[0-3])):[0-5][0-9]|[2][4]:[0][0]$/;
        if (string.match(reg) || string == '') {
            return true;
        } else {
            return false;
        }
    }

    var ValidateDate = function (string) {
        try {
            if (string == '') {
                return true;
            }
            if (string.length == 8) {
                string = string.substring(0, 2) + '/' + string.substring(2, 4) + '/'
                    + string.substring(6);
            }
            var reg = /^(31[\/.](0[13578]|1[02])[\/.]((19|[2-9][0-9])[0-9]{2}))|((29|30)[\/.](01|0[3-9]|1[0-2])[\/.](19|[2-9][0-9])[0-9]{2})|((0[1-9]|1[0-9]|2[0-8])[\/.](0[1-9]|1[0-2])[\/.](19|[2-9][0-9])[0-9]{2})|(29[\/.](02)[\/.](((19|[2-9][0-9])(04|08|[2468][048]|[13579][26]))|2000))$/;
            if (string.match(reg)) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log('ValidateDate: ' + e.message);
        }
    }

    var _validateByObject = function (obj) {
        try {
            var error = 0;
            ClearAllError(obj);
            $.each(obj, function (key, element) {
                var className = element['attr']['class'];
                var maxlength = element['attr']['maxlength'];
                var email = element['attr']['email'];
                var msg_maxlength = '';
                if (typeof (_msg) != 'undefined' && _msg[MSG_NO.EXCEED_MAXLENGTH] != undefined) {
                    msg_maxlength = _msg[MSG_NO.EXCEED_MAXLENGTH].content.replace('{0}', maxlength);
                }
                var type = element['type'];
                if (element['type'] == 'CKEditor' || element['attr']['isCKEditor']) {
                    try {
                        var editor = CKEDITOR.instances[key];
                        if (maxlength != undefined && maxlength != null && maxlength > 0) {
                            if (editor.getData().length > maxlength) {
                                error += 1;
                                $('.cke_editor_' + editor.name).ItemError(msg_maxlength);
                            }
                        }
                        if (/required/.test(className)) {
                            if (editor.getData().length == 0) {
                                error += 1;
                                $('.cke_editor_' + editor.name).ItemError(_msg[MSG_NO.REQUIRED].content);
                            }
                        }
                    } catch (ex) {
                        console.log('ValidateCkeditor: ' + ex.message);
                    }
                }
                else {
                    var selector = '#' + key;
                    if (element['attr']['isClass'] === true) {
                        selector = '.' + key;
                    }
                    $('body').find(selector).each(function () {
                        if (!$(this).is(':disabled') && $(this).attr('not-check') !== "true") {
                            if (/required/.test(className)) {
                                if ($(this).val() === '' || (element['type'] === 'select' && NumberModule.ToNumber($(this).val()) === 0)) {
                                    $(this).ItemError(_msg[MSG_NO.REQUIRED].content);
                                    error++;
                                }
                            }
                            if (maxlength != undefined) {
                                var val = $(this).val();
                                if ($(this).hasClass('money')) {
                                    val = val.replace(/,/g, '');
                                }
                                if ($(this).hasClass('date')) {
                                    val = val.replace(/\//g, '');
                                }
                                if ($(this).hasClass('time')) {
                                    val = val.replace(/:/g, '');
                                }
                                if (val.length > maxlength) {
                                    $(this).ItemError(msg_maxlength);
                                    error++;
                                }
                            }
                            if ($(this).val() !== '' && (/email/.test(className) || element['type'] === 'email')) {
                                if (!IsEmail($(this).val())) {
                                    $(this).ItemError(_msg[MSG_NO.EMAIL_FORMAT_RON].content);
                                    error++;
                                }
                            }
                            if ($(this).val() !== '' && element['type'] === 'date') {
                                if (!IsDate($(this).val())) {
                                    $(this).ItemError(_msg[MSG_NO.DATE_FORMAT_RON].content);
                                    error++;
                                }
                            }
                            if ($(this).val() !== '' && /url/.test(className)) {
                                if (!IsURL($(this).val())) {
                                    $(this).ItemError(_msg[MSG_NO.URL_FORMAT_RON].content);
                                    error++;
                                }
                            }
                            if (/gt/.test(className)) {
                                if (NumberModule.ToNumber($(this).val()) <= NumberModule.ToNumber($(this).attr('gt'))) {
                                    $(this).ItemError(_msg[MSG_NO.VALUE_MUST_GEATER].content.replace('{0}', $(this).attr('gt')));
                                    error++;
                                }
                            }
                            if (/gz/.test(className)) {
                                if (NumberModule.ToNumber($(this).val()) >= NumberModule.ToNumber($(this).attr('gz'))) {
                                    $(this).ItemError(_msg[MSG_NO.VALUE_MUST_LESSER].content.replace('{0}', $(this).attr('gz')));
                                    error++;
                                }
                            }
                        }
                    });
                }
            });
            if (error > 0) {
                FocusFirstError();
                return false;
            } else {
                return true;
            }
        } catch (e) {
            console.log('_validateByObject: ' + e.message);
        }
    };

    var _validateBySelector = function (selector) {
        try {
            var error = 0;
            ClearAllError(selector);
            $(selector).find('.required').each(function () {
                var val = $(this).val() + '';
                if (val === '' || val === '0') {
                    $(this).ItemError(_msg[MSG_NO.REQUIRED].content);
                    error++;
                }
            });
            $(selector).find('input[type=text],input[type=tel],input[type=password],input[type=email],textarea').each(function () {
                var maxlength = $(this).attr('maxlength')
                if (maxlength != undefined && maxlength != null && (maxlength + '' != '')) {
                    var msg_maxlength = '';
                    if (typeof (_msg) != 'undefined' && _msg[MSG_NO.EXCEED_MAXLENGTH] != undefined) {
                        msg_maxlength = _msg[MSG_NO.EXCEED_MAXLENGTH].content.replace('{0}', maxlength);
                    }
                    val = $(this).val() + '';
                    if ($(this).hasClass('money')) {
                        val = val.replace(/,/g, '');
                    }
                    if ($(this).hasClass('date')) {
                        val = val.replace(/\//g, '');
                    }
                    if ($(this).hasClass('time')) {
                        val = val.replace(/:/g, '');
                    }
                    if (val.length > maxlength) {
                        $(this).ItemError(msg_maxlength);
                        error++;
                    }
                }
            });
            $(selector).find('input[type=email],.email').each(function () {
                if (!IsEmail($(this).val())) {
                    $(this).ItemError(_msg[MSG_NO.EMAIL_FORMAT_RON].content);
                    error++;
                }
            });
            $(selector).find('.date').each(function () {
                if (!IsDate($(this).val())) {
                    $(this).ItemError(_msg[MSG_NO.DATE_FORMAT_RON].content);
                    error++;
                }
            });
            $(selector).find('.url').each(function () {
                if (!IsURL($(this).val())) {
                    $(this).ItemError(_msg[MSG_NO.URL_FORMAT_RON].content);
                    error++;
                }
            });
            $(selector).find('.gt').each(function () {
                if (NumberModule.ToNumber($(this).val()) > NumberModule.ToNumber($(this).attr('gt'))) {
                    $(this).ItemError(_msg[MSG_NO.VALUE_MUST_GEATER].content.replace('{0}', $(this).attr('gt')));
                    error++;
                }
            });
            $(selector).find('.gz').each(function () {
                if (NumberModule.ToNumber($(this).val()) > NumberModule.ToNumber($(this).attr('gz'))) {
                    $(this).ItemError(_msg[MSG_NO.VALUE_MUST_LESSER].content.replace('{0}', $(this).attr('gz')));
                    error++;
                }
            });
            if (error > 0) {
                FocusFirstError();
                return false;
            } else {
                return true;
            }
        } catch (e) {
            console.log('_validateBySelector: ' + e.message);
        }
    };

    var Validate = function (obj) {
        try {
            if (typeof obj === 'object') {
                return _validateByObject(obj);
            }
            else {
                return _validateBySelector(obj);
            }
        } catch (e) {
            return false;
            console.log('Validate: ' + e.message);
        }
    };

    var FocusFirstError = function () {
        try {
            $('.' + Notification.STYLE_ERROR + ':first').focus();
        } catch (e) {
            console.log('FocusFirstError: ' + e.message);
        }
    };

    var ClearAllError = function (obj) {
        try {
            if (typeof obj === 'object') {
                $.each(obj, function (key, element) {
                    var selector = '#' + key;
                    if (element['attr']['isClass'] === true) {
                        selector = '.' + key;
                    }
                    $(selector).removeAttr(Notification.TOOLTIP_ATTR);
                    $(selector).removeClass(Notification.STYLE_ERROR);
                });
            }
            else {
                $(obj).find('.' + Notification.STYLE_ERROR).each(function () {
                    $(this).removeAttr(Notification.TOOLTIP_ATTR);
                    $(this).removeClass(Notification.STYLE_ERROR);
                });
            }
            $('#' + Notification.TOOLTIP_ID).remove();
        } catch (e) {
            console.log('ClearAllError' + e.message);
        }
    };
    var FillError = function (errors, firtsSelector) {
        try {
            if (firtsSelector == undefined || firtsSelector == null) {
                firtsSelector = '';
            }
            for (var err in errors) {
                if (errors.hasOwnProperty(err)) {
                    $(firtsSelector + ' [name="' + err + '"]').ItemError(_msg[errors[err]].content);
                }
            }
        } catch (e) {
            console.log('ClearAllError' + e.message);
        }
    }
    return {
        InitEvents: InitEvents,
        IsURL: IsURL,
        IsEmail: IsEmail,
        ValidateTime: ValidateTime,
        ValidateDate: ValidateDate,
        Validate: Validate,
        FocusFirstError: FocusFirstError,
        ClearAllError: ClearAllError,
        FillError: FillError
    };
})();

var Common = (function () {
    var InitEvents = function () {
        $(document).ajaxStart(function () {
            CallLoading();
        });
        $(document).ajaxComplete(function () {
            CloseLoading();
        });
        $(document).on('focus', 'input', function () {
            $(this).select();
        });
    }
    var InitItem = function (obj) {
        try {
            $.each(obj, function (key, element) {
                var selector = '#' + key;
                if (element['attr']['isClass'] === true) {
                    selector = '.' + key;
                }
                if (element['type'] === 'CKEditor' || element['attr']['isCKEditor']) {
                    try {
                        var editor = CKEDITOR.replace(key, {
                            height: element['attr']['height'] ? element['attr']['height'] : 100
                        });
                        if (element['attr']['tabindex'] != undefined) {
                            setTimeout(function () {
                                $('.cke_editor_' + editor.name + ' iframe').attr('tabindex', element['attr']['tabindex']);
                            }, 1000);
                        }
                        editor.on('change', function () {
                            if ($('.cke_editor_' + editor.name).hasClass(Notification.STYLE_ERROR)) {
                                $('.cke_editor_' + editor.name).RemoveError();
                            }
                            $(selector).val(CKEDITOR.instances[key].getData());
                        })
                    } catch (ex) {
                        console.log('InitCkeditor: ' + ex.message);
                    }
                }
                else {
                    // add maxlength
                    if (element['attr']['maxlength'] != undefined) {
                        $(selector).attr('maxlength', element['attr']['maxlength']);
                    }
                    // add class
                    if (element['attr']['class'] != undefined) {
                        $(selector).addClass(element['attr']['class']);
                    }
                    // add decimal
                    if (element['attr']['decimal'] != undefined) {
                        $(selector).attr('decimal', element['attr']['decimal']);
                    }
                    // add read-only
                    if (element['attr']['readonly'] != undefined) {
                        $(selector).attr('readonly', element['attr']['readonly']);
                    }
                    if (element['attr']['disabled'] != undefined) {
                        $(selector).attr('disabled', element['attr']['disabled']);
                    }
                    // add tabindex
                    if (element['attr']['tabindex'] != undefined) {
                        $(selector).attr('tabindex', element['attr']['tabindex']);
                    }
                    // add tabindex
                    if (element['attr']['not-check'] != undefined) {
                        $(selector).attr('not-check', element['attr']['not-check']);
                    }
                    //add name
                    if (!element['attr']['noname']) {
                        if ($(selector).length > 0) {
                            $(selector).attr('name', key);
                        }
                    }
                }
            });
            $('[tabindex="1"]').first().focus();
        } catch (e) {
            console.log('InitItem: ' + e.message);
        }
    };
    var GetData = function (obj) {
        try {
            var data = {};
            $.each(obj, function (key, element) {
                try {
                    if (element['type'] === 'CKEditor' || element['attr']['isCKEditor']) {
                        data[key] = CKEDITOR.instances[key].getData();
                    }
                } catch (ex) {
                    console.log('getDataCkeditor: ' + ex.message);
                }
                var selector = '#' + key;
                if (element['attr']['isClass'] === true) {
                    selector = '.' + key;
                }
                if (element['type'] === 'text' || element['type'] === 'tel' || element['type'] === 'textarea' || element['type'] === 'password' || element['type'] === 'select') {
                    data[key] = $(selector).val();
                }
                if (element['type'] === 'checkbox') {
                    if ($(selector).is(':checked')) {
                        data[key] = true;
                    }
                    else {
                        data[key] = false;
                    }
                }
                if (element['type'] === 'radio') {
                    $('input[name=' + element['attr']['name'] + ']').each(function () {
                        if ($(this).is(':checked')) {
                            data[key] = $(this).val();
                        }
                    });
                }
            });
            return data;
        }
        catch (e) {
            console.log('GetData: ' + e.message);
            return {};
        }
    }
    var CallLoading = function () {
        try {
            var imgLoading = 'data:image/gif;base64,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';
            var htmlLoading = '<div id="call-ajax-fade">' +
                '</div>' +
                '<div id="call-ajax-content">' +
                '<img src="' + imgLoading + '" class="img-loading-ajax" alt="loading" />' +
                '</div>';
            $('body').append(htmlLoading);
            $("#call-ajax-fade").css({
                'position': 'fixed',
                'top': '0px',
                'left': '0px',
                'width': '100%',
                'height': '100%',
                'background': '#fff',
                'opacity': '0.8',
                'z-index': '99999999999999999999'
            });
            $("#call-ajax-content").css({
                'position': 'fixed',
                'top': '0px',
                'left': '0px',
                'width': '100%',
                'height': '100%',
                'background': 'transparent',
                'opacity': '1',
                'z-index': '99999999999999999999'
            });
            $("#call-ajax-content .img-loading-ajax").css({
                'display': 'block',
                'position': 'absolute',
                'top': 'calc(50% - 50px)',
                'left': 'calc(50% - 50px)',
                'width': '100px',
                'height': '100px',
                'opacity': '1'
            });
        } catch (e) {
            console.log('CallLoading: ' + e.message);
        }
    };
    var CloseLoading = function () {
        try {
            $('#call-ajax-fade').remove();
            $('#call-ajax-content').remove();
        } catch (e) {
            console.log('CloseLoading: ' + e.message);
        }
    };
    var GetLastOfUrl = function (url) {
        try {
            var url_arr = url.split('/');
            return url_arr[url_arr.length - 1];
        }
        catch (e) {
            console.log('GetLastOfUrl: ' + e.message);
            return '';
        }
    }
    var Serialize = function (obj) {
        try {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return str.join("&");
        }
        catch (e) {
            console.log('Serialize: ' + e.message);
            return '';
        }
    };
    var ChangeUrl = function (page, url) {
        try {
            if (typeof (history.pushState) != "undefined") {
                var obj = { Page: page, Url: url };
                history.pushState(obj, obj.Page, obj.Url);
            } else {
                console.log("Browser does not support HTML5.");
            }
        }
        catch (e) {
            console.log('ChangeUrl: ' + e.message);
            return '';
        }
    };
    var BackToList = function (key, defaultLink) {
        try {
            if (window.localStorage.getItem(key)) {
                window.location = window.localStorage.getItem(key);
            }
            else {
                window.location = defaultLink;
            }
        }
        catch (e) {
            console.log('BackToList: ' + e.message);
        }
    };
    return {
        InitEvents: InitEvents,
        InitItem: InitItem,
        CallLoading: CallLoading,
        CloseLoading: CloseLoading,
        GetData: GetData,
        GetLastOfUrl: GetLastOfUrl,
        Serialize: Serialize,
        ChangeUrl: ChangeUrl,
        BackToList: BackToList
    };
})();