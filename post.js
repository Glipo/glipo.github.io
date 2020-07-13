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

                                $(".postContent.fullContent").addClass("link");
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
                            $(".postContent.fullContent").html(postContent);

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

function addComment(parent, commentDocument, depth = 0, isNew = false) {
    var groupName = trimPage(currentPage).match(/^g\/([^\/]+)\/posts\/([^\/]+)$/)[1].toLowerCase();
    var postId = trimPage(currentPage).match(/^g\/([^\/]+)\/posts\/([^\/]+)$/)[2];
    
    firebase.firestore().collection("users").doc(commentDocument.data().author).get().then(function(userDocument) {
        firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(postId).collection(depth == 0 ? "rootComments" : "replyComments").doc(commentDocument.id).collection("upvoters").doc(currentUser.uid || "__NOUSER").get().then(function(upvoterDocument) {
            firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(postId).collection(depth == 0 ? "rootComments" : "replyComments").doc(commentDocument.id).collection("downvoters").doc(currentUser.uid || "__NOUSER").get().then(function(downvoterDocument) {
                var commentElement = $("<div class='comment'>")
                    .attr("data-id", commentDocument.id)
                    .append([
                        $("<div class='info'>").append([
                            (
                                !userDocument.exists ?
                                $("<span>").text(_("Deleted user")) :
                                $("<a class='user'>")
                                    .attr("href", "/u/" + userDocument.data().username)
                                    .text("u/" + userDocument.data().username)
                                    .addClass(userDocument.data().staff ? "staffBadge" : "")
                                    .attr("title", userDocument.data().staff ? _("This user is a staff member of Glipo.") : null)
                            ),
                            $("<span>").text(" · "),
                            $("<span>")
                                .attr("title",
                                    lang.format(commentDocument.data().posted.toDate(), lang.language, {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    }) + " " +
                                    commentDocument.data().posted.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                )
                                .text(timeDifferenceToHumanReadable(new Date().getTime() - commentDocument.data().posted.toDate().getTime()))
                        ]),
                        $("<div class='postContent'>").html(renderMarkdown(commentDocument.data().content)),
                        $("<div class='actions'>").append([
                            $("<div>").append([
                                $("<button class='upvoteButton'>")
                                    .attr("title", _("Upvote"))
                                    .attr("aria-label", _("Upvote - {0}", [commentDocument.data().upvotes]))
                                    .addClass(upvoterDocument.exists ? "yellow" : "")
                                    .append([
                                        $("<icon>").text("arrow_upward"),
                                        document.createTextNode(" "),
                                        $("<span>").text(commentDocument.data().upvotes)
                                    ])
                                    .click(function() {
                                        if (currentUser.uid != null) {
                                            api.toggleUpvoteComment({
                                                group: groupName,
                                                post: postId,
                                                comment: commentDocument.id,
                                                type: depth == 0 ? "root" : "reply"
                                            });

                                            if (!$(this).hasClass("yellow")) {
                                                if ($(this).parent().find(".downvoteButton").hasClass("blue")) {
                                                    if (downvoterDocument.exists) {
                                                        $(this).parent().find(".downvoteButton span").text(commentDocument.data().downvotes - 1);
                                                    } else {
                                                        $(this).parent().find(".downvoteButton span").text(commentDocument.data().downvotes);
                                                    }
                                                }

                                                $(this).parent().find(".downvoteButton").removeClass("blue");
                                                $(this).parent().find(".upvoteButton").addClass("yellow");

                                                if (upvoterDocument.exists) {
                                                    $(this).parent().find(".upvoteButton span").text(commentDocument.data().upvotes);
                                                } else {
                                                    $(this).parent().find(".upvoteButton span").text(commentDocument.data().upvotes + 1);
                                                }
                                            } else {
                                                $(this).parent().find(".upvoteButton").removeClass("yellow");

                                                if (upvoterDocument.exists) {
                                                    $(this).parent().find(".upvoteButton span").text(commentDocument.data().upvotes - 1);
                                                } else {
                                                    $(this).parent().find(".upvoteButton span").text(commentDocument.data().upvotes);
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
                                    .attr("aria-label", _("Downvote - {0}", [commentDocument.data().downvotes]))
                                    .addClass(downvoterDocument.exists ? "blue" : "")
                                    .append([
                                        $("<icon>").text("arrow_downward"),
                                        document.createTextNode(" "),
                                        $("<span>").text(commentDocument.data().downvotes)
                                    ])
                                    .click(function() {
                                        if (currentUser.uid != null) {
                                            api.toggleDownvoteComment({
                                                group: groupName,
                                                post: postId,
                                                comment: commentDocument.id,
                                                type: depth == 0 ? "root" : "reply"
                                            });

                                            if (!$(this).hasClass("blue")) {
                                                if ($(this).parent().find(".upvoteButton").hasClass("yellow")) {
                                                    if (upvoterDocument.exists) {
                                                        $(this).parent().find(".upvoteButton span").text(commentDocument.data().upvotes - 1);
                                                    } else {
                                                        $(this).parent().find(".upvoteButton span").text(commentDocument.data().upvotes);
                                                    }
                                                }

                                                $(this).parent().find(".upvoteButton").removeClass("yellow");
                                                $(this).parent().find(".downvoteButton").addClass("blue");

                                                if (downvoterDocument.exists) {
                                                    $(this).parent().find(".downvoteButton span").text(commentDocument.data().downvotes);
                                                } else {
                                                    $(this).parent().find(".downvoteButton span").text(commentDocument.data().downvotes + 1);
                                                }
                                            } else {
                                                $(this).parent().find(".downvoteButton").removeClass("blue");

                                                if (downvoterDocument.exists) {
                                                    $(this).parent().find(".downvoteButton span").text(commentDocument.data().downvotes - 1);
                                                } else {
                                                    $(this).parent().find(".downvoteButton span").text(commentDocument.data().downvotes);
                                                }
                                            }
                                        } else {
                                            showSignUpDialog();
                                        }
                                    })
                            ]),
                            $("<div>").append([
                                $("<button>")
                                    .attr("aria-label", _("Reply"))
                                    .append([
                                        $("<icon>").text("reply"),
                                        document.createTextNode(" "),
                                        $("<span class='desktop'>").text(_("Reply"))
                                    ])
                                    .click(function() {
                                        if (currentUser.uid != null) {
                                            $(".comment .replyArea").html("");

                                            commentElement.find("> .replyArea").append([
                                                $("<div class='contentEditor'>"),
                                                $("<div class='buttonRow'>").append([
                                                    $("<button class='blue'>")
                                                        .text(_("Send"))
                                                        .click(function() {
                                                            var groupName = trimPage(currentPage).match(/^g\/([^\/]+)\/posts\/([^\/]+)$/)[1].toLowerCase();
                                                            var postId = trimPage(currentPage).match(/^g\/([^\/]+)\/posts\/([^\/]+)$/)[2];
                                                            var commentContent = commentElement.find("> .replyArea textarea").val();

                                                            if (commentContent.trim() == "") {
                                                                $(this).parent().find(".errorMessage").text(_("Please enter the comment you wish to reply with."));

                                                                return;
                                                            }

                                                            if (commentContent.length > 10000) {
                                                                $(this).parent().find(".errorMessage").text(_("Your comment is too long! Please shorten it so it's at most 10,000 characters long. You may want to split your comment up into multiple parts."));

                                                                return;
                                                            }

                                                            $(this).prop("disabled", true);
                                                            $(this).text(_("Sending..."));

                                                            var thisScope = this;

                                                            api.replyComment({
                                                                group: groupName,
                                                                post: postId,
                                                                parent: $(this).closest(".comment").closest(".comment").attr("data-id"),
                                                                parentType: depth == 0 ? "root" : "reply",
                                                                content: commentContent
                                                            }).then(function(commentId) {
                                                                $(thisScope).prop("disabled", false);
                                                                $(thisScope).text(_("Send"));
                                                                commentElement.find("> .replyArea textarea").val("");

                                                                firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(postId).collection("replyComments").doc(commentId.data).get().then(function(newCommentDocument) {
                                                                    addComment(commentElement.find("> .replies"), newCommentDocument, depth + 1, true);
                                                                    $(".comment .replyArea").html("");
                                                                });
                                                            }).catch(function(error) {
                                                                console.error("Glipo backend error:", error);

                                                                $(thisScope).parent().find(".errorMessage").text(_("Sorry, an internal error has occurred."));
                                                                $(thisScope).prop("disabled", false);
                                                                $(thisScope).text(_("Send"));
                                                            });
                                                        })
                                                    ,
                                                    $("<button>")
                                                        .text(_("Cancel"))
                                                        .click(function() {
                                                            $(".comment .replyArea").html("");
                                                        })
                                                ]),
                                                $("<p class='errorMessage'>")
                                            ]);

                                            loadContentEditors();
                                        } else {
                                            showSignUpDialog();
                                        }
                                    })
                                ,
                                document.createTextNode(" "),
                                $("<button>")
                                    .attr("title", _("Report"))
                                    .attr("aria-label", _("Report"))
                                    .append(
                                        $("<icon>").text("flag")
                                    )
                            ])
                        ]),
                        $("<div class='replyArea'>"),
                        $("<div class='replies'>")
                    ])
                ;

                if (core.getURLParameter("np") == "true") {
                    commentElement.find(".upvoteButton, .downvoteButton")
                        .attr("title", _("Votes cannot be cast due to no-participation policies"))
                        .prop("disabled", true)
                    ;
                }
                
                if (isNew) {
                    parent.prepend(commentElement);
                } else {
                    parent.append(commentElement);
                }

                for (var i = 0; i < commentDocument.data().replies.length; i++) {
                    firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(postId).collection("replyComments").doc(commentDocument.data().replies[i]).get().then(function(replyCommentDocument) {
                        addComment(commentElement.find("> .replies"), replyCommentDocument, depth + 1);
                        ceUnsummon();
                    });
                }
            });
        });
    });
}

function getComments(groupName, postId) {
    firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(postId).get().then(function(postDocument) {
        if (postDocument.exists) {
            var commentReference = firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(postId).collection("rootComments");

            if (core.getURLParameter("sort") == "newest") {
                commentReference = commentReference.orderBy("posted", "desc");
            } else {
                commentReference = commentReference.orderBy("upvotes", "desc");
            }

            commentReference.get().then(function(rootCommentDocuments) {
                $(".postComments").html("");

                if (rootCommentDocuments.docs.length > 0) {
                    rootCommentDocuments.forEach(function(rootCommentDocument) {
                        addComment($(".postComments"), rootCommentDocument);
                    });
                } else {
                    $(".postComments").append(
                        $("<p class='middle'>").text(_("It's looking empty here! Be the first to write a comment."))
                    );
                }
            });
        }
    });
}

function writeComment() {
    var groupName = trimPage(currentPage).match(/^g\/([^\/]+)\/posts\/([^\/]+)$/)[1].toLowerCase();
    var postId = trimPage(currentPage).match(/^g\/([^\/]+)\/posts\/([^\/]+)$/)[2];
    var commentContent = $(".writeComment textarea").val();

    if (commentContent.trim() == "") {
        $("#writeCommentError").text(_("Please enter the comment you wish to post."));

        return;
    }

    if (commentContent.length > 10000) {
        $("#writeCommentError").text(_("Your comment is too long! Please shorten it so it's at most 10,000 characters long. You may want to split your comment up into multiple parts."));

        return;
    }

    $("#writeCommentButton").prop("disabled", true);
    $("#writeCommentButton").text(_("Posting..."));

    api.postComment({
        group: groupName,
        post: postId,
        content: commentContent
    }).then(function(commentId) {
        $("#writeCommentButton").prop("disabled", false);
        $("#writeCommentButton").text(_("Post"));
        $(".writeComment textarea").val("");

        firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(postId).collection("rootComments").doc(commentId.data).get().then(function(newCommentDocument) {
            addComment($(".postComments"), newCommentDocument, 0, true);
        });
    }).catch(function(error) {
        console.error("Glipo backend error:", error);

        $("#writeCommentError").text(_("Sorry, an internal error has occurred."));
        $("#writeCommentButton").prop("disabled", false);
        $("#writeCommentButton").text(_("Post"));
    });
}

function visitGroup() {
    var groupName = trimPage(currentPage).match(/^g\/([^\/]+)\/posts\/([^\/]+)$/)[1].toLowerCase();

    window.location.href = "/g/" + groupName.trim();
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
        getComments(groupName, postId);
    }
});