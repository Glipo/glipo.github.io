/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var groupModerators = [];

$(function() {
    if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
        var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                firebase.firestore().collection("groups").doc(groupName).collection("members").doc(currentUser.uid).get().then(function(memberDocument) {
                    if (memberDocument.exists && memberDocument.data().moderator) {
                        $(".isNotModerator").hide();
                        $(".isModerator").show();
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
        $(".isModerator").hide();
        $(".isNotModerator").show();
    }
});