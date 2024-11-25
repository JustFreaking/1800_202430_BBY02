
console.log("Welcome to joinedevents");

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
            insertjoiningEventsFirestore();
            // displayCardsDynamically("events");
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

// Insert name function using the global variable "currentUser"
function insertjoiningEventsFirestore() {
    currentUser.get().then(userDoc => {
        //get the user name
        var user_joinedEvents = userDoc.data().joiningEvents || [];
        console.log(user_joinedEvents);
        // $("#name-goes-here").text(user_Name); //jquery
        // document.getElementByID("name-goes-here").innetText=user_Name;
    })
}

 
// function displayCardsDynamically(collection) {
//     // let cardTemplate = document.getElementById("eventsCardTemplate"); 
//     db.collection(collection).get()  
//         .then(allEvents => {
//             // var i = 1; 
//             allEvents.forEach(doc => { 
//                 var joiningEvents = doc.data().joiningEvents || [];
//             })
//         })
//         console.log(joiningEvents);
//     }     

    // // Fetch the user's document from the 'users' collection
    // const userRef = firebase.firestore().collection('users').doc(userId);
  
//     currentUser.get().then(doc => {
//       if (doc.exists) {
        
//         var joiningEvents = doc.data().joiningEvents || [];
  
//         // Now fetch the events based on the IDs in joiningEvents array
//         if (joiningEvents.length > 0) {
 
//           fetchEventsByIds(joiningEvents);
//           console.log(joiningEvents);
//         } else {
//           console.log("No events joined yet.");
//         }
//       } else {
//         console.log("User document not found.");
//       }
//     }).catch(error => {
//       console.error("Error getting user document:", error);
//     });

  
//   // Function to fetch event details based on event IDs
//   function fetchEventsByIds(eventIds) {
//     const eventsRef = firebase.firestore().collection('events');
    
//     // Query the 'events' collection to fetch the events by their IDs
//     eventsRef.where(firebase.firestore.FieldPath.documentId(), 'in', eventIds).get()
//       .then(querySnapshot => {
//         if (!querySnapshot.empty) {
//           // Process the events and display them
//           querySnapshot.forEach(doc => {
//             const eventData = doc.data();
//             renderEvent(eventData); // Call a function to render the event on the page
//           });
//         } else {
//           console.log("No events found.");
//         }
//       })
//       .catch(error => {
//         console.error("Error fetching events:", error);
//       });
//   }