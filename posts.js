/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var groupPool = ["glipo", "memes"];
var groupPoolLastPosts = {};
var sortMethod = "popular";
var recurseTimeout = 10;
var recurseTimeoutMessageShown = false;
var postsToLoad = 0;

function renderLink(url) {
    var result = $("<div>");

    if (RE_IMAGE.test(url.split("?")[0].split("#")[0])) {
        if (url.startsWith("https://firebasestorage.googleapis.com/v0/b/glipo-net.appspot.com/o/")) {
            result.append($("<img>")
                .attr("src", url)
                .attr("alt", _("Image from Glipo"))
            );
        } else {
            result.append($("<img>")
                .attr("src", url)
                .attr("alt", _("Image from {0}", [url]))
            );
        }
    } else {
        result.append($("<a>")
            .attr("href", url)
            .attr("target", "_blank")
            .attr("title", _("External link"))
            .text(url.length > 100 ? url.substring(0, 100) + _("...") : url)
        );
    }

    return result.html();
}

function getGroupPosts(groupName, limit = 10, startAfter = null, setGroupPoolAfterwards = false, recurse = 0) {
    var postReference = firebase.firestore().collection("groups").doc(groupName.toLowerCase()).collection("posts");

    if (sortMethod == "best") {
        postReference = postReference.orderBy("upvotes", "desc");
    } else if (sortMethod == "newest") {
        postReference = postReference.orderBy("posted", "desc");
    } else {
        postReference = postReference.orderBy("popularity", "desc");
    }

    if (!!startAfter) {
        postReference = postReference.startAfter(startAfter);
    }

    postReference = postReference.limit(limit);

    postReference.get().then(function(postDocuments) {
        $(".loadingPosts").hide();
        $(".loadedPosts").show();

        if (postDocuments.docs.length == 0) {
            if (recurse > 0) {
                getFeedPosts(recurse);

                recurseTimeout--;
            }
        }

        postsToLoad = postDocuments.docs.length;
        
        postDocuments.forEach(function(postDocument) {
            recurseTimeout = 10;

            firebase.firestore().collection("users").doc(postDocument.data().author).get().then(function(userDocument) {
                firebase.firestore().collection("groups").doc(groupName.toLowerCase()).get().then(function(groupDocument) {
                    firebase.firestore().collection("groups").doc(groupName.toLowerCase()).collection("posts").doc(postDocument.id).collection("upvoters").doc(currentUser.uid || "__NOUSER").get().then(function(upvoterDocument) {
                        firebase.firestore().collection("groups").doc(groupName.toLowerCase()).collection("posts").doc(postDocument.id).collection("downvoters").doc(currentUser.uid || "__NOUSER").get().then(function(downvoterDocument) {
                            var postContent = "";

                            if (!postDocument.data().removed) {
                                if (postDocument.data().type == "writeup") {
                                    postContent = renderMarkdown(postDocument.data().content);
                                } else if (postDocument.data().type == "link") {
                                    postContent = renderLink(postDocument.data().content);
                                }
                                
                                $(".loadedPosts").append(
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
                                                    .attr("href", "/g/" + groupName + "/posts/" + postDocument.id)
                                                    .attr("target", "_blank")
                                                    .text(postDocument.data().title)
                                            ),
                                            $("<div class='postContent'>")
                                                .addClass(postDocument.data().type)
                                                .html(postContent)
                                            ,
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
                                                        .attr("aria-label", _("Comment - {0}", [postDocument.data().comments]))
                                                        .append([
                                                            $("<icon>").text("comment"),
                                                            document.createTextNode(" "),
                                                            $("<span>").text(postDocument.data().comments)
                                                        ])
                                                    ,
                                                    document.createTextNode(" "),
                                                    $("<button>")
                                                        .attr("title", _("Crosspost"))
                                                        .attr("aria-label", _("Crosspost - {0}", [0]))
                                                        .append([
                                                            $("<icon>").text("share"),
                                                            document.createTextNode(" "),
                                                            $("<span>").text(0)
                                                        ])
                                                    ,
                                                    document.createTextNode(" "),
                                                    $("<button>")
                                                        .attr("title", _("Report"))
                                                        .attr("aria-label", _("Report"))
                                                        .append(
                                                            $("<icon>").text("flag")
                                                        )
                                                ])
                                            ])
                                        ])
                                        .click(function(event) {
                                            if (!$(event.target).closest("button, a, spoiler, card.post").is("button, a, .spoiler")) {
                                                window.open("/g/" + groupName + "/posts/" + postDocument.id);
                                            }
                                        })
                                );

                                if (postsToLoad > 0) {
                                    postsToLoad--;
                                }
                            }
                        });
                    });
                });
            });

            if (setGroupPoolAfterwards) {
                groupPoolLastPosts[groupName] = postDocument;

                if (recurse > 0) {
                    getFeedPosts(recurse - 1);
                }
            }
        });
    });
}

function getFeedPosts(limit = 10) {
    if (recurseTimeout > 0) {
        var pickedGroup = groupPool[Math.floor(Math.random() * groupPool.length)];

        getGroupPosts(pickedGroup, 1, groupPoolLastPosts[pickedGroup], true, limit);
    } else if (!recurseTimeoutMessageShown) {
        if (trimPage(currentPage) == "/") {
            $(".loadedPosts").append(
                $("<p class='middle'>").text(_("Looks like you've reached the end of Glipo! Try joining other groups to get more content on your feed."))
            );
        } else {
            $(".loadedPosts").append(
                $("<p class='middle'>").text(_("Looks like you've reached the end of this group's posts! Maybe it's time to make that post you dreamt of..."))
            );
        }

        recurseTimeoutMessageShown = true;
    }
}

function initFeedPosts() {
    $(".loadedPosts").hide();
    $(".loadingPosts").show();

    $(".loadedPosts").html("");

    groupPoolLastPosts = {};
    recurseTimeout = 10;
    recurseTimeoutMessageShown = false;
    postsToLoad = 10;

    getFeedPosts();

    window.onscroll = function() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && postsToLoad == 0) {
            postsToLoad = 1;

            getFeedPosts();
        }
    }
}

function sortPostsBy(sort = "popular") {
    window.location.href = window.location.href.split("?")[0] + "?sort=" + encodeURIComponent(sort);
}

$(function() {
    if (currentPage.startsWith("g/") || trimPage(currentPage) == "/") {
        if (["popular", "best", "newest"].includes(core.getURLParameter("sort"))) {
            sortMethod = core.getURLParameter("sort");
        }

        $(".sort")
            .removeClass("blue")
            .attr("aria-label", null)
        ;

        if (sortMethod == "best") {
            $(".sortBest")
                .addClass("blue")
                .attr("aria-label", _("{0} - Selected", [_("Best")]))
            ;
        } else if (sortMethod == "newest") {
            $(".sortNewest")
                .addClass("blue")
                .attr("aria-label", _("{0} - Selected", [_("Newest")]))
            ;
        } else {
            // Sort by best on a post page, but sort by popular on feeds
            if (trimPage(currentPage).match(/^g\/[^\/]+\/posts\/[^\/]+$/)) {
                $(".sortBest")
                    .addClass("blue")
                    .attr("aria-label", _("{0} - Selected", [_("Best")]))
                ;
            } else {
                $(".sortPopular")
                    .addClass("blue")
                    .attr("aria-label", _("{0} - Selected", [_("Popular")]))
                ;
            }
        }
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (trimPage(currentPage) == "/") {
            if (user) {
                firebase.firestore().collection("users").doc(currentUser.uid).collection("groups").get().then(function(groupReferenceDocuments) {
                    for (var i = 0; i < groupReferenceDocuments.docs.length; i++) {
                        groupPool[i] = groupReferenceDocuments.docs[i].id;
                    }

                    // Remove duplicates

                    var tempGroupPool = [];

                    $.each(groupPool, function(i, element) {
                        if ($.inArray(element, tempGroupPool) == -1) {
                            tempGroupPool.push(element);
                        }
                    });

                    groupPool = tempGroupPool;

                    initFeedPosts();
                });
            } else {
                initFeedPosts();
            }
        } else if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length == 2) {
            var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();
    
            firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
                if (groupDocument.exists) {
                    groupPool = [groupName];

                    initFeedPosts();
                }
            });
        }
    });
});