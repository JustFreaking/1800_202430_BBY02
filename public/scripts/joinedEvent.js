console.log("Welcome to joinedevents");

//Global variable pointing to the current user's Firestore document
var currentUser;
var user_joinedEvents;
//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

            // the following functions are always called when someone is logged in
            insertNameFromFirestore();
            
            insertjoiningEventsFirestore();
            displayCardsDynamically("events");

           
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();

// Insert name function using the global variable "currentUser"
function insertNameFromFirestore() {
    currentUser.get().then(userDoc => {
        //get the user name
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        $("#name-goes-here").text(user_Name); //jquery
        // document.getElementByID("name-goes-here").innetText=user_Name;
    })
}

// Insert joiningEvents function using the global variable "currentUser" to insert array of joiningevents from firestore. 
function insertjoiningEventsFirestore() {
    currentUser.get().then(userDoc => {
        //get the user name
        user_joinedEvents = userDoc.data().joiningEvents || [];
        console.log(user_joinedEvents);
    })
}

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("eventsCardTemplate"); 
    db.collection(collection)
    .get()  
        .then(allEvents => {
            var i = 1; 
            allEvents.forEach(doc => { 
                const eventId = doc.id;
                if (user_joinedEvents.includes(eventId)){
                var title = doc.data().title;     
                var description = doc.data().description; 
                var time = doc.data().time; 
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); 

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = time;
                newcard.querySelector('.card-text').innerHTML = description;
                newcard.querySelector('a').href = "eachEvent.html?docID=" + docID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique
                newcard.querySelector('i').onclick = () => updateCheckbox(docID);


                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);
                }
            })
        })
    
}

function updateCheckbox(eventDocID) {
    //alert ("inside update bookmark");        //debug
    currentUser.get().then(doc => {
        console.log(doc.data().joiningEvents);   //debug
        currentJoiningEvents = doc.data().joiningEvents;

        if (currentJoiningEvents && currentJoiningEvents.includes(eventDocID)) {
            console.log(eventDocID);
            currentUser.update({
                joiningEvents: firebase.firestore.FieldValue.arrayRemove(eventDocID)
            })
            db.collection("events").doc(eventDocID).update({
                //This method decrements the number of attendants. 
                scores: firebase.firestore.FieldValue.increment(-1)
            })
                .then(function () {
                    console.log("This checkbox is removed for " + currentUser);
                    console.log("Like count successfully decremented for " + eventDocID); 
                    let iconID = "save-" + eventDocID;   //"save-08130843"
                    console.log(iconID);
                    document.getElementById(iconID).innerText = "check_box_outline_blank";
                })
                .then( {

                    })
        } else {
            currentUser.set({
                joiningEvents: firebase.firestore.FieldValue.arrayUnion(eventDocID),
            },
                {
                    merge: true
                })
                db.collection("events").doc(eventDocID).update({
                    //This method increments the number of attendants.
                    scores: firebase.firestore.FieldValue.increment(1)
                })
                .then(function () {
                    console.log("This check box is selected for " + currentUser);
                    console.log("Like count successfully incremented for " + eventDocID); 
                    let iconID = "save-" + eventDocID;   //"save-08130843"
                    console.log(iconID);
                    document.getElementById(iconID).innerText = "check_box";
                })
                
        }
    })
}