
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in
            console.log($('#navbarPlaceholder').load('/text/nav_after_login.html', attachNavbarListeners));
            console.log($('#footerPlaceholder').load('/text/footer.html'));
        } else {
            // No user is signed in
            console.log($('#navbarPlaceholder').load('/text/nav_before_login.html', attachNavbarListeners));
            console.log($('#footerPlaceholder').load('/text/footer.html'));
        }
    });
}

// Call this function when the "logout" button is clicked
function logout() {
    firebase.auth().signOut().then(() => {
        console.log("logging out user");
    }).catch((error) => {
        console.error("Logout error:", error);
    });
}

// Attach event listeners to navbar after loading it
function attachNavbarListeners() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('hover-dropdown'); // Remove hover behavior
            } else {
                navbarCollapse.classList.add('hover-dropdown'); // Add hover behavior
            }
        });

        // Add resize listener to ensure `hover-dropdown` is removed for full width
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992) { // Bootstrap's LG breakpoint
                navbarCollapse.classList.remove('hover-dropdown');
            }
        });
    } else {
        console.error("Navbar elements not found!");
    }
}

// Adjust all anchor tags and form actions once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        const currentHref = link.getAttribute('href');
        if (!currentHref.startsWith('/html/')) {
            link.setAttribute('href', `/html/${currentHref}`);
        }
    });

    document.querySelectorAll('form[action$=".html"]').forEach(form => {
        const currentAction = form.getAttribute('action');
        if (!currentAction.startsWith('/html/')) {
            form.setAttribute('action', `/html/${currentAction}`);
        }
    });
});

// Invoke the skeleton loader
loadSkeleton();
