(function() {
  var _cleanHtml, cheerio, cleanHtml;

  cheerio = require('cheerio');

  _cleanHtml = function(raw_html, rules) {
    var $, attr, className, elements, i, j, len, len1, newClassName, r, ref, ref1, ref2, ref3, rule, selector, value;
    if (typeof raw_html !== 'string') {
      return raw_html;
    }
    $ = cheerio.load(raw_html, {
      decodeEntities: false
    });
    for (selector in rules) {
      rule = rules[selector];
      elements = $(selector);
      if (rule === 'remove') {
        elements.remove();
        continue;
      }
      ref = rule.removeAttr || [];
      for (i = 0, len = ref.length; i < len; i++) {
        r = ref[i];
        elements.removeAttr(r);
      }
      ref1 = rule.replaceAttr || {};
      for (attr in ref1) {
        value = ref1[attr];
        elements.attr(attr, value);
      }
      ref2 = rule.removeClass || [];
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        r = ref2[j];
        elements.removeClass(r);
      }
      ref3 = rule.replaceClass || {};
      for (className in ref3) {
        newClassName = ref3[className];
        elements.find('.' + className).removeClass(className).removeClass(newClassName).addClass(newClassName);
      }
    }
    return $.html();
  };

  cleanHtml = function(rawHtml, rules) {

    /*
        rules:
        {
            a: {
                removeAttr: ['rel'],
                replaceAttr: {'uic-rel': ''}
            }
            *: {
                removeAttr: ['style']
            }
        }
     */
    var k, v;
    if (!rawHtml || !rules) {
      return rawHtml;
    }
    if (typeof rawHtml === 'object') {
      for (k in rawHtml) {
        v = rawHtml[k];
        if (k !== 'id') {
          rawHtml[k] = _cleanHtml(v, rules);
        }
      }
      return rawHtml;
    }
    return _cleanHtml(rawHtml, rules);
  };

  module.exports = function(Model, options) {
    return Model.observe('before save', function(ctx, next) {

      /* jshint camelcase: false */
      var field, i, len, params, processField, propertyName, ref, ref1;
      if (ctx.hookState.$CLEAN_HTML_FIELD) {
        return next();
      }
      processField = function(field, fieldOptions) {
        if (ctx.isNewInstance) {
          if (ctx.instance[field]) {
            return ctx.instance.setAttribute(field, cleanHtml(ctx.instance[field], fieldOptions || options.options));
          }
        } else if (ctx.data.hasOwnProperty(field)) {
          if (ctx.data[field]) {
            return ctx.data[field] = cleanHtml(ctx.data[field], fieldOptions || options.options);
          }
        }
      };
      ref = options.fields || [];
      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];
        processField(field);
      }
      ref1 = Model.definition.properties;
      for (propertyName in ref1) {
        params = ref1[propertyName];
        if (params._CleanHtmlField) {
          if (typeof params._CleanHtmlField === 'object') {
            processField(propertyName, params._CleanHtmlField);
          } else {
            processField(propertyName);
          }
        }
      }

      /* jshint camelcase: false */
      ctx.hookState.$CLEAN_HTML_FIELD = true;
      return next();
    });
  };

}).call(this);
