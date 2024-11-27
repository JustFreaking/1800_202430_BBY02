
function writeEvent() {
    console.log("inside write event");
    let eventTitle = document.getElementById("title").value;
    let eventCity = document.getElementById("city").value;
    let eventAddress = document.getElementById("address").value;
    let eventTime = document.getElementById("time").value;
    let eventDescription = document.getElementById("description").value;



    console.log(eventTitle, eventCity, eventAddress, eventTime, eventDescription);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        // Get the document for the current user.
        db.collection("events").add({
           
            owner: userID,
            title: eventTitle,
            city: eventCity,
            address: eventAddress,
            time: eventTime,
            description: eventDescription,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "/html/thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = '/html/event.html';
    }
}
