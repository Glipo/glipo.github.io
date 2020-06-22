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
        $(".loadedPosts");
        $(".loadedPosts").show();
        
        postDocuments.forEach(function(postDocument) {
            firebase.firestore().collection("users").doc(postDocument.data().author).get().then(function(userDocument) {
                $(".loadedPosts").append(
                    $("<card class='post'>").append([
                        $("<div class='info'>").append([
                            $("<a class='group'>")
                                .attr("href", "/g/" + groupName)
                                .text("g/" + groupName)
                            ,
                            $("<span>").text(" · "),
                            $("<span>").html(_("Posted by {0}", [
                                $("<div>").append(
                                    $("<a>")
                                        .attr("href", "/u/" + userDocument.data().username)
                                        .text("u/" + userDocument.data().username)
                                ).html()
                            ])),
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
                                $("<button>")
                                    .attr("title", _("Upvote"))
                                    .attr("aria-label", _("Upvote - {0}", [postDocument.data().upvotes]))
                                    .append([
                                        $("<icon>").text("arrow_upward"),
                                        document.createTextNode(" "),
                                        $("<span>").text(postDocument.data().upvotes)
                                    ])
                                ,
                                document.createTextNode(" "),
                                $("<button>")
                                    .attr("title", _("Downvote"))
                                    .attr("aria-label", _("Downvote - {0}", [postDocument.data().downvotes]))
                                    .append([
                                        $("<icon>").text("arrow_downward"),
                                        document.createTextNode(" "),
                                        $("<span>").text(postDocument.data().downvotes)
                                    ])
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

        // <card class="post">
        //     <div class="info">
        //         <a href="/g/technology" class="group">g/technology</a>
        //         <span>·</span>
        //         <span>Posted by u/James</span>
        //         <span>·</span>
        //         <span>2 hours ago</span>
        //     </div>
        //     <h2 class="title"><a href="/g/technology/posts/123">This is a test post</a></h2>
        //     <p>This is a test post</p>
        //     <div class="actions">
        //         <div>
        //             <button title="@Upvote" aria-label="@Upvote - 1083" class="yellow"><icon>arrow_upward</icon> <span>1083</span></button>
        //             <button title="@Downvote" aria-label="@Downvote - 7"><icon>arrow_downward</icon> <span>7</span></button>
        //         </div>
        //         <div class="desktop">
        //             <button title="@Comment" aria-label="@Comment - 15"><icon>comment</icon> <span>15</span></button>
        //             <button title="@Crosspost" aria-label="@Crosspost - 3"><icon>share</icon> <span>3</span></button>
        //             <button title="@Report" aria-label="@Report this post"><icon>flag</icon></button>
        //         </div>
        //     </div>
        // </card>
    });
}

$(function() {
    if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
        var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

        firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
            if (groupDocument.exists) {
                getGroupPosts(groupDocument.data().name);
            }
        });
    }
});