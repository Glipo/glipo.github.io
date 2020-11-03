/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

$(function() {
    var article = core.getURLParameter("article") || "index.md";

    $.ajax({
        url: "/about/articles/" + article,
        error: function() {
            $(".article").html("");
            $(".articleNotFound").show();
        }
    }).done(function(data) {
        var sections = data.split("<!-- section -->");

        $(".article").html("");

        if (article == "index.md") {
            $(".helpHome").show();
        } else {
            $(".articleItem").show();
        }

        for (var i = 0; i < sections.length; i++) {
            $(".article").append($("<section>"));

            var splits = sections[i].split("<!-- split -->");

            for (var j = 0; j < splits.length; j++) {
                $(".article section:last-child").append(
                    $("<div>").html(renderMarkdown(splits[j], false))
                );
            }
        }
    });
});