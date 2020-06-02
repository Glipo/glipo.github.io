/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

function loadContentEditors() {
    $(".contentEditor").html("");

    $(".contentEditor").append([
        $("<div class='toolbar'>").append([
            $("<button>")
                .attr("aria-label", _("Bold"))
                .attr("title", _("Bold"))
                .append(
                    $("<icon>").text("format_bold")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Italic"))
                .attr("title", _("Italic"))
                .append(
                    $("<icon>").text("format_italic")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Strikethrough"))
                .attr("title", _("Strikethrough"))
                .append(
                    $("<icon>").text("format_strikethrough")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Link"))
                .attr("title", _("Link"))
                .append(
                    $("<icon>").text("link")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Inline code"))
                .attr("title", _("Inline code"))
                .append(
                    $("<icon>").text("code")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Superscript"))
                .attr("title", _("Superscript"))
                .append(
                    $("<icon>").text("keyboard_arrow_up")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Spoiler"))
                .attr("title", _("Spoiler"))
                .append(
                    $("<icon>").text("new_releases")
                )
            ,
            $("<span class='split'>"),
            $("<button>")
                .attr("aria-label", _("Heading"))
                .attr("title", _("Heading"))
                .append(
                    $("<icon>").text("title")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Bullet-point list"))
                .attr("title", _("Bullet-point list"))
                .append(
                    $("<icon class='flippable'>").text("format_list_bulleted")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Numerical list"))
                .attr("title", _("Numerical list"))
                .append(
                    $("<icon>").text(lang.languageData.textDirection == "rtl" ? "format_list_numbered_rtl" : "format_list_numbered")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Checkbox"))
                .attr("title", _("Checkbox"))
                .append(
                    $("<icon>").text("check_box")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Blockquote"))
                .attr("title", _("Blockquote"))
                .append(
                    $("<icon>").text("format_quote")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Code block"))
                .attr("title", _("Code block"))
                .append(
                    $("<icon>").text("description")
                )
            ,
            $("<span class='split'>"),
            $("<button>")
                .attr("aria-label", _("Table"))
                .attr("title", _("Table"))
                .append(
                    $("<icon>").text("table_chart")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Media"))
                .attr("title", _("Media"))
                .append(
                    $("<icon>").text("perm_media")
                )
            ,
            $("<button class='special floatEnd'>").text(_("Preview"))
        ]),
        $("<textarea>").attr("placeholder", _("Write your thoughts here..."))
    ]);
}

$(function() {
    loadContentEditors();
});