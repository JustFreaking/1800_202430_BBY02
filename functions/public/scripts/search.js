
// Global filter state
let currentSort = "newest";
let currentLocation = null;

// Function to fetch and display filtered and sorted events
function queryDatabase(query = "") {
    const eventsContainer = document.getElementById("events-go-here");
    eventsContainer.innerHTML = ""; // Clear existing cards

    let queryLower = query.toLowerCase();

    db.collection("events").get()
        .then(snapshot => {
            let events = [];

            snapshot.forEach(doc => {
                const data = doc.data(); // Ensure data is defined here
                const docID = doc.id;

                // Apply text search
                if (query && !data.title.toLowerCase().includes(queryLower)) return;

                // Apply location filter
                // Apply location filter
                // Apply location filter with safe checks
                if (
                    currentLocation &&
                    currentLocation !== "all" &&
                    (!data.city || data.city.toLowerCase() !== currentLocation.toLowerCase())
                ) {
                    return;
                }



                events.push({ id: docID, ...data });
            });

            // Apply sorting
            if (currentSort === "newest") {
                events.sort((a, b) => new Date(b.time) - new Date(a.time));
            } else if (currentSort === "oldest") {
                events.sort((a, b) => new Date(a.time) - new Date(b.time));
            } else if (currentSort === "title-asc") {
                events.sort((a, b) => a.title.localeCompare(b.title));
            } else if (currentSort === "title-desc") {
                events.sort((a, b) => b.title.localeCompare(a.title));
            }

            // Display events
            if (events.length === 0) {
                eventsContainer.innerHTML = "<p>No matching events found.</p>";
                return;
            }

            // Function to truncate text to a specific number of words
            function truncateText(text, maxWords) {
                const words = text.split(" ");
                if (words.length > maxWords) {
                    return words.slice(0, maxWords).join(" ") + " ..."; // Add ellipsis for truncated text
                }
                return text; // Return full text if under limit
            }

            // Update card rendering logic
            events.forEach(event => {
                let newcard = document.getElementById("eventsCardTemplate").content.cloneNode(true);

                // Truncate the description to a maximum of 20 words
                const truncatedDescription = truncateText(event.description || "No description available.", 20);

                // Populate card fields
                newcard.querySelector('.card-title').innerHTML = event.title;
                newcard.querySelector('.card-length').innerHTML = event.time || "N/A";
                newcard.querySelector('.card-text').innerHTML = truncatedDescription;
                newcard.querySelector('a').href = "/html/eachEvent.html?docID=" + event.id;

                // Append the card to the container
                eventsContainer.appendChild(newcard);
            });
        })
        .catch(error => console.error("Error fetching events:", error));
}



// Event listeners for dropdown filters
document.getElementById("order-filter").addEventListener("click", (event) => {
    const sortOption = event.target.getAttribute("data-sort");
    if (sortOption) {
        currentSort = sortOption === "all" ? "newest" : sortOption;
        const orderButton = document.getElementById("order-filter-button");
        orderButton.textContent = `Order by: ${sortOption === "all" ? "Newest" : event.target.textContent}`;
        queryDatabase(document.getElementById('search-bar').value.trim());
    }
});

document.getElementById("location-filter").addEventListener("click", (event) => {
    const locationOption = event.target.getAttribute("data-location");
    if (locationOption) {
        // Set the currentLocation to the selected location or null if "all"
        currentLocation = locationOption === "all" ? null : locationOption;

        // Update the button text
        const locationButton = document.getElementById("location-filter-button");
        locationButton.textContent = `Location: ${locationOption === "all" ? "All" : locationOption}`;

        // Re-query the database with the current search term
        queryDatabase(document.getElementById('search-bar').value.trim());
    }
});

// Search bar and button listeners
document.getElementById('search-bar').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        queryDatabase(this.value.trim());
    }
});

document.getElementById('search-button').addEventListener('click', function () {
    const searchBar = document.getElementById('search-bar');
    queryDatabase(searchBar.value.trim());
});

// Initialize the event container with all events on page load
document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            currentUserID = user.uid;

            // Fetch user's joined events
            const userDoc = await db.collection("users").doc(currentUserID).get();
            if (userDoc.exists) {
                userJoinedEvents = userDoc.data().joiningEvents || [];
            }
        }

        // Display all events on page load
        queryDatabase();
    });
});
