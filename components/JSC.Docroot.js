!function(namespace) {
  'use strict';

  function Docroot( elem, params ){
    this.$element = jQuery(elem);
    this.params = params || {};

    this.duration = this.params.duration || 400;
    this.scrollIndent = this.params.scrollIndent || 0;
    this.cssReadyElement = this.params.cssReadyElement || 'JS-Docroot-ready';

    this.__construct();
  };

    Docroot.prototype.__construct = function __construct() {
      this.$window = jQuery(window);

      this.$items = this.$element.find('.JS-Docroot-Item');
      this.$links = this.$element.find('.JS-Docroot-Link');

      this._init();
    };

    Docroot.prototype._init = function _init() {
      var _this = this;

      this.$window.on('hashchange.JS-Docroot', function(event) {
        _this._checkHash.apply(_this, []);
      });

      _this._checkHash();

      this._ready();
    };

    Docroot.prototype._ready = function _ready() {
      this.$element
        .addClass('JS-Docroot-ready')
        .addClass(this.cssReadyElement);
    };

    Docroot.prototype._checkHash = function _checkHash() {
      var hash = window.location.hash,
          $item = jQuery('');

      if (!hash) {
        return;
      }

      hash = hash.slice(1, hash.length);
      $item = this.$items.filter('[data-docroot-id="' + hash + '"]');

      if ($item.length) {
        this._scroll($item);
      }
    };

    Docroot.prototype._scroll = function _scroll($source) {
      var scrollTop = $source.offset().top;

      jQuery('html, body').animate({"scrollTop": scrollTop - this.scrollIndent}, this.duration);
    };

  namespace.Docroot = Docroot;
}(this);
