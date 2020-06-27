/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var lang = {
    locales: {},
    language: "",
    log: [],
  
    languageData: {
        name: "Neutral",
        nameShort: "Neutral",
        textDirection: "ltr",
        strings: {}
    },
  
    load: function(code, data) {
        if (typeof(data) == "string") {
            lang.locales[code] = JSON.parse(data);
        } else {
            lang.locales[code] = data;
        }
    },
  
    use: function(code) {
        if (code in lang.locales) {
            lang.language = code;
            lang.languageData = lang.locales[code];
        } else {
            if (code == "en_AU" || code == "en_US") {
                lang.use("en_GB");
            } else {
                throw "Cannot use language \"" + code + "\"";
            }
        }
    },
  
    getLocale: function() {
        if (core.getURLParameter("lang") != null) {
            localStorage.setItem("lang", core.getURLParameter("lang"));
        }
  
        if (localStorage.getItem("lang") != null) {
            return localStorage.getItem("lang");
        } else {
            return navigator.language[0] + navigator.language[1] + "_" + (navigator.language[3] + navigator.language[4]).toUpperCase();
        }
    },
  
    addToLog: function(data, result, success = true, date = new Date()) {
        lang.log.push({
            data: data,
            result: result,
            success: success,
            date: date
        });
    },
  
    format: function(data, code, options = {}) {
        if (data instanceof Number) {
            return data.toLocaleString(code.replace(/_/g, "-"), options);
        } else if (data instanceof Date) {
            return data.toLocaleDateString(code.replace(/_/g, "-"), options);
        } else {
            return data;
        }
    },
  
    translate: function(string, arguments = {}, useLocaleFormats = true) {
        if (typeof(arguments) != "object") {
            arguments = [arguments];
        }
  
        if (lang.languageData.strings[string] != undefined) {
            var foundTranslation = null;
  
            if (typeof(lang.languageData.strings[string]) == "object") {
                var rules = lang.languageData.strings[string];
  
                for (var rule in rules) {
                    var originalRule = rule;
  
                    for (var argument in arguments) {
                        if (useLocaleFormats) {
                            rule = rule.replace(new RegExp("\\{" + argument + "\\}", "g"), "`" + String(lang.format(arguments[argument], lang.language)).replace(/`/g, "\\`") + "`");
                        } else {
                            rule = rule.replace(new RegExp("\\{" + argument + "\\}", "g"), "`" + String(arguments[argument]).replace(/`/g, "\\`") + "`");
                        }
  
                        if (eval(rule)) {
                            foundTranslation = rules[originalRule];
                        }
                    }
                }
            } else {
                foundTranslation = lang.languageData.strings[string];
            }
  
            if (foundTranslation != null) {
                for (var i = 0; i < 1000; i++) {
                    foundTranslation = foundTranslation.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
                }
                  
                lang.addToLog(string, foundTranslation);
  
                return foundTranslation;
            } else {
                lang.addToLog(string, null, false);
  
                throw "Could not translate string \"" + string + "\"";
            }
        } else {
            lang.addToLog(string, null, false);
  
            return string;
        }
    }
};
  
function _() {
    return lang.translate(arguments);
}
  
$(function() {
    setInterval(function() {
        $("*:not(script, style, meta, link, .noTranslate)").each(function() {
            if ($(this).html().trim()[0] == "@") {
                if ($(this).html().substring(1).split("|").length == 2) {
                    $(this).html(lang.translate(
                        $(this).html().trim().substring(1).split("|")[0],
                        $(this).html().trim().substring(1).split("|")[1].split("\\")
                    ));
                } else {
                    $(this).html(lang.translate(
                        $(this).html().trim().substring(1).split("|")[0]
                    ));
                }
            }
  
            var thisParent = this;
  
            $.each(this.attributes, function(index, element) {
                if ($(thisParent).attr(element.name)[0] == "@") {
                    if ($(thisParent).attr(element.name).substring(1).split("|").length == 2) {
                        $(thisParent).attr(element.name, lang.translate(
                            $(thisParent).attr(element.name).substring(1).split("|")[0],
                            $(thisParent).attr(element.name).substring(1).split("|")[1].split("\\")
                        ));
                    } else {
                        $(thisParent).attr(element.name, lang.translate(
                            $(thisParent).attr(element.name).substring(1).split("|")[0]
                        ));
                    }
                }
            });
        });
    }, 10);
  
    lang.use(lang.getLocale());
  
    setTimeout(function() {
        $("html").attr("dir", lang.languageData.textDirection);
    });
});
  
function _() {
    return lang.translate(...arguments);
}
  
if (core.getURLParameter("lang") != null) {
    lang.language = core.getURLParameter("lang");
} else {
    if (navigator.languages != undefined) {
        lang.language = navigator.languages[0];
    } else {
        lang.language = navigator.language;
    }
}