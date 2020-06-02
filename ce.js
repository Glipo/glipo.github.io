/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var lastActiveTextArea = null;

function loadContentEditors() {
    $(".contentEditor").html("");

    $(".contentEditor").append([
        $("<div class='toolbar'>").append([
            $("<button>")
                .attr("aria-label", _("Bold"))
                .attr("title", _("Bold"))
                .click(function() {
                    formatContentEditorText("**", "**");
                })
                .append(
                    $("<icon>").text("format_bold")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Italic"))
                .attr("title", _("Italic"))
                .click(function() {
                    formatContentEditorText("_", "_");
                })
                .append(
                    $("<icon>").text("format_italic")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Strikethrough"))
                .attr("title", _("Strikethrough"))
                .click(function() {
                    formatContentEditorText("~~", "~~");
                })
                .append(
                    $("<icon>").text("format_strikethrough")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Link"))
                .attr("title", _("Link"))
                .click(function() {
                    var linkText = lastActiveTextArea.value.substring(
                        lastActiveTextArea.selectionStart,
                        lastActiveTextArea.selectionEnd
                    );

                    $("#ceInsertLinkText").val("");
                    $("#ceInsertLinkUrl").val("");
                    $("#ceInsertLinkError").text("");

                    if (linkText != "") {
                        $("#ceInsertLinkText").val(linkText);

                        $(".ceInsertLinkDialog")[0].showModal();
                        $("#ceInsertLinkUrl").focus();
                    } else {
                        $(".ceInsertLinkDialog")[0].showModal();
                        $("#ceInsertLinkText").focus();
                    }
                })
                .append(
                    $("<icon>").text("link")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Inline code"))
                .attr("title", _("Inline code"))
                .click(function() {
                    formatContentEditorText("`", "`");
                })
                .append(
                    $("<icon>").text("code")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Superscript"))
                .attr("title", _("Superscript"))
                .click(function() {
                    formatContentEditorText("^(", ")");
                })
                .append(
                    $("<icon>").text("keyboard_arrow_up")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Spoiler"))
                .attr("title", _("Spoiler"))
                .click(function() {
                    formatContentEditorText(">!", "!<");
                })
                .append(
                    $("<icon>").text("new_releases")
                )
            ,
            $("<span class='split'>"),
            $("<button>")
                .attr("aria-label", _("Heading"))
                .attr("title", _("Heading"))
                .click(function() {
                    formatContentEditorText("# ");
                })
                .append(
                    $("<icon>").text("title")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Bullet-point list"))
                .attr("title", _("Bullet-point list"))
                .click(function() {
                    formatContentEditorText("- ");
                })
                .append(
                    $("<icon class='flippable'>").text("format_list_bulleted")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Numerical list"))
                .attr("title", _("Numerical list"))
                .click(function() {
                    formatContentEditorText("1. ");
                })
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
                .click(function() {
                    formatContentEditorText(">");
                })
                .append(
                    $("<icon>").text("format_quote")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Code block"))
                .attr("title", _("Code block"))
                .click(function() {
                    formatContentEditorText("```\n", "\n```");
                })
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

function formatContentEditorText(before = "", after = "", replacedText = null) {
    if (lastActiveTextArea != null) {
        var textBefore = lastActiveTextArea.value.substring(
            0,
            lastActiveTextArea.selectionStart
        );
        var textSelected = lastActiveTextArea.value.substring(
            lastActiveTextArea.selectionStart,
            lastActiveTextArea.selectionEnd
        );
        var textAfter = lastActiveTextArea.value.substring(
            lastActiveTextArea.selectionEnd,
            lastActiveTextArea.value.length
        );

        if (replacedText != null) {
            lastActiveTextArea.value = textBefore + before + replacedText + after + textAfter;
        } else {
            lastActiveTextArea.value = textBefore + before + textSelected + after + textAfter;
        }

        lastActiveTextArea.focus();
        lastActiveTextArea.setSelectionRange(textBefore.length + before.length, lastActiveTextArea.value.length - textAfter.length - after.length);
    }
}

function ceInsertLink() {
    if ($("#ceInsertLinkText").val() != "" && $("#ceInsertLinkUrl").val() != "") {
        if ($("#ceInsertLinkUrl").val().startsWith("http://") || $("#ceInsertLinkUrl").val().startsWith("https://")) {
            formatContentEditorText("", "", "[" + $("#ceInsertLinkText").val() + "](" + $("#ceInsertLinkUrl").val() + ")");

            closeDialogs();
        } else {
            $("#ceInsertLinkError").text(_("Make sure that the URL starts with http:// or https:// to insert the link."));
        }
    } else {
        $("#ceInsertLinkError").text(_("Please enter the link text and URL to insert the link."));
    }
}

$(function() {
    loadContentEditors();

    setInterval(function() {
        if (document.activeElement.tagName.toLowerCase() == "textarea") {
            lastActiveTextArea = document.activeElement;
        }
    });

    $("#ceInsertLinkUrl").keypress(function(event) {
        if (event.keyCode == 13) {
            ceInsertLink();
        }
    });
});