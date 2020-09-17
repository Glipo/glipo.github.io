/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var lastModqueuePost = null;
var removedModqueueGroup = null;
var removedModqueuePost = null;

function staffRemovePost() {
    if ($("#staffRemovePostModReason").val().trim() == "") {
        $("#staffRemovePostModError").text(_("Please enter the reason for removing the post."));

        return;
    }

    if ($("#staffRemovePostModReason").val().length > 5000) {
        $("#staffRemovePostModError").text(_("The reason is too long! Please shorten it so that it's at most 5,000 characters long."));

        return;
    }

    api.removePost({
        group: removedModqueueGroup,
        post: removedModqueuePost,
        reason: $("#staffRemovePostModReason").val()
    });

    getStaffModqueue();
    closeDialogs();
}

function getStaffModqueue() {
    var modqueueReference = firebase.firestore().collection("staffModqueue").orderBy("posted", "asc");

    if (lastModqueuePost != null) {
        modqueueReference = modqueueReference.startAfter(lastModqueuePost).limit(1);
    } else {
        modqueueReference = modqueueReference.limit(10);
    }

    modqueueReference.get().then(function(modqueueDocuments) {
        $("#staffModqueue .modqueueItems").html("");

        if (modqueueDocuments.docs.length > 0) {
            modqueueDocuments.forEach(function(modqueueDocument) {
                firebase.firestore().collection("groups").doc(modqueueDocument.data().group).collection("posts").doc(modqueueDocument.data().post).get().then(function(postDocument) {
                    if (postDocument.exists) {
                        firebase.firestore().collection("users").doc(postDocument.data().author || "__NOUSER").get().then(function(userDocument) {
                            firebase.firestore().collection("groups").doc(modqueueDocument.data().group).get().then(function(groupDocument) {
                                var postContent = "";

                                if (postDocument.data().type == "writeup") {
                                    postContent = renderMarkdown(postDocument.data().content);
                                } else if (postDocument.data().type == "link") {
                                    postContent = renderLink(postDocument.data().content);
                                }

                                $("#staffModqueue .modqueueItems").append(
                                    $("<card class='post clickable'>")
                                        .append([
                                            $("<div class='info'>").append([
                                                $("<a class='group'>")
                                                    .attr("href", "/g/" + groupDocument.data().name)
                                                    .text("g/" + groupDocument.data().name)
                                                ,
                                                $("<span>").text(" · "),
                                                (
                                                    !userDocument.exists ?
                                                    $("<span>").text(_("Posted by a deleted user")) :
                                                    $("<span>").html(_("Posted by {0}", [
                                                        $("<div>").append(
                                                            $("<a>")
                                                                .attr("href", "/u/" + userDocument.data().username)
                                                                .text("u/" + userDocument.data().username)
                                                                .addClass(userDocument.data().staff ? "staffBadge" : "")
                                                                .attr("title", userDocument.data().staff ? _("This user is a staff member of Glipo.") : null)
                                                        ).html()
                                                    ]))
                                                ),
                                                $("<span>").text(" · "),
                                                $("<span>")
                                                    .attr("title",
                                                        lang.format(postDocument.data().posted.toDate(), lang.language, {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric"
                                                        }) + " " +
                                                        postDocument.data().posted.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                                    )
                                                    .text(timeDifferenceToHumanReadable(new Date().getTime() - postDocument.data().posted.toDate().getTime()))
                                            ]),
                                            $("<h2 class='title'>").append(
                                                $("<a>")
                                                    .attr("href", "/g/" + groupDocument.data().name + "/posts/" + postDocument.id)
                                                    .attr("target", "_blank")
                                                    .text(postDocument.data().title)
                                            ),
                                            $("<div class='postContent'>")
                                                .addClass(postDocument.data().type)
                                                .html(postContent)
                                            ,
                                            $("<div class='actions'>").append([
                                                $("<div>").append([
                                                    $("<button>")
                                                        .attr("aria-label", _("Approve"))
                                                        .append([
                                                            $("<icon>").text("done"),
                                                            document.createTextNode(" "),
                                                            $("<span>").text(_("Approve"))
                                                        ])
                                                        .click(function() {
                                                            api.approvePost({
                                                                group: modqueueDocument.data().group,
                                                                post: modqueueDocument.data().post
                                                            });
                                                            $(this).closest("card.post").remove();

                                                            lastModqueuePost = modqueueDocument;

                                                            getStaffModqueue();
                                                        })
                                                    ,
                                                    document.createTextNode(" "),
                                                    $("<button>")
                                                        .attr("aria-label", _("Remove"))
                                                        .append([
                                                            $("<icon>").text("clear"),
                                                            document.createTextNode(" "),
                                                            $("<span>").text(_("Remove"))
                                                        ])
                                                        .click(function() {
                                                            removedModqueueGroup = modqueueDocument.data().group;
                                                            removedModqueuePost = modqueueDocument.data().post;
                                                            lastModqueuePost = modqueueDocument;
                                                            
                                                            $("#staffRemovePostModReason").val("");
                                                            $("#staffRemovePostModError").text("");
                                                            $(".staffRemovePostModDialog")[0].showModal();
                                                            $("#staffRemovePostModReason").focus();
                                                        })
                                                ])
                                            ])
                                        ])
                                        .click(function(event) {
                                            if (!$(event.target).closest("button, a, spoiler, card.post").is("button, a, .spoiler")) {
                                                window.open("/g/" + modqueueDocument.data().group + "/posts/" + modqueueDocument.data().post);
                                            }
                                        })
                                );
                            });
                        });
                    }
                });
            });
        } else {
            $("#staffModqueue .modqueueItems").append(
                $("<div class='pageMessage middle'>").append([
                    $("<h1>").text(_("No posts to moderate right now!")),
                    $("<p>").text(_("Check back later when the modqueue has posts to review."))
                ])
            );
        }
    });
}

function getStaffList() {
    firebase.firestore().collection("users").where("staff", "==", true).get().then(function(staffDocuments) {
        $("#staffMembers .staffMemberList").html("");

        $("#staffMembers .loadingSpinner").hide();
        $("#staffMembers .staffMemberList").show();

        staffDocuments.forEach(function(staffDocument) {
            $("#staffMembers .staffMemberList").append(
                $("<card class='clickable'>")
                    .append([
                        $("<a class='bold staffBadge'>")
                            .attr("href", "/u/" + staffDocument.data().username)
                            .text("u/" + staffDocument.data().username)
                        ,
                        document.createTextNode(" "),
                        $("<span>").text(staffDocument.data().staffTitle)
                    ])
                    .click(function() {
                        window.location.href = "/u/" + staffDocument.data().username;
                    })
            );
        });
    });
}

$(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            firebase.firestore().collection("users").doc(user.uid).get().then(function(userDocument) {
                if (userDocument.data().staff) {
                    $("#staffModqueue .loadingSpinner").hide();
                    $("#staffModqueue .modqueueItems").show();

                    getStaffModqueue();
                    getStaffList();
                }
            });
        }
    });
});