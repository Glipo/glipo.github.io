/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var posts = {};
var sortMethod = "popular";

function getGroupPosts(groupName) {
    var postReference = firebase.firestore().collection("groups").doc(groupName.toLowerCase()).collection("posts");

    postReference.orderBy("popularity", "desc");
    postReference.limit(10);

    postReference.get().then(function(postDocuments) {
        $(".loadingPosts").hide();
        $(".loadedPosts").show();
        
        postDocuments.forEach(function(postDocument) {
            firebase.firestore().collection("users").doc(postDocument.data().author).get().then(function(userDocument) {
                firebase.firestore().collection("groups").doc(groupName.toLowerCase()).collection("posts").doc(postDocument.id).collection("upvoters").doc(currentUser.uid || "__NOUSER").get().then(function(upvoterDocument) {
                    firebase.firestore().collection("groups").doc(groupName.toLowerCase()).collection("posts").doc(postDocument.id).collection("downvoters").doc(currentUser.uid || "__NOUSER").get().then(function(downvoterDocument) {
                        $(".loadedPosts").append(
                            $("<card class='post'>").append([
                                $("<div class='info'>").append([
                                    $("<a class='group'>")
                                        .attr("href", "/g/" + groupName)
                                        .text("g/" + groupName)
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
                                $("<div>").html(renderMarkdown(postDocument.data().content)),
                                $("<div class='actions'>").append([
                                    $("<div>").append([
                                        $("<button class='upvoteButton'>")
                                            .attr("title", _("Upvote"))
                                            .attr("aria-label", _("Upvote - {0}", [postDocument.data().upvotes]))
                                            .addClass(upvoterDocument.exists ? "yellow" : "")
                                            .append([
                                                $("<icon>").text("arrow_upward"),
                                                document.createTextNode(" "),
                                                $("<span>").text(postDocument.data().upvotes)
                                            ])
                                            .click(function() {
                                                if (currentUser.uid != null) {
                                                    api.toggleUpvotePost({
                                                        group: groupName,
                                                        post: postDocument.id
                                                    });

                                                    if (!$(this).hasClass("yellow")) {
                                                        if ($(this).parent().find(".downvoteButton").hasClass("blue")) {
                                                            if (downvoterDocument.exists) {
                                                                $(this).parent().find(".downvoteButton span").text(postDocument.data().downvotes - 1);
                                                            } else {
                                                                $(this).parent().find(".downvoteButton span").text(postDocument.data().downvotes);
                                                            }
                                                        }

                                                        $(this).parent().find(".downvoteButton").removeClass("blue");
                                                        $(this).parent().find(".upvoteButton").addClass("yellow");
        
                                                        if (upvoterDocument.exists) {
                                                            $(this).parent().find(".upvoteButton span").text(postDocument.data().upvotes);
                                                        } else {
                                                            $(this).parent().find(".upvoteButton span").text(postDocument.data().upvotes + 1);
                                                        }
                                                    } else {
                                                        $(this).parent().find(".upvoteButton").removeClass("yellow");
        
                                                        if (upvoterDocument.exists) {
                                                            $(this).parent().find(".upvoteButton span").text(postDocument.data().upvotes - 1);
                                                        } else {
                                                            $(this).parent().find(".upvoteButton span").text(postDocument.data().upvotes);
                                                        }
                                                    }
                                                } else {
                                                    showSignUpDialog();
                                                }
                                            })
                                        ,
                                        document.createTextNode(" "),
                                        $("<button class='downvoteButton'>")
                                            .attr("title", _("Downvote"))
                                            .attr("aria-label", _("Downvote - {0}", [postDocument.data().downvotes]))
                                            .addClass(downvoterDocument.exists ? "blue" : "")
                                            .append([
                                                $("<icon>").text("arrow_downward"),
                                                document.createTextNode(" "),
                                                $("<span>").text(postDocument.data().downvotes)
                                            ])
                                            .click(function() {
                                                if (currentUser.uid != null) {
                                                    api.toggleDownvotePost({
                                                        group: groupName,
                                                        post: postDocument.id
                                                    });

                                                    if (!$(this).hasClass("blue")) {
                                                        if ($(this).parent().find(".upvoteButton").hasClass("yellow")) {
                                                            if (upvoterDocument.exists) {
                                                                $(this).parent().find(".upvoteButton span").text(postDocument.data().upvotes - 1);
                                                            } else {
                                                                $(this).parent().find(".upvoteButton span").text(postDocument.data().upvotes);
                                                            }
                                                        }

                                                        $(this).parent().find(".upvoteButton").removeClass("yellow");
                                                        $(this).parent().find(".downvoteButton").addClass("blue");
        
                                                        if (downvoterDocument.exists) {
                                                            $(this).parent().find(".downvoteButton span").text(postDocument.data().downvotes);
                                                        } else {
                                                            $(this).parent().find(".downvoteButton span").text(postDocument.data().downvotes + 1);
                                                        }
                                                    } else {
                                                        $(this).parent().find(".downvoteButton").removeClass("blue");
        
                                                        if (downvoterDocument.exists) {
                                                            $(this).parent().find(".downvoteButton span").text(postDocument.data().downvotes - 1);
                                                        } else {
                                                            $(this).parent().find(".downvoteButton span").text(postDocument.data().downvotes);
                                                        }
                                                    }
                                                } else {
                                                    showSignUpDialog();
                                                }
                                            })
                                    ]),
                                    $("<div class='desktop'>").append([
                                        $("<button>")
                                            .attr("title", _("Comment"))
                                            .attr("aria-label", _("Comment - {0}"))
                                            .append([
                                                $("<icon>").text("comment"),
                                                document.createTextNode(" "),
                                                $("<span>").text(0)
                                            ])
                                        ,
                                        document.createTextNode(" "),
                                        $("<button>")
                                            .attr("title", _("Crosspost"))
                                            .attr("aria-label", _("Crosspost - {0}"))
                                            .append([
                                                $("<icon>").text("share"),
                                                document.createTextNode(" "),
                                                $("<span>").text(0)
                                            ])
                                        ,
                                        document.createTextNode(" "),
                                        $("<button>")
                                            .attr("title", _("Report"))
                                            .attr("aria-label", _("Report this post"))
                                            .append(
                                                $("<icon>").text("flag")
                                            )
                                    ])
                                ])
                            ])
                        );
                    });
                });
            });
        });
    });
}

$(function() {
    firebase.auth().onAuthStateChanged(function() {
        if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
            var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();
    
            firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
                if (groupDocument.exists) {
                    $(".loadedPosts").hide();
                    $(".loadingPosts").show();

                    $(".loadedPosts").html("");

                    getGroupPosts(groupDocument.data().name);
                }
            });
        }
    });
});