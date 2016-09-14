var deprecate = require('depd')('loopback-ds-clean-html-field-mixin');
var CleanHtmlField = require('./clean-html-field.js');




module.exports = function mixin(app) {
    'use strict';
    app.loopback.modelBuilder.mixins.define = deprecate.function(app.loopback.modelBuilder.mixins.define,
        'app.modelBuilder.mixins.define: Use mixinSources instead; ' +
        'see ');
    app.loopback.modelBuilder.mixins.define('CleanHtmlField', CleanHtmlField);
};
