function initDocroot(context) {
    if (typeof(Docroot) === 'undefined' || !jQuery.isFunction(Docroot)) {
        return false;
    }

    var common = {
        scrollIndent: 50,
        cssActiveLink: 'active'
    };

    jQuery('.JS-Docroot', context || document).not('.JS-Docroot-ready').each(function() {
        new Docroot(this, jQuery.extend({}, common, GLOBAL.parseData(jQuery(this).data('docroot-params'))));
    });
}

jQuery(function() {
    initDocroot();
});
