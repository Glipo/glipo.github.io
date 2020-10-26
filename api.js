/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var api = {
    joinGroup: firebase.functions().httpsCallable("joinGroup"),
    leaveGroup: firebase.functions().httpsCallable("leaveGroup"),
    toggleUpvotePost: firebase.functions().httpsCallable("toggleUpvotePost"),
    toggleDownvotePost: firebase.functions().httpsCallable("toggleDownvotePost"),
    submitPost: firebase.functions().httpsCallable("submitPost"),
    submitCrosspost: firebase.functions().httpsCallable("submitCrosspost"),
    sendMessage: firebase.functions().httpsCallable("sendMessage"),
    approvePost: firebase.functions().httpsCallable("approvePost"),
    removePost: firebase.functions().httpsCallable("removePost"),
    removeComment: firebase.functions().httpsCallable("removeComment"),
    editPost: firebase.functions().httpsCallable("editPost"),
    deletePost: firebase.functions().httpsCallable("deletePost"),
    toggleUpvoteComment: firebase.functions().httpsCallable("toggleUpvoteComment"),
    toggleDownvoteComment: firebase.functions().httpsCallable("toggleDownvoteComment"),
    postComment: firebase.functions().httpsCallable("postComment"),
    replyComment: firebase.functions().httpsCallable("replyComment"),
    editComment: firebase.functions().httpsCallable("editComment"),
    deleteComment: firebase.functions().httpsCallable("deleteComment"),
    createGroup: firebase.functions().httpsCallable("createGroup"),
    reportContent: firebase.functions().httpsCallable("reportContent"),
    dismissReport: firebase.functions().httpsCallable("dismissReport"),
    siteWideBanUser: firebase.functions().httpsCallable("siteWideBanUser"),
    sendModmail: firebase.functions().httpsCallable("sendModmail"),
    archiveModmail: firebase.functions().httpsCallable("archiveModmail"),
    changeMemberPerms: firebase.functions().httpsCallable("changeMemberPerms"),
    submitAppeal: firebase.functions().httpsCallable("submitAppeal"),
    saveSettings: firebase.functions().httpsCallable("saveSettings")
};