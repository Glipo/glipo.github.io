/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
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
    $("main").removeClass("afterHeader");

    if (trimPage(currentPage) == "/") {
        if (core.getURLParameter("q") == null) {
            $(".currentLocation").text(_("Feed"));
        } else {
            $(".currentLocation").text(_("Search results"));
        }
    } else if (trimPage(currentPage).match(/^g\/[^\/]+$/)) {
        $(".currentLocation").text("g/" + trimPage(currentPage.split("/")[1]));

        $("main").addClass("afterHeader");
    } else if (trimPage(currentPage).match(/^g\/[^\/]+\/posts\/[^\/]+$/)) {
        $(".currentLocation").text(_("Viewing post"));
    } else if (trimPage(currentPage).match(/^g\/[^\/]+\/modtools$/)) {
        $(".currentLocation").text(_("Moderator tools"));
    } else if (trimPage(currentPage).match(/^g\/[^\/]+\/modmail$/)) {
        $(".currentLocation").text(_("Message moderators"));
    } else if (currentPage.startsWith("u/")) {
        $(".currentLocation").text("u/" + trimPage(currentPage.split("/")[1]));

        $(".userUsername").text("u/" + trimPage(currentPage.split("/")[1]));
    } else if (trimPage(currentPage) == "banned") {
        $(".currentLocation").text(_("Ban information"));

        if (core.getURLParameter("until") != null) {
            var until = Number(core.getURLParameter("until"));

            var banMessageInterval = setInterval(function() {
                var timeDifference = until - new Date().getTime();

                if (timeDifference > 1000) {
                    $(".banMessage").text(_("You cannot perform this action because you're currently banned from using Glipo. Your ban will be lifted in {0}.", [simpleTimeDifferenceToHumanReadable(timeDifference)]));
                } else {
                    $(".banMessage").text(_("It looks like you're unbanned now. We hope you've learnt your lesson!"));

                    window.location.replace("/");
                    clearInterval(banMessageInterval);
                }
            });
        } else if (core.getURLParameter("forever") == "true") {
            $(".banMessage").text(_("You cannot perform this action because you're permanently banned from using Glipo."));
        } else {
            window.location.replace("/");
        }
    } else if (trimPage(currentPage) == "submit") {
        $(".currentLocation").text(_("Submit post"));
    } else if (trimPage(currentPage) == "notifications") {
        $(".currentLocation").text(_("Notifications"));
    } else if (trimPage(currentPage) == "dm") {
        $(".currentLocation").text(_("Messages"));
    } else if (trimPage(currentPage) == "staff") {
        $(".currentLocation").text(_("Staff area"));
    } else if (trimPage(currentPage) == "creategroup") {
        $(".currentLocation").text(_("Create a group"));
    } else {
        $(".currentLocation").text(_("Error 404"));
        $(".error404").show();
    }

    for (var i = 0; i < $("[data-location]").length; i++) {
        var targetElement = $("[data-location]").eq(i);
        var targetLocation = targetElement.attr("data-location");

        if (new RegExp(targetLocation).test(trimPage(currentPage))) {
            targetElement.show();
        } else {
            targetElement.hide();
        }
    }
});