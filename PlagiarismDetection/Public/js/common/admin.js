/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');
let MAX_SIZE_FILE_IMAGE = 10;
// Sidebar
$(document).ready(function () {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight + 40;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function (ev) {
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function () {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }

            $li.addClass('active');

            $('ul:first', $li).slideDown(function () {
                setContentHeight();
            });
        }
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function () {
        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();

        $('.dataTable').each(function () { $(this).dataTable().fnDraw(); });
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).resize(function () {
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: { preventDefault: true }
        });
    }

    $('#btn-logout').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/logout',
            dataType: 'json',
            data: {},
            success: function (res) {
                if (res.Code == 200) {
                    $.removeCookie("token");
                    window.location = '/';
                } else {
                    Notification.Alert(res.MsgNo);
                }
            }
        });
    });
});
// /Sidebar

// Panel toolbox
$(document).ready(function () {
    $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function () {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
$(document).ready(function () {
    if ($(".progress .progress-bar")[0]) {
        $('.progress .progress-bar').progressbar();
    }
});
// /Progressbar

// Switchery
$(document).ready(function () {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery

// iCheck
$(document).ready(function () {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck


// Accordion
$(document).ready(function () {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
/*if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).on('load', function () {
        NProgress.done();
    });
}*/
$(document).ready(function () {
    // Sự kiện khi click button delete trong bảng
    $(document).on('click', '.btn-delete', function () {
        DeleteRows([$(this).attr('id-del')], this);
    });
    // Sự kiện khi clich button delete các mục đã chọn
    $(document).on('click', '.btn-delete-selected', function () {
        var ids = [];
        // Lấy các id chứa trong các checkbox đã chọn
        $(this).parents('.table-result').find('td.col-checkbox .icheckbox_flat-green.checked .check-item').each(function () {
            ids.push($(this).attr('id-del'));
        });
        DeleteRows(ids, this);
    });
    /*
     * Xóa các dòng đã chọn
     * Author       :   QuyPN - 09/07/2018 - create
     * Param        :   ids - mảng cứa các id sẽ xóa
     * Param        :   button - button được nhấn
     * Output       :   
     */
    function DeleteRows(ids, button) {
        try {
            // Lấy link serve để xóa
            var linkDel = $(button).parents('.table-result').attr('link-del');
            // Hiển thị confirrm
            Notification.Alert(MSG_NO.CONFIRM_DELETE_DATA, function (ok) {
                if (ok) {
                    $.ajax({
                        type: 'POST',
                        url: linkDel,
                        dataType: 'json',
                        data: {
                            ids: ids
                        },
                        success: function (res) {
                            // Nếu xóa thành công
                            if (res.Code == 200) {
                                // Hiển thị thông báo
                                Notification.Alert(MSG_NO.DELETE_DATA_SUCCESS, function (ok) {
                                    if (ok) {
                                        // Xóa dòng chứa button xóa đã click trên giao diện
                                        if ($(button).hasClass('btn-delete')) {
                                            $(button).parents('tr').remove();
                                        }
                                        // Xóa các dòng đã chọn trong bảng trên giao diện
                                        if ($(button).hasClass('btn-delete-selected')) {
                                            $(button).parents('.table-result').find('td.col-checkbox .icheckbox_flat-green.checked').parents('tr').remove();
                                        }
                                        // Load lại table
                                        $('btn-search').trigger('click');
                                    }
                                });
                            } else {
                                // Nếu lỗi thì hiển thị thông báo lỗi
                                Notification.Alert(res.MsgNo, function (ok) { });
                            }
                        }
                    });
                }
            });
        }
        catch (e) {
            console.log('DeleteRows: ' + e.message);
        }
    }
});
// checkbox in table
$(document).ready(function () {
    var lockEvent = false;
    $(document).on('ifChecked', 'table #check-all', function () {
        if (!lockEvent) {
            lockEvent = true;
            $('table .check-item').iCheck('check');
            lockEvent = false;
        }
    });
    $(document).on('ifUnchecked', 'table #check-all', function () {
        if (!lockEvent) {
            lockEvent = true;
            $('table .check-item').iCheck('uncheck');
            lockEvent = false;
        }
    });
    $(document).on('ifChecked', 'table .check-item', function () {
        if (!lockEvent) {
            lockEvent = true;
            $('table #check-all').iCheck($('table .check-item').length == $('table .icheckbox_flat-green.checked .check-item').length + 1 ? 'check' : 'uncheck');
            lockEvent = false;
        }
    });
    $(document).on('ifUnchecked', 'table .check-item', function () {
        if (!lockEvent) {
            lockEvent = true;
            $('table #check-all').iCheck($('table .check-item').length == $('table .icheckbox_flat-green.checked .check-item').length - 1 ? 'check' : 'uncheck');
            lockEvent = false;
        }
    });
});

$(document).on('ready', function () {
    $('.fileImg').on('click', function () {
        var lang = getLang();
        clearErrorItem('#' + $(this).attr('id-view'), _text[lang][msg_err_file[$(this).attr('err-idx')]])
    });
    $('.fileImg').on('change', function (e) {
        CheckFileImg(this, e);
    });
});
/*
 * Tạo tabindex tự động cho các control trong table
 * Author       :   QuyPN - 09/07/2018 - create
 * Param        :   
 * Output       :   
 */
function setTabIndexTable(div) {
    try {
        var max = 0;
        var min = 999999;
        $(div).find('[tabindex]').attr('tabindex', function (a, b) {
            max = Math.max(max, +b);
            min = Math.min(min, +b);
        });
        $('#page-size').attr('tabindex', --min);
        $(div).find('.div-pagination a').each(function () {
            $(this).attr('tabindex', ++max);
        });
        return max;
    }
    catch (e) {
        alert('setTabIndexTable: ' + e.message);
        return 0;
    }
}
/*
 * Tạo tabindex tự động cho các mục của menu
 * Author       :   QuyPN - 09/07/2018 - create
 * Param        :   
 * Output       :   
 */
function setTabIndexMenu() {
    try {
        var max = 0;
        $('[tabindex=0]').each(function () {
            $(this).removeAttr('tabindex');
        })
        $('[tabindex]').attr('tabindex', function (a, b) {
            max = Math.max(max, +b);
        });
        $('#profile-menu a').each(function () {
            $(this).attr('tabindex', ++max);
        });
        $('#menu_toggle').attr('tabindex', ++max);
        $('#sidebar-menu a').each(function () {
            $(this).attr('tabindex', ++max);
        });
        return max;
    }
    catch (e) {
        alert('setTabIndexMenu: ' + e.message);
        return 0;
    }
}

function readImage(file, width_height, idImage, previewImg) {
    try {
        if (previewImg == undefined || previewImg == null) {
            previewImg = true;
        }
        window.URL = window.URL || window.webkitURL;
        var useBlob = false && window.URL; // set to `true` to use Blob instead of Data-URL
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            var image = new Image();
            image.addEventListener("load", function () {
                // set widht, height
                if (width_height !== '') {
                    $('#' + width_height).attr('data-width', image.width);
                    $('#' + width_height).attr('data-height', image.height);
                }
                // preview image
                if (previewImg) {
                    $('#' + idImage).attr('src', image.src);
                } else {
                    $('#' + idImage).attr('src', '');
                }
                if (useBlob) {
                    // Free some memory
                    window.URL.revokeObjectURL(image.src);
                }
            });
            image.src = useBlob ? window.URL.createObjectURL(file) : reader.result;
        });
        reader.readAsDataURL(file);
    } catch (e) {
        console.log('readImage: ' + e.message);
    }
}
function CheckFileImg(btn, e) {
    try {
        var lang = getLang();
        var idx = $(btn).attr('err-idx');
        var idView = $(btn).attr('id-view');
        var typeFiles = $(btn).attr('accept').split(',');
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            $('#' + idView).val('');
            msg_err_file[idx] = MsgNo.ChuaChonFile;
            $('#' + idView).errorStyle(_text[lang][MsgNo.ChuaChonFile]);
            $('#imgPreview' + idx).attr('src', '');
            return;
        }
        var extension = '.' + files[0].name.split('.').pop();
        if (typeFiles.indexOf(extension) == -1) {
            msg_err_file[idx] = MsgNo.FileSaiDinhDang;
            $('#' + idView).errorStyle(_text[lang][MsgNo.FileSaiDinhDang]);
            $('#imgPreview' + idx).attr('src', '');
            $('#' + idView).val(files[0].name);
            return;
        }
        if (files[0].size / 1024 / 1024 > MAX_SIZE_FILE_IMAGE) {
            msg_err_file[idx] = MsgNo.FileQuaDungLuong;
            $('#' + idView).errorStyle(_text[lang][MsgNo.FileQuaDungLuong]);
        }
        else {
            msg_err_file[idx] = 0;
            readImage(files[0], 'size' + idx, 'imgPreview' + idx);
        }
        $('#' + idView).val(files[0].name);
    } catch (e) {
        jMessage(0, function (ok) {
        }, '<b>CheckFile:</b> ' + e.message, 4);
    }
}
function checkRateImg(idx) {
    try {
        var lang = getLang();
        if (msg_err_file[idx] == MsgNo.AnhSaiKichThuoc) {
            msg_err_file[idx] = 0;
        }
        var $size = $('#size' + idx);
        var min_width = parseInt($size.attr('min-of-width'));
        var min_rate = parseFloat($size.attr('min-rate'));
        var max_rate = parseFloat($size.attr('max-rate'));
        if ($size.data('height') != undefined && $size.data('width') != undefined) {
            var width = parseInt($size.attr('data-width'));
            var height = parseInt($size.attr('data-height'));
            var rate = parseFloat(width / height);
            if (!(width >= min_width && rate >= min_rate && rate <= max_rate)) {
                $('#' + $size.attr('id-view')).errorStyle(_text[lang][MsgNo.AnhSaiKichThuoc]);
                msg_err_file[idx] = MsgNo.AnhSaiKichThuoc;
                return false;
            }
        }
        return true;
    }
    catch (e) {
        jMessage(0, function (ok) {
        }, '<b>checkRateImg:</b> ' + e.message, 4);
    }
}
function ValidateFile(idx) {
    try {
        var lang = getLang();
        checkRateImg(idx);
        if (msg_err_file[idx] != 0) {
            $('#' + $('#size' + idx).attr('id-view')).errorStyle(_text[lang][msg_err_file[idx]]);
            return true;
        }
        clearErrorItem('#' + $('#size' + idx).attr('id-view'), _text[lang][msg_err_file[idx]])
        return false;
    }
    catch (e) {
        return true;
        jMessage(0, function (ok) {
        }, '<b>ValidateFile:</b> ' + e.message, 4);
    }
}
function SetDataTrans(selector, data) {
    try {
        for (var item in data) {
            if (data.hasOwnProperty(item)) {
                var selectControl = selector + ' #' + item + '_Trans';
                if ($(selectControl).is('checkbox.js-switch')) {
                    $(selectControl).prop('checked', data[item]);
                }
                else if ($(selectControl).is('textarea.ckeditor')) {
                    try {
                        CKEDITOR.instances[item + "_Trans"].setData(data[item]);
                    } catch (e) { }
                }
                else {
                    $(selectControl).val(data[item]);
                    $(selectControl + '_img').attr('src', data[item])
                }
            }
        }
    }
    catch (e) {
        alert('SetDataTrans: ' + e.message);
    }
}
function getStringWithoutDiacritics(str) {
    var strTemp = str;

    strTemp = strTemp.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    strTemp = strTemp.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    strTemp = strTemp.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    strTemp = strTemp.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    strTemp = strTemp.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    strTemp = strTemp.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    strTemp = strTemp.replace(/đ/g, "d");
    strTemp = strTemp.replace(/[^a-zA-Z0-9---]/g, "-")
    strTemp = strTemp.replace(/----/g, "-");
    strTemp = strTemp.replace(/---/g, "-");
    strTemp = strTemp.replace(/--/g, "-");
    strTemp = strTemp.replace(/--/g, "-");

    return strTemp;
}
