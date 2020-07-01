/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

function getPost(groupName, postId) {
    firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(postId).get().then(function(postDocument) {
        if (postDocument.exists) {
            firebase.firestore().collection("users").doc(postDocument.data().author).get().then(function(userDocument) {
                firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
                    firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(postId).collection("upvoters").doc(currentUser.uid || "__NOUSER").get().then(function(upvoterDocument) {
                        firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(postId).collection("downvoters").doc(currentUser.uid || "__NOUSER").get().then(function(downvoterDocument) {
                            if (postDocument.data().type == "writeup") {
                                postContent = renderMarkdown(postDocument.data().content);
                            } else if (postDocument.data().type == "link") {
                                postContent = renderLink(postDocument.data().content);

                                $(".postContent").addClass("link");
                            }

                            $(".postGroup")
                                .attr("href", "/g/" + groupDocument.data().name)
                                .text("g/" + groupDocument.data().name)
                            ;

                            $(".postGroupHeader").text("g/" + groupDocument.data().name);
                            $(".postGroupDescription").text(groupDocument.data().description);

                            if (userDocument.exists) {
                                $(".postAuthor").html(_("Posted by {0}", [
                                    $("<div>").append(
                                        $("<a>")
                                            .attr("href", "/u/" + userDocument.data().username)
                                            .text("u/" + userDocument.data().username)
                                            .addClass(userDocument.data().staff ? "staffBadge" : "")
                                            .attr("title", userDocument.data().staff ? _("This user is a staff member of Glipo.") : null)
                                    ).html()
                                ]));
                            } else {
                                $(".postAuthor").text(_("Posted by a deleted user"));
                            }

                            $(".postTimestamp")
                                .attr("title",
                                    lang.format(postDocument.data().posted.toDate(), lang.language, {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    }) + " " +
                                    postDocument.data().posted.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                )
                                .text(timeDifferenceToHumanReadable(new Date().getTime() - postDocument.data().posted.toDate().getTime()))
                            ;

                            $(".postTitle").text(postDocument.data().title);
                            $(".postContent").html(postContent);

                            $(".postUpvoteButton").attr("aria-label", _("Upvote - {}", [postDocument.data().upvotes]));
                            $(".postUpvotes").text(postDocument.data().upvotes);

                            if (upvoterDocument.exists) {
                                $(".postUpvoteButton").addClass("yellow");
                            } else {
                                $(".postUpvoteButton").removeClass("yellow");
                            }

                            $(".postUpvoteButton").click(function() {
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
                            });

                            $(".postDownvoteButton").attr("aria-label", _("Downvote - {}", [postDocument.data().downvotes]));
                            $(".postDownvotes").text(postDocument.data().downvotes);

                            if (downvoterDocument.exists) {
                                $(".postDownvoteButton").addClass("blue");
                            } else {
                                $(".postDownvoteButton").removeClass("blue");
                            }

                            $(".postDownvoteButton").click(function() {
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
                            });

                            if (core.getURLParameter("np") == "true") {
                                $(".postUpvoteButton, .postDownvoteButton")
                                .attr("title", _("Votes cannot be cast due to no-participation policies"))
                                .prop("disabled", true)
                                ;
                            }

                            if (postDocument.data().staffRemoved) {
                                $(".postStaffRemoved").show();
                            } else if (postDocument.data().moderatorRemoved) {
                                $(".postModeratorRemoved").show();
                            }

                            $(".loadingPosts").hide();
                            $(".pageNonExistent").hide();
                            $(".loadedPosts").show();
                        });
                    });
                });
            });
        } else {
            $(".loadingPosts").hide();
            $(".loadedPosts").hide();
            $(".pageNonExistent").show();
        }
    });
}

function visitGroup() {

}

$(function() {
    if (trimPage(currentPage).match(/^g\/[^\/]+\/posts\/[^\/]+$/)) {
        var groupName = trimPage(currentPage).match(/^g\/([^\/]+)\/posts\/([^\/]+)$/)[1].toLowerCase();
        var postId = trimPage(currentPage).match(/^g\/([^\/]+)\/posts\/([^\/]+)$/)[2];

        $(".postGroupHeader").text("g/" + groupName.trim());

        $(".loadedPosts").hide();
        $(".pageNonExistent").hide();
        $(".loadingPosts").show();

        getPost(groupName, postId);
    }
});