// Perform Search
function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = ''; // Clear previous results

    db.collection('events')
        .orderBy('timestamp', 'desc') // Order by most recent
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const event = doc.data();
                // Match the query with title, location, or description
                if (
                    event.title.toLowerCase().includes(query) ||
                    event.location.toLowerCase().includes(query) ||
                    event.description.toLowerCase().includes(query)
                ) {
                    displayEvent(event);
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching events: ", error);
        });
}

// Filter Events by Location
function filterEvents() {
    const locationFilter = document.getElementById('filter-category').value.toLowerCase();
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = ''; // Clear previous results

    db.collection('events')
        .orderBy('timestamp', 'desc')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const event = doc.data();
                // Only display events that match the selected location
                if (event.location.toLowerCase() === locationFilter || locationFilter === '') {
                    displayEvent(event);
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching events: ", error);
        });
}

// Display Event Card
function displayEvent(event) {
    const eventsContainer = document.getElementById('events-container');
    const cardHTML = `
        <div class="col">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text"><strong>Location:</strong> ${event.location}</p>
                    <p class="card-text"><strong>Time:</strong> ${event.time}</p>
                    <p class="card-text">${event.description}</p>
                </div>
            </div>
        </div>`;
    eventsContainer.insertAdjacentHTML('beforeend', cardHTML);
}
