


// The user is generated
App.State.myUserDetails = App.Utils.generateUser();

// The room is validated
if (!App.State.docId) {
    alert("The doc parameters were not alright, try to access a new room.");
    window.location.href = 'index.html';
} 
else {
    App.Editor.init();
    App.Network.init();
}