
// Retrieves an event name from Firestore using a document ID stored in
// localStorage and dynamically updates the HTML element.
var eventDocID = localStorage.getItem("EventDocID");    // Visible to all functions on this page

function getEventName(id) {
    db.collection("events")
        .doc(id)
        .get()
        .then((thisEvent) => {
            var eventName = thisEvent.data().title;
            document.getElementById("eventName").innerHTML = eventName;  // Update the event name dynamically
        });
}

getEventName(eventDocID);

// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');

// Iterate through each star element
stars.forEach((star, index) => {
    // Add a click event listener to the current star
    star.addEventListener('click', () => {
        // First, reset all stars to empty (unselected) state
        stars.forEach((s) => {
            s.textContent = 'star_border'; // Reset all stars to 'star_border' (empty)
        });

        // Fill in the clicked star and all stars before it
        for (let i = 0; i <= index; i++) {
            document.getElementById(`star${i + 1}`).textContent = 'star'; // Fill selected stars
        }
    });
});

// Attach the submit button event listener directly
function writeReview() {
  console.log("inside write review");
  let eventTitle = document.getElementById("title").value;
 

  // Get the star rating
  // Get all the elements with the class "star" and store them in the 'stars' variable
  const stars = document.querySelectorAll('.star');
  // Initialize a variable 'hikeRating' to keep track of the rating count
  let eventRating = 0;
  // Iterate through each element in the 'stars' NodeList using the forEach method
  stars.forEach((star) => {
      // Check if the text content of the current 'star' element is equal to the string 'star'
      if (star.textContent === 'star') {
          // If the condition is met, increment the 'hikeRating' by 1
          eventRating++;
      }
  });

  console.log(eventTitle, eventRating);
  console.log('Event Doc ID', eventDocID);

  var user = firebase.auth().currentUser;
  if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;

      // Get the document for the current user.
      db.collection("reviews").add({
          eventDocID: eventDocID,
          userID: userID,
          title: eventTitle,
          rating: eventRating, // Include the rating in the review
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
          window.location.href = "/html/thanksReview.html"; // Redirect to the thanks page
      });
  } else {
      console.log("No user is signed in");
      window.location.href = '/html/review.html';
  }
}