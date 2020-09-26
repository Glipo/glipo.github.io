/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var reportContentType = null;
var reportContentGroup = null;
var reportContentPost = null;
var reportContentComment = null;

function reportPost(group, post) {
    reportContentType = "post";
    reportContentGroup = group;
    reportContentPost = post;
    reportContentComment = null;

    $(".reportDescription").text(_("Tell us why you're reporting this post so that we can further investigate the issue."));
    $(".reportGroupRule").html(_("It violates the rules of {0}", [group]));

    $(".reportDialog")[0].showModal();
}

function reportComment(group, post, comment, type) {
    reportContentType = type;
    reportContentGroup = group;
    reportContentPost = post;
    reportContentComment = comment;

    $(".reportDescription").text(_("Tell us why you're reporting this comment so that we can further investigate the issue."));
    $(".reportGroupRule").html(_("It violates the rules of {0}", [group]));

    $(".reportDialog")[0].showModal();
}