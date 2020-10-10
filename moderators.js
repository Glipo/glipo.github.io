/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var groupModerators = [];

function modRemovePost() {
    if ($("#modRemovePostModReason").val().trim() == "") {
        $("#modRemovePostModError").text(_("Please enter the reason for removing the post."));

        return;
    }

    if ($("#modRemovePostModReason").val().length > 5000) {
        $("#modRemovePostModError").text(_("The reason is too long! Please shorten it so that it's at most 5,000 characters long."));

        return;
    }

    api.removePost({
        group: removedModqueueGroup,
        post: removedModqueuePost,
        reason: $("#modRemovePostModReason").val(),
        forceMod: true
    });

    getModModqueue();
    closeDialogs();
}

function getModModqueue() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    var modqueueReference = firebase.firestore().collection("groups").doc(groupName).collection("posts").where("moderatorApproved", "==", false).where("moderatorRemoved", "==", false).orderBy("posted", "asc");

    if (lastModqueuePost != null) {
        modqueueReference = modqueueReference.startAfter(lastModqueuePost);
    }

    modqueueReference = modqueueReference.limit(10);

    modqueueReference.get().then(function(postDocuments) {
        $("#modModqueue .modqueueItems").html("");

        if (postDocuments.docs.length > 0) {
            postDocuments.forEach(function(postDocument) {
                if (postDocument.exists) {
                    firebase.firestore().collection("users").doc(postDocument.data().author || "__NOUSER").get().then(function(userDocument) {
                        firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
                            var postContent = "";

                            if (postDocument.data().deleted) {
                                api.approvePost({
                                    group: groupName,
                                    post: postDocument.id,
                                    forceMod: true
                                });
                                
                                return;
                            }

                            if (postDocument.data().type == "writeup") {
                                postContent = renderMarkdown(postDocument.data().content);
                            } else if (postDocument.data().type == "link") {
                                postContent = renderLink(postDocument.data().content);
                            }

                            $("#modModqueue .modqueueItems").append(
                                $("<card class='post clickable'>")
                                    .append([
                                        $("<div class='info'>").append([
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
                                                .attr("href", "/g/" + groupName + "/posts/" + postDocument.id)
                                                .attr("target", "_blank")
                                                .text(postDocument.data().title)
                                        ),
                                        $("<div class='postContent'>")
                                            .addClass(postDocument.data().type)
                                            .html(postContent)
                                        ,
                                        $("<div class='actions'>").append([
                                            $("<div class='full'>").append([
                                                $("<button>")
                                                    .attr("aria-label", _("Approve"))
                                                    .append([
                                                        $("<icon>").text("done"),
                                                        document.createTextNode(" "),
                                                        $("<span>").text(_("Approve"))
                                                    ])
                                                    .click(function() {
                                                        api.approvePost({
                                                            group: groupName,
                                                            post: postDocument.id,
                                                            forceMod: true
                                                        });
                                                        $(this).closest("card.post").remove();

                                                        lastModqueuePost = postDocument;

                                                        getModModqueue();
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
                                                        removedModqueueGroup = groupName;
                                                        removedModqueuePost = postDocument.id;
                                                        lastModqueuePost = postDocument;
                                                        
                                                        $("#modRemovePostModReason").val("");
                                                        $("#modRemovePostModError").text("");
                                                        $(".modRemovePostModDialog")[0].showModal();
                                                        $("#modRemovePostModReason").focus();
                                                    })
                                            ])
                                        ])
                                    ])
                                    .click(function(event) {
                                        if (!$(event.target).closest("button, a, spoiler, card.post").is("button, a, .spoiler")) {
                                            window.open("/g/" + groupName + "/posts/" + postDocument.id);
                                        }
                                    })
                            );
                        });
                    });
                }
            });
        } else {
            $("#modModqueue .modqueueItems").append(
                $("<div class='pageMessage middle'>").append([
                    $("<h1>").text(_("No posts to moderate right now!")),
                    $("<p>").text(_("Check back later when the modqueue has posts to review."))
                ])
            );
        }
    });
}

function getModeratorList() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    firebase.firestore().collection("groups").doc(groupName).collection("members").where("moderator", "==", true).get().then(function(moderatorMemberDocuments) {
        $("#moderators .modMemberList").html("");
        $("#moderators .loadingSpinner").hide();

        $("#moderators .modMemberList").hide();
        $("#moderators .modMemberList").show();

        moderatorMemberDocuments.forEach(function(moderatorMemberDocument) {
            firebase.firestore().collection("users").doc(moderatorMemberDocument.id).get().then(function(moderatorDocument) {
                $("#moderators .modMemberList").append(
                    $("<card class='clickable'>")
                        .append([
                            $("<a class='bold'>")
                                .addClass(moderatorDocument.data().staff ? "staffBadge" : "moderatorBadge")
                                .attr("href", "/u/" + moderatorDocument.data().username)
                                .text("u/" + moderatorDocument.data().username)
                        ])
                        .click(function() {
                            window.location.href = "/u/" + moderatorDocument.data().username;
                        })
                );
            });
        });
    });
}

function modVisitGroup() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    window.location.href = "/g/" + groupName;
}

$(function() {
    if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
        var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

        firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
            if (groupDocument.exists) {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        firebase.firestore().collection("groups").doc(groupName).collection("members").doc(currentUser.uid).get().then(function(memberDocument) {
                            if (memberDocument.exists && memberDocument.data().moderator) {
                                $(".isNotModerator").hide();
                                $(".isModerator").show();

                                $("#modModqueue .loadingSpinner").hide();

                                getModModqueue();
                                getModeratorList();
                            } else {
                                $(".isModerator").hide();
                                $(".isNotModerator").show();
                            }
                        });
                    } else {
                        $(".isModerator").hide();
                        $(".isNotModerator").show();
                    }
                });

                firebase.firestore().collection("groups").doc(groupName).collection("members").where("moderator", "==", true).get().then(function(moderatorDocuments) {
                    moderatorDocuments.forEach(function(moderatorDocument) {
                        groupModerators.push(moderatorDocument.id);
                    });
                });
            } else {
                window.location.replace("/404.html");
            }
        });
    } else {
        $(".isModerator").hide();
        $(".isNotModerator").show();
    }
});