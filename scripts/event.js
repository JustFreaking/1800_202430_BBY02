
function writeEvent() {
    console.log("inside write event");
    let eventTitle = document.getElementById("title").value;
    let eventLocation = document.getElementById("location").value;
    let eventTime = document.getElementById("time").value;
    let eventDescription = document.getElementById("description").value;



    console.log(eventTitle, eventLocation, eventTime, eventDescription);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        // Get the document for the current user.
        db.collection("events").add({
           
            owner: userID,
            title: eventTitle,
            location: eventLocation,
            time: eventTime,
            description: eventDescription,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'event.html';
    }
}
