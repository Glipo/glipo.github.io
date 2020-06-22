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
    submitPost: firebase.functions().httpsCallable("submitPost")
};