(function() {
  var cheerio, cleanHtml;

  cheerio = require('cheerio');

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
    var $, attr, className, elements, i, j, len, len1, newClassName, r, ref, ref1, ref2, ref3, rule, selector, value;
    if (!rawHtml || !rules) {
      return rawHtml;
    }
    if (typeof rawHtml !== 'string') {
      return rawHtml;
    }
    $ = cheerio.load(rawHtml, {
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

  module.exports = function(Model, options) {
    return Model.observe('before save', function(ctx, next) {

      /* jshint camelcase: false */
      var field, i, len, rawHtml, ref;
      if (ctx.hookState.$CLEAN_HTML_FIELD) {
        return next();
      }
      ref = options.fields;
      for (i = 0, len = ref.length; i < len; i++) {
        field = ref[i];
        if (ctx.isNewInstance) {
          rawHtml = ctx.instance[field];
          if (rawHtml) {
            ctx.instance.setAttribute(field, cleanHtml(rawHtml, options.options));
          }
        } else if (ctx.data.hasOwnProperty(field)) {
          rawHtml = ctx.data[field];
          if (rawHtml) {
            ctx.data[field] = cleanHtml(rawHtml);
          }
        }
      }

      /* jshint camelcase: false */
      ctx.hookState.$CLEAN_HTML_FIELD = true;
      return next();
    });
  };

}).call(this);
