

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                let userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("name-goes-here").innerText = userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}
insertNameFromFirestore();

function writeEvents() {
    //define a variable for the collection you want to create in Firestore to populate data
    var eventsRef = db.collection("events");

    eventsRef.add({
        code: "event1",
        name: "Halloween craft makers", //replace with your own event
        city: "Vancouver",
        Address: "Hasting community Center, 201 Hasting Ave, BC, V3K 0C4",
        Kids_age: "2-5",
        details: "A lovely place for kids to make Halloween crafts",
        event_date: "10/29/2024",          //number value
        event_time: "10 am",       //number value
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "event2",
        name: "Circle time at Blue Mountain Park", //replace with your own event
        city: "Coquitlam",
        Address: "Blue Mountain Park, 2187 Kind Edward Ave, Coquitlam, BC, V3H",
        Kids_age: "0-3",
        details: "So much fun for kids",
        event_date: "11/3/2024",      //number value
        event_time: "12 pm",     //number value
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    });
    eventsRef.add({
        code: "event3",
        name: "Playdate for 2-3 years old", //replace with your own city?
        city: "North Vancouver",
        Address: "Lions gate community center, 2188 Lonsdale ave, North Vansouver, BC, P9W 8A1",
        Kids_age: "2-3",
        details: "A great chance for kids to play",
        event_date: "11/20/2024",        //number value
        event_time: "9 am",     //number value
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("eventsCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "hikes"
        .then(allEvents=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allEvents.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().details;  // get value of the "details" key
				var eventCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                var eventDate = doc.data().event_date; //gets the length field
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = eventDate;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/${eventCode}.jpg`; 
                newcard.querySelector('a').href = "eachEvent.html?docID="+docID;
                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("events");  //input param is the name of the collection


document.getElementById('reviewForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get form values
  const userId = document.getElementById('userId').value;
  const eventId = document.getElementById('eventId').value;
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value;

  // Save the review to Firestore
  db.collection('reviews').add({
      userId: userId,
      eventId: eventId,
      rating: rating,
      comment: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp() // Optional: add a timestamp
  })
  .then(() => {
      console.log('Review added successfully!');
      // Optionally reset the form or give feedback to the user
      document.getElementById('reviewForm').reset();
  })
  .catch((error) => {
      console.error('Error adding review: ', error);
  });
});
function fetchReviews() {
  db.collection('reviews').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
      const reviewsList = document.getElementById('reviewsList');
      reviewsList.innerHTML = ''; // Clear existing reviews

      querySnapshot.forEach((doc) => {
          const review = doc.data();
          reviewsList.innerHTML += `
              <div class="review">
                  <p><strong>User ID:</strong> ${review.userId}</p>
                  <p><strong>Event ID:</strong> ${review.eventId}</p>
                  <p><strong>Rating:</strong> ${review.rating}</p>
                  <p><strong>Comment:</strong> ${review.comment}</p>
                  <p><em>Submitted on: ${review.timestamp ? review.timestamp.toDate().toLocaleString() : 'N/A'}</em></p>
                  <hr>
              </div>
          `;
      });
  }).catch((error) => {
      console.error('Error fetching reviews: ', error);
  });
}

// Call fetchReviews when the page loads
window.onload = function() {
  fetchReviews();
};


function navigateToPage() {
    window.location.href = 'event.html';  // Redirect to page2.html
  }