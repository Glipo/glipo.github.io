/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var core = {
    getURLParameter: function(parameter) {
        return decodeURIComponent((new RegExp("[?|&]" + parameter + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null;
    },

    generateKey: function(length = 16, digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_") {
        var key = "";

        for (var i = 0; i < length; i++) {
            key += digits.charAt(Math.floor(Math.random() * digits.length));
        }

        return key;
    }
};

function alert(content, title = _("Information")) {
    $(".alertTitle").text(title);
    $(".alertContent").text(content);

    closeDialogs();
    $(".alertDialog")[0].showModal();
    $(".alertDialog button:last-of-type").focus();
}

$(function() {
    for (var i = 0; i < $("dialog").length; i++) {
        dialogPolyfill.registerDialog($("dialog")[i]);
    }
});