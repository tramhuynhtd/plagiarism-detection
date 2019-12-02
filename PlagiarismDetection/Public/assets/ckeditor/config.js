/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
    config.language = 'vi';
    config.htmlEncodeOutput = false;
    config.filebrowserBrowseUrl = '/public/assets/ckfinder/ckfinder.html';
    config.filebrowserImageBrowseUrl = '/public/assets/ckfinder/ckfinder.html?type=Images';
    config.filebrowserFlashBrowseUrl = '/public/assets/ckfinder/ckfinder.html?type=Flash';
    config.filebrowserUploadUrl = '/public/assets/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Files';
    config.filebrowserImageUploadUrl = '/public/assets/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images';
    config.filebrowserFlashUploadUrl = '/public/assets/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Flash';
    config.toolbarGroups = [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        '/',
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
    ];
    config.removeButtons = 'Source,CreateDiv,Iframe,ShowBlocks';
};
