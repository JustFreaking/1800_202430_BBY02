function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("eventsCardTemplate");

    db.collection(collection).get()
        .then(allEvents => {
            allEvents.forEach(doc => {
                const title = doc.data().title;
                const description = doc.data().description;
                const time = doc.data().time;
                const docID = doc.id;

                let newcard = cardTemplate.content.cloneNode(true);
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = time || "N/A";
                newcard.querySelector('.card-text').innerHTML = description || "No description available.";
                newcard.querySelector('a').href = "eachEvent.html?docID=" + docID;

                document.getElementById(collection + "-go-here").appendChild(newcard);
            });
        })
        .catch(error => console.error("Error fetching events:", error));
}

displayCardsDynamically("events");

// Search functionality
document.getElementById('search-bar').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        queryDatabase(this.value.trim());
    }
});

//Listener for Search button
document.getElementById('search-button').addEventListener('click', function () {
    const searchBar = document.getElementById('search-bar');
    queryDatabase(searchBar.value.trim());
});

//Query based on the text
function queryDatabase(query) {
    const eventsContainer = document.getElementById("events-go-here");
    if (!query) {
        eventsContainer.innerHTML = "";
        displayCardsDynamically("events");
        return;
    }

    console.log("Querying database with:", query);

    eventsContainer.innerHTML = ""; // Clear existing cards

    const queryLower = query.toLowerCase(); // Convert input to lowercase

    // Fetch all events from the Firestore database
    db.collection("events").get()
        .then(snapshot => {
            let matches = 0; // Counter to check if any results match
            snapshot.forEach(doc => {
                const title = doc.data().title || ""; // Ensure field exists
                const description = doc.data().description || "";
                const time = doc.data().time || "N/A";
                const docID = doc.id;

                // Check if the title (case-insensitive) contains the query
                if (title.toLowerCase().includes(queryLower)) {
                    matches++;

                    // Create and display a new card
                    let newcard = document.getElementById("eventsCardTemplate").content.cloneNode(true);
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-length').innerHTML = time;
                    newcard.querySelector('.card-text').innerHTML = description;
                    newcard.querySelector('a').href = "eachEvent.html?docID=" + docID;

                    eventsContainer.appendChild(newcard);
                }
            });

            if (matches === 0) {
                eventsContainer.innerHTML = "<p>No matching events found.</p>";
            }
        })
        .catch(error => console.error("Error fetching events:", error));
}
