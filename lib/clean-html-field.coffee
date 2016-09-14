# out: clean-html-field.js

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


        processField = (field, fieldOptions)->
            if ctx.isNewInstance
                if ctx.instance[field]
                    ctx.instance.setAttribute(
                        field,
                        cleanHtml(
                            ctx.instance[field],
                            fieldOptions or options.options
                        )
                    )
            else if ctx.data.hasOwnProperty(field)
                if ctx.data[field]
                    ctx.data[field] = cleanHtml(ctx.data[field], fieldOptions or options.options)


        for field in options.fields or []
            processField(field)

        for propertyName, params of Model.definition.properties when params._CleanHtmlField
            if typeof(params._CleanHtmlField) == 'object'
                processField(propertyName, params._CleanHtmlField)
            else
                processField(propertyName)

        # loopback может несколько раз запускать один и тот же хук.
        # обрезаем такое поведение до 1 выполнения очистки html.
        ### jshint camelcase: false ###
        ctx.hookState.$CLEAN_HTML_FIELD = true
        next()
