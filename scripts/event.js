// // Import Firebase libraries
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, addDoc } from 'firebase/firestore';


// // Handle form submission
// document.getElementById('eventForm').addEventListener('submit', async (e) => {
//     e.preventDefault(); // Prevent the page from reloading on form submit

//     const name = document.getElementById('name').value;
//     const date = document.getElementById('date').value;
//     const location = document.getElementById('location').value;

//     try {
//         // Add the event to Firestore
//         const docRef = await addDoc(collection(db, 'events'), {
//             name: name,
//             date: date,
//             location: location,
//         });

//         // Log the new document reference
//         console.log("Event added with ID: ", docRef.id);

//         // Redirect to main.html or update the page with the new event
//         window.location.href = "main.html"; // Or you could directly update the event list here
//     } catch (e) {
//         console.error("Error adding document: ", e);
//     }
// });
