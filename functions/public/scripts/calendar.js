document.addEventListener('DOMContentLoaded', async function () {
    var calendarEl = document.getElementById('calendar');

    // Initialize Firestore database
    const db = firebase.firestore();

    // Fetch events from Firestore
    async function fetchEvents() {
        const events = [];
        const snapshot = await db.collection('events').get(); // Fetch all events
        snapshot.forEach(doc => {
            const data = doc.data();
            events.push({
                id: doc.id, // Assign the Firestore document ID to the event
                title: data.title, // Event title
                start: data.time, // Event start time (YYYY-MM-DDTHH:MM format)
                description: data.description || 'No description available.', // Optional description
                extendedProps: {
                    owner: data.owner, // Event creator's user ID
                    timestamp: data.timestamp // Original Firestore timestamp
                }
            });
        });
        return events;
    }

    // Fetch user data for joined events
    async function fetchUserJoiningEvents() {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    const userDocRef = db.collection("users").doc(user.uid);
                    try {
                        const userDoc = await userDocRef.get();
                        if (userDoc.exists) {
                            console.log("User document data successfully loaded."); // Debugging
                            resolve(userDoc.data().joiningEvents || []); // Return joiningEvents or an empty array
                        } else {
                            console.warn("No user document found for UID:", user.uid);
                            resolve([]); // No events to filter if document doesn't exist
                        }
                    } catch (error) {
                        console.error("Error fetching user document:", error);
                        reject(error);
                    }
                } else {
                    console.warn("No user is authenticated.");
                    resolve([]); // Return empty if no user is logged in
                }
            });
        });
    }

    // Fetch authenticated user ID
    function getCurrentUserID() {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    resolve(user.uid); // Return the authenticated user's ID
                } else {
                    reject("No user is authenticated.");
                }
            });
        });
    }

    // Fetch data
    const allEvents = await fetchEvents();
    const userJoinedEvents = await fetchUserJoiningEvents();
    const currentUserID = await getCurrentUserID();

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        eventClick: function (info) {
            // Populate modal with event details
            document.getElementById('modalTitle').textContent = info.event.title;
            document.getElementById('modalDescription').textContent = info.event.extendedProps.description;
            document.getElementById('modalOwner').textContent = info.event.extendedProps.owner;

            // Set the link for the "View Event" button
            const eventPageLink = `/html/eachEvent.html?docID=${info.event.extendedProps.docID}`;
            document.getElementById('viewEventButton').href = eventPageLink;

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('eventModal'));
            modal.show();
        }
    });

    // Determine initial radio selection and filter events
    const filterRadio = document.querySelector('input[name="eventFilter"]:checked');
    const filter = filterRadio ? filterRadio.value : 'all';

    let initialEvents;
    if (filter === 'joined') {
        // Filter events to show only joined ones
        initialEvents = allEvents.filter(event => userJoinedEvents.includes(event.id));
    } else if (filter === 'created') {
        // Filter events to show only those created by the current user
        initialEvents = allEvents.filter(event => event.extendedProps.owner === currentUserID);
    } else {
        // Show all events
        initialEvents = allEvents;
    }

    // Add the initial events to the calendar
    calendar.addEventSource(initialEvents);
    calendar.render();

    // Handle filter change
    document.querySelectorAll('input[name="eventFilter"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            const selectedFilter = event.target.value;
            let filteredEvents;

            if (selectedFilter === 'joined') {
                // Filter events to show only joined ones
                filteredEvents = allEvents.filter(event => userJoinedEvents.includes(event.id));
            } else if (selectedFilter === 'created') {
                // Filter events to show only those created by the current user
                filteredEvents = allEvents.filter(event => event.extendedProps.owner === currentUserID);
            } else {
                // Show all events
                filteredEvents = allEvents;
            }

            // Remove current events and add the filtered ones
            calendar.removeAllEvents();
            calendar.addEventSource(filteredEvents);
        });
    });
});
