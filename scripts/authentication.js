// Initialize the FirebaseUI Widget using Firebase
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      var user = authResult.user; // Get the signed-in user object

      // Check if the user is new or if the database entry doesn't exist
      db.collection("users").doc(user.uid).get()
        .then((doc) => {
          if (!doc.exists) {
            console.log("User database entry does not exist. Creating new user entry...");
            return db.collection("users").doc(user.uid).set({
              name: user.displayName || "Anonymous", // Default name if not provided
              email: user.email,
              createdAt: firebase.firestore.FieldValue.serverTimestamp() // Add a timestamp
            });
          } else {
            console.log("User database entry already exists.");
          }
        })
        .then(() => {
          // Redirect to main.html after ensuring the user database entry exists
          console.log("User database entry ensured.");
          window.location.assign("main.html");
        })
        .catch((error) => {
          console.error("Error handling user database entry:", error);
        });

      // Return false to prevent automatic redirect
      return false;
    },
    uiShown: function () {
      // Hide the loader when the widget is rendered
      document.getElementById('loader').style.display = 'none';
    }
  },
  signInFlow: 'popup', // Use popup for sign-in
  signInSuccessUrl: "main.html", // Redirect URL after sign-in (not used with signInSuccessWithAuthResult)
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID // Email/password sign-in
  ],
  tosUrl: '<your-tos-url>', // Terms of service URL
  privacyPolicyUrl: '<your-privacy-policy-url>' // Privacy policy URL
};

// Start the FirebaseUI Auth widget
ui.start('#firebaseui-auth-container', uiConfig);
