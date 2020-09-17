/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var api = {
    joinGroup: firebase.functions().httpsCallable("joinGroup"),
    leaveGroup: firebase.functions().httpsCallable("leaveGroup"),
    toggleUpvotePost: firebase.functions().httpsCallable("toggleUpvotePost"),
    toggleDownvotePost: firebase.functions().httpsCallable("toggleDownvotePost"),
    submitPost: firebase.functions().httpsCallable("submitPost"),
    sendMessage: firebase.functions().httpsCallable("sendMessage"),
    approvePost: firebase.functions().httpsCallable("approvePost"),
    removePost: firebase.functions().httpsCallable("removePost"),
    editPost: firebase.functions().httpsCallable("editPost"),
    deletePost: firebase.functions().httpsCallable("deletePost"),
    postComment: firebase.functions().httpsCallable("postComment"),
    replyComment: firebase.functions().httpsCallable("replyComment"),
    toggleUpvoteComment: firebase.functions().httpsCallable("toggleUpvoteComment"),
    toggleDownvoteComment: firebase.functions().httpsCallable("toggleDownvoteComment")
};