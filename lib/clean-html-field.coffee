cheerio = require('cheerio')



_cleanHtml = (raw_html, rules)->
    if typeof(raw_html) != 'string'
        return raw_html
    $ = cheerio.load(raw_html, {
        decodeEntities:false  # иначе будет мусор из &#x41F;&#x440;&#x438;
    })

    for selector, rule of rules
        elements = $(selector)
        if rule == 'remove'
            elements.remove()
            continue
        for r in rule.removeAttr or []
            elements.removeAttr(r)
        for attr, value of rule.replaceAttr or {}
            elements.attr(attr, value)
        for r in rule.removeClass or []
            elements.removeClass(r)
        for className, newClassName of rule.replaceClass or {}
            elements.find('.'+className).removeClass(className)
                .removeClass(newClassName).addClass(newClassName)
    $.html()


cleanHtml = (rawHtml, rules)->
    ###
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
    ###
    if !rawHtml or !rules
        return rawHtml
    if typeof(rawHtml) == 'object'
        for k,v of rawHtml when k!='id'
            rawHtml[k] = _cleanHtml(v, rules)
        return rawHtml

    _cleanHtml(rawHtml, rules)



module.exports = (Model, options)->

    Model.observe 'before save', (ctx, next)->
        ### jshint camelcase: false ###
        if ctx.hookState.$CLEAN_HTML_FIELD
            return next()

        for field in options.fields
            if ctx.isNewInstance
                rawHtml = ctx.instance[field]
                if rawHtml
                    ctx.instance.setAttribute(
                        field,
                        cleanHtml(rawHtml, options.options)
                    )
            else if ctx.data.hasOwnProperty(field)
                rawHtml = ctx.data[field]
                if rawHtml
                    ctx.data[field] = cleanHtml(rawHtml, options.options)

        # loopback может несколько раз запускать один и тот же хук.
        # обрезаем такое поведение до 1 выполнения очистки html.
        ### jshint camelcase: false ###
        ctx.hookState.$CLEAN_HTML_FIELD = true
        next()
