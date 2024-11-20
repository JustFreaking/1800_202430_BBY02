// Firebase Reference
const db = firebase.firestore();

// Perform Search
function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = ''; // Clear previous results

    db.collection('events')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const event = doc.data();
                if (event.name.toLowerCase().includes(query) || event.description.toLowerCase().includes(query)) {
                    displayEvent(event);
                }
            });
        });
}

// Display Event Card
function displayEvent(event) {
    const eventsContainer = document.getElementById('events-container');
    const cardHTML = `
        <div class="col">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text">${event.description}</p>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Category:</strong> ${event.category}</p>
                    <a href="${event.link}" class="btn btn-primary">View Event</a>
                </div>
            </div>
        </div>`;
    eventsContainer.insertAdjacentHTML('beforeend', cardHTML);
}

function populateFilterOptions() {
  const filterDropdown = document.getElementById('filter-category');
  db.collection('events')
      .get()
      .then((querySnapshot) => {
          const locations = new Set();
          querySnapshot.forEach((doc) => {
              const event = doc.data();
              locations.add(event.location); // Collect unique locations
          });
          locations.forEach((location) => {
              const option = document.createElement('option');
              option.value = location.toLowerCase();
              option.textContent = location;
              filterDropdown.appendChild(option);
          });
      });
}
populateFilterOptions();
