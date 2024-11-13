var currentUser;

// Function to fetch and display user data
function loadUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            // Reference the correct user document by using the user's UID
            currentUser = db.collection("users").doc(user.uid);

            // Get the document for the current user
            currentUser.get()
                .then(userDoc => {
                    // Retrieve the data fields of the user
                    let userName = userDoc.data().name;
                    let userCity = userDoc.data().city;
                    let userEmail = userDoc.data().email;

                    // If the data fields are not empty, populate them in the form
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userEmail != null) {
                        document.getElementById("emailInput").value = userEmail;
                    }
                })
                .catch(error => {
                    console.log("Error getting user document:", error);
                });
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}


function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userCity = document.getElementById('cityInput').value;       //get the value of the field with id="cityInput"

    currentUser.update({
        name: userName,
        city: userCity
    })
        .then(() => {
            console.log("Document successfully updated!");
        })

    document.getElementById('personalInfoFields').disabled = true;
}

//call the function to run it 
loadUserInfo();

