var currentUser;

// Function to fetch and display user data
function loadUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Reference the correct user document by using the user's UID
            console.log(user.uid);
            currentUser = db.collection("users").doc(user.uid);

            // Get the document for the current user
            currentUser.get()
                .then(userDoc => {
                    if (userDoc.exists) { // Check if the document exists
                        // Retrieve the data fields of the user
                        let userName = userDoc.data().name || "Name not set";
                        let userCity = userDoc.data().city || "City not set";
                        let userEmail = userDoc.data().email || "Email not set";

                        // Populate the fields in the form
                        document.getElementById("nameInput").value = userName;
                        document.getElementById("cityInput").value = userCity;
                        document.getElementById("emailInput").value = userEmail;
                    } else {
                        console.log("No such document! Please ensure the document exists in Firestore.");
                    }
                })
                .catch(error => {
                    console.log("Error getting user document:", error);
                });
        } else {
            console.log("No user is signed in");
        }
    });
}

function editUserInfo() {
    // Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    const userName = document.getElementById('nameInput').value; // Get the value of the name input field
    const userCity = document.getElementById('cityInput').value; // Get the value of the city input field

    currentUser.update({
        name: userName,
        city: userCity
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch(error => {
            console.error("Error updating document: ", error);
        });

    document.getElementById('personalInfoFields').disabled = true;
}

// Call the function to run it
loadUserInfo();
