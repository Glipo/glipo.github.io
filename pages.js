/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var currentPage = "/";

function trimPage(page) {
    return page.split("?")[0].split("#")[0];
}

if (core.getURLParameter("page") != null) {
    currentPage = core.getURLParameter("page").replace(/^(?:\/\/|[^/]+)*\//, "");

    window.history.replaceState(null, null, currentPage);
}

$(function() {
    if (trimPage(currentPage) == "/") {
        $(".currentLocation").text(_("Feed"));
    } else if (currentPage.startsWith("g/")) {
        $(".currentLocation").text("g/" + trimPage(currentPage.split("/")[1]));
    } else if (currentPage.startsWith("u/")) {
        $(".currentLocation").text("u/" + trimPage(currentPage.split("/")[1]));
    } else if (trimPage(currentPage) == "submit") {
        $(".currentLocation").text("Submit post");
    } else {
        $(".currentLocation").text(_("Error 404"));
        $(".error404").show();
    }

    for (var i = 0; i < $("[data-location]").length; i++) {
        var targetElement = $("[data-location]").eq(i);
        var targetLocation = targetElement.attr("data-location");

        if (new RegExp(targetLocation).test(currentPage)) {
            targetElement.show();
        } else {
            targetElement.hide();
        }
    }
});