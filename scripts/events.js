function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("eventsCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "hikes"
        .then(allEvents => {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allEvents.forEach(doc => { //iterate thru each doc
                var title = doc.data().title;       // get value of the "name" key
                var description = doc.data().description;  // get value of the "details" key
                var time = doc.data().time; //gets the length field
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = time;
                newcard.querySelector('.card-text').innerHTML = description;
                newcard.querySelector('a').href = "eachEvent.html?docID=" + docID;
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

displayCardsDynamically("events");

document.getElementById('search-bar').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevents adding a new line
        queryDatabase(this.value); // Call your query function
    }
});

document.getElementById('search-button').addEventListener('click', function (event) {
    queryDatabase(this.value); // Call your query function
});

function queryDatabase(query) {
    console.log("Querying database with:", query);
    // Add your database query logic here
}


document.addEventListener('DOMContentLoaded', () => {
    const eventTitle = document.getElementById('event-title'); // Get the "Events" element
    const eventsWidth = eventTitle.offsetWidth; // Measure its width
    document.documentElement.style.setProperty('--events-width', `${eventsWidth}px`); // Set CSS variable
});

