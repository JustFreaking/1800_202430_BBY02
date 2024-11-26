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
                const data = doc.data();
                const docID = doc.id;

                // Apply text search
                if (query && !data.title.toLowerCase().includes(queryLower)) return;

                // Apply location filter
                if (currentLocation && currentLocation !== "all" && data.location !== currentLocation) return;

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

            events.forEach(event => {
                let newcard = document.getElementById("eventsCardTemplate").content.cloneNode(true);
                newcard.querySelector('.card-title').innerHTML = event.title;
                newcard.querySelector('.card-length').innerHTML = event.time || "N/A";
                newcard.querySelector('.card-text').innerHTML = event.description || "No description available.";
                newcard.querySelector('a').href = "eachEvent.html?docID=" + event.id;

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
        currentLocation = locationOption === "all" ? null : locationOption;
        const locationButton = document.getElementById("location-filter-button");
        locationButton.textContent = `Location: ${locationOption === "all" ? "All" : locationOption}`;
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
