// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // If the "user" variable is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('/text/nav_after_login.html'));
            console.log($('#footerPlaceholder').load('/text/footer.html'));
        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('/text/nav_before_login.html'));
            console.log($('#footerPlaceholder').load('/text/footer.html'));
        }
    });
}

// Call this function when the "logout" button is clicked
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Adjust all anchor tags with .html in the href
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        const currentHref = link.getAttribute('href');
        if (!currentHref.startsWith('/html/')) {
            link.setAttribute('href', `/html/${currentHref}`);
        }
    });

    // Adjust form actions (if applicable)
    document.querySelectorAll('form[action$=".html"]').forEach(form => {
        const currentAction = form.getAttribute('action');
        if (!currentAction.startsWith('/html/')) {
            form.setAttribute('action', `/html/${currentAction}`);
        }
    });
});

loadSkeleton();  //invoke the function
