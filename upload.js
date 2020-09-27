/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

function setUploadAreaFile(context, file, filename) {
    $(context).closest(".upload").find(".none").hide();
    $(context).closest(".upload").find(".uploaded").show();

    if (RE_IMAGE.test(filename)) {
        var fileReader = new FileReader();
        var thisScope = context;

        $(context).closest(".upload").find(".uploaded .info span").text(_("Media selected: {0} ({1} KB)", [
            filename.length > 20 ? filename.substring(0, 20) + _("...") : filename,
            Math.round(file.size / 1000)
        ]));

        fileReader.onload = function() {
            $(thisScope).closest(".upload").find(".uploaded img.result").attr("src", fileReader.result);
        };

        fileReader.readAsDataURL(file);
    }
}

function loadUploadAreas() {
    $(".upload").html("");

    $(".upload").append([
        $("<div class='none'>")
            .on("dragover dragenter", function(event) {
                event.preventDefault();
                event.stopPropagation();
            })
            .on("drop", function(event) {
                event.preventDefault();
                event.stopPropagation();

                setUploadAreaFile(this, event.originalEvent.dataTransfer.files[0], event.originalEvent.dataTransfer.files[0].name);
            })
            .append(
                $("<label>").append([
                    $("<input type='file'>").change(function() {
                        if ($(this).val() != null) {
                            setUploadAreaFile(this, $(this)[0].files[0], $(this).val().split("\\")[$(this).val().split("\\").length - 1]);
                        }
                    }),
                    $("<span>").text(_("Drag and drop or choose a file")),
                    $("<button class='blue'>")
                        .text(_("Choose file"))
                        .click(function() {
                            $(this).closest(".upload").find("input[type='file']").click();
                        })
                ])
            )
        ,
        $("<div class='uploaded'>").append(
            $("<div class='info'>").append(
                $("<span>"),
                $("<button>")
                    .text(_("Cancel"))
                    .click(function() {
                        $(this).closest(".upload").find(".uploaded").hide();
                        $(this).closest(".upload").find(".none").show();

                        $(this).closest(".upload").find(".uploaded img.result").attr("src", null);
                        $(this).closest(".upload").find("input[type='file']").val("").clone(true);
                    })
            ),
            $("<img class='result'>")
        )
    ]);
}

$(function() {
    loadUploadAreas();
})