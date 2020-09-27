/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var lastActiveTextArea = null;

function loadContentEditors() {
    $(".contentEditor").html("");

    $(".contentEditor").append([
        $("<div class='toolbar editing'>").append([
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
                .click(function() {
                    $("#ceInsertCheckboxState").prop("checked", false);

                    $(".ceInsertCheckboxDialog")[0].showModal();
                    $("#ceInsertCheckboxState").focus();
                })
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
            $("<button>")
                .attr("aria-label", _("Horizontal rule"))
                .attr("title", _("Horizontal rule"))
                .click(function() {
                    formatContentEditorText("\n\n---\n\n");
                })
                .append(
                    $("<icon>").text("remove")
                )
            ,
            $("<span class='split'>"),
            $("<button>")
                .attr("aria-label", _("Table"))
                .attr("title", _("Table"))
                .click(function() {
                    $("#ceInsertTableColumns").val("3");
                    $("#ceInsertTableRows").val("3");
                    $("#ceInsertTableError").text("");

                    $(".ceInsertTableDialog")[0].showModal();
                    $("#ceInsertTableColumns").focus();
                })
                .append(
                    $("<icon>").text("table_chart")
                )
            ,
            $("<button>")
                .attr("aria-label", _("Media"))
                .attr("title", _("Media"))
                .click(function() {
                    var linkText = lastActiveTextArea.value.substring(
                        lastActiveTextArea.selectionStart,
                        lastActiveTextArea.selectionEnd
                    );

                    $("#ceInsertMediaUrl").val("");
                    $("#ceInsertMediaDescription").val("");
                    $("#ceInsertMediaError").text("");

                    if (linkText != "") {
                        $("#ceInsertMediaUrl").val(linkText);

                        $(".ceInsertMediaDialog")[0].showModal();
                        $("#ceInsertMediaDescription").focus();
                    } else {
                        $(".ceInsertMediaDialog")[0].showModal();
                        $("#ceInsertMediaUrl").focus();
                    }
                })
                .append(
                    $("<icon>").text("perm_media")
                )
            ,
            $("<button class='special floatEnd'>")
                .text(_("Preview"))
                .click(function() {
                    if ($(this).closest(".contentEditor").find("textarea").val().trim() != "") {
                        $(this).closest(".contentEditor").find(".toolbar.editing").hide();
                        $(this).closest(".contentEditor").find(".toolbar.previewing").show();

                        $(this).closest(".contentEditor").find(".preview").html(
                            renderMarkdown($(this).closest(".contentEditor").find("textarea").val())
                        );

                        $(this).closest(".contentEditor").find("textarea").hide();
                        $(this).closest(".contentEditor").find(".preview").show();
                    } else {
                        alert(_("Please enter some content before previewing it."), _("Nothing to preview yet"));
                    }
                })
        ]),
        $("<div class='toolbar previewing'>").append([
            $("<button class='special floatEnd'>")
                .text(_("Edit"))
                .click(function() {
                    $(this).closest(".contentEditor").find(".toolbar.previewing").hide();
                    $(this).closest(".contentEditor").find(".toolbar.editing").show();

                    $(this).closest(".contentEditor").find(".preview").hide();
                    $(this).closest(".contentEditor").find("textarea").show();
                })
        ]),
        $("<textarea>").attr("placeholder", _("Write your thoughts here...")),
        $("<div class='preview postContent fullContent'>")
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

function ceInsertCheckbox() {
    if ($("#ceInsertCheckboxState").is(":checked")) {
        formatContentEditorText("- [x] ");
    } else {
        formatContentEditorText("- [ ] ");
    }

    closeDialogs();
}

function ceInsertTable() {
    var columns = Number($("#ceInsertTableColumns").val());
    var rows = Number($("#ceInsertTableRows").val());
    var textSelected = lastActiveTextArea.value.substring(
        lastActiveTextArea.selectionStart,
        lastActiveTextArea.selectionEnd
    );

    if (
        columns != NaN &&
        columns > 0 &&
        rows != NaN &&
        rows > 0
    ) {
        var rowRender = String("| " + " | ".repeat(columns - 1) + " |\n").repeat(rows)

        formatContentEditorText(
            "| ", " | ".repeat(columns - 1) + " |\n" +
            "|-" + "-".repeat(textSelected.length) + "-|-".repeat(columns - 1) + "-|\n" +
            rowRender.substring(0, rowRender.length - 1)
        );

        closeDialogs();
    } else {
        $("#ceInsertTableError").text(_("Please enter a valid number for both the columns and rows."));
    }
}

function ceInsertMedia() {
    if ($("#ceInsertMediaUrl").val() != "" && $("#ceInsertMediaDescription").val() != "") {
        if ($("#ceInsertMediaUrl").val().startsWith("http://") || $("#ceInsertMediaUrl").val().startsWith("https://")) {
            if (
                RE_IMAGE.test($("#ceInsertMediaUrl").val()) ||
                RE_IMGUR.test($("#ceInsertMediaUrl").val()) ||
                RE_YOUTUBE.test($("#ceInsertMediaUrl").val()) ||
                RE_GIPHY.test($("#ceInsertMediaUrl").val()) ||
                RE_GFYCAT.test($("#ceInsertMediaUrl").val())
            ) {
                formatContentEditorText("", "", "![" + $("#ceInsertMediaDescription").val() + "](" + $("#ceInsertMediaUrl").val() + ")");

                closeDialogs();
            } else {
                $("#ceInsertMediaError").text(_("Sorry, we don't support the media type that you have entered."));
            }
        } else {
            $("#ceInsertMediaError").text(_("Make sure that the URL starts with http:// or https:// to insert the media."));
        }
    } else {
        $("#ceInsertMediaError").text(_("Please enter the media URL and description to insert the media."));
    }
}

function ceSummon() {
    $(".ceSummoner").hide();
    $(".ceUnsummoned").show();

    $(".ceUnsummoned .contentEditor textarea").focus();
}

function ceUnsummon() {
    $(".ceUnsummoned").hide();
    $(".ceSummoner").show();

    $(".ceUnsummoned .contentEditor textarea").val("");
}

$(function() {
    loadContentEditors();

    lastActiveTextArea = $("textarea").length > 0 ? $("textarea")[0] : null;

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

    $("#ceInsertTableRows").keypress(function(event) {
        if (event.keyCode == 13) {
            ceInsertTable();
        }
    });

    $("#ceInsertMediaDescription").keypress(function(event) {
        if (event.keyCode == 13) {
            ceInsertMedia();
        }
    });

    $(".ceUnsummoned").hide();
    $(".ceSummoner").show();
});