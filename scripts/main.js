//Global variable pointing to the current user's Firestore document
var currentUser;

//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

            // the following functions are always called when someone is logged in
            insertNameFromFirestore();
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

function writeEvents() {
    //define a variable for the collection you want to create in Firestore to populate data
    var eventsRef = db.collection("events");

    eventsRef.add({
        title: "Halloween craft makers", //replace with your own event
        location: "Hasting community Center, 201 Hasting Ave, BC, V3K 0C4",
        time: "Nov10",
        description: "A lovely place for kids to make Halloween crafts",
        owner: "Parvaneh",          //number value
        participants: "Parvaneh",       //number value
        number: 1,
        reviews: "Nice event",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("eventsCardTemplate"); 
    db.collection(collection).get()  
        .then(allEvents => {
            var i = 1; 
            allEvents.forEach(doc => { 
                var title = doc.data().title;  
                var score = doc.data().scores;   
                var description = doc.data().description; 
                var time = doc.data().time; 
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); 

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = time;
                newcard.querySelector('.card-text').innerHTML = description;
                newcard.querySelector('.card-attend').innerHTML = score;
                // newcard.querySelector('.card-attendants').innerHTML = score;
                newcard.querySelector('a').href = "eachEvent.html?docID=" + docID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique
                newcard.querySelector('i').onclick = () => updateCheckbox(docID);


                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}



function navigateToPage() {
    window.location.href = 'addevent.html';  // Redirect to page2.html
}

// function to navigate to page joinedEvents
function navigateToPagejoined() {
    window.location.href = 'joinedEvents.html';  // Redirect to page2.html
}

//-----------------------------------------------------------------------------------------------
// this function will update the joiningEvents array
//if it is hollow makes it solid (on clicl) and adds the event to users's "joiningEvents" array
// if it is solid, makes it hollow, and removes the event from the users's "joiningEvents" array
//-----------------------------------------------------------------------------------------------

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

