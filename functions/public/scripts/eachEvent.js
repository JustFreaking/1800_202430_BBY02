
// Retrieves event data from Firestore using a document ID from
// the URL and populates HTML elements with the event details. 

function displayEventInfo() {
  let params = new URL(window.location.href); //get URL of search bar
  let ID = params.searchParams.get("docID"); //get value for key "id"
  console.log(ID);

  // doublecheck: is your collection called "Reviews" or "reviews"?
  db.collection("events")
    .doc(ID)
    .get()
    .then(doc => {
      eventName = doc.data().title;
      eventdetails = doc.data().description;
      eventDate = doc.data().time;
      eventAddress = doc.data().address;
      eventCity = doc.data().city;


      // only populate title, and image
      document.getElementById("eventName").innerHTML = eventName;
      // let imgEvent = document.querySelector( ".event-img" );
      // imgEvent.src = "../images/" + eventCode + ".jpg";
      document.getElementById("details-go-here").innerHTML = eventdetails;
      document.getElementById("event_date-go-here").innerHTML = eventDate;
      document.getElementById("City-go-here").innerHTML = eventCity;
      document.getElementById("Address-go-here").innerHTML = eventAddress;


    });
}
displayEventInfo();

function saveEventDocumentIDAndRedirect() {
  let params = new URL(window.location.href) //get the url from the search bar
  let ID = params.searchParams.get("docID");
  localStorage.setItem('EventDocID', ID);
  window.location.href = '/html/review.html';
}