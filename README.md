loopback-ds-clean-html-field-mixin
=============

[![Coverage Status](https://coveralls.io/repos/github/gerasev-kirill/loopback-ds-clean-html-field-mixin/badge.svg?branch=master)](https://coveralls.io/github/gerasev-kirill/loopback-ds-clean-html-field-mixin?branch=master)


This module is designed for the [Strongloop Loopback](https://github.com/strongloop/loopback) framework.
It provides a mixin that makes it possible to clean model properties as
html from unsafe attributes, invalid classes or other(i.e. sanitizer).
For dom manipulations was used cheerio https://github.com/cheeriojs/cheerio


INSTALL
=============

```bash
npm install --save loopback-ds-clean-html-field-mixin
```

MIXINSOURCES
=============
With [loopback-boot@v2.8.0](https://github.com/strongloop/loopback-boot/)  [mixinSources](https://github.com/strongloop/loopback-boot/pull/131) have been implemented in a way which allows for loading this mixin without changes to the `server.js` file previously required.

Add the `mixins` property to your `server/model-config.json` like the following:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "../node_modules/loopback-ds-clean-html-field-mixin",
      "../common/mixins"
    ]
  }
}
```


CONFIG
=============

To use with your Models add the `mixins` attribute to the definition object of
your model config.

```json
{
    "name": "MyModel",
    "properties": {
        "name": {
            "type": "string"
        },
        "someField": {
            "type": "string"
        },
        "someJsonField": {
            "type": "object"
        }
    },
    "mixins": {
        "CleanHtmlField": {
            "fields": ["name", "someField", "someJsonField"],
            "options": {
                "*": {
                    "removeAttr": ["style"],
                    "removeClass": ["btn-danger"]
                },
                "a": {
                    "replaceAttr": {
                        "rel": ""
                    }
                }
            }
        }
    }
}
```

Rules for sanitize have following format:

```js
{
    "<selector>":{
        "removeAttr": ["<attr1>", "<attr2>", ... "<attrN>"],
        "removeClass": ["<class1>", "<class2>", ... "<classN>"],
        "replaceAttr": {
            "<attr1>": "<newValueOfAttr1>",
            "<attr2>": "<newValueOfAttr2>",
            "<attrN>": "<newValueOfAttrN>"
        }
    },
    "<selector>": "remove" // here you can remove all elements by selector
}
```

Example:
```js
"CleanHtmlField":{
    "options":{
        "a":{
            "replaceAttr":{
                "target": "_blank",
                "rel": "nofollow"
            },
            "removeAttr": ["style"]
        },
        "img":{
            "removeAttr": ["style", "class"]
        },
        ".btn-danger": "remove"
    }
}
```


MORE OPTIONS
=============

You can mark specific fields not only inside `mixins.CleanHtmlField.fields` array but
in properties object through `_CleanHtmlField` field.

In this example we mark the `name` field for CleanHtmlField mixin, also
mark `someField` with custom CleanHtmlField rules.

```json
{
    "name": "MyModel",
    "properties": {
        "name": {
            "type": "string",
            "_CleanHtmlField": true
        },
        "someField": {
            "type": "string",
            "_CleanHtmlField": {
                "p": {
                    "removeAttr": ["align", "style"]
                }
            }
        },
        "someJsonField": {
            "type": "object"
        }
    },
    "mixins": {
        "CleanHtmlField": {
            "fields": ["someJsonField"],
            "options": {
                "*": {
                    "removeAttr": ["style"],
                    "removeClass": ["btn-danger"]
                },
                "a": {
                    "replaceAttr": {
                        "rel": ""
                    }
                }
            }
        }
    }
}
```


TESTING
=============

Run the tests from `test` folder

```bash
  npm test
```
