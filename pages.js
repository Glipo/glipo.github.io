/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var currentPage = "/";

if (core.getURLParameter("page") != null) {
    currentPage = core.getURLParameter("page").replace(/^(?:\/\/|[^/]+)*\//, "");

    window.history.replaceState(null, null, currentPage);
}

$(function() {
    if (currentPage.split("?")[0] == "/") {
        $(".currentLocation").text("Feed");
    } else if (currentPage.startsWith("g/")) {
        $(".currentLocation").text("g/" + currentPage.split("/")[1].split("?")[0]);
    } else if (currentPage.startsWith("u/")) {
        $(".currentLocation").text("u/" + currentPage.split("/")[1].split("?")[0]);
    }
});