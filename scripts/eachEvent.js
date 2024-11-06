function displayEventInfo() {
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    console.log( ID );

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection( "events" )
        .doc( ID )
        .get()
        .then( doc => {
            eventCode = doc.data().code;
            eventName = doc.data().name;
            eventdetails = doc.data().details;
            
            
            // only populate title, and image
            document.getElementById( "eventName" ).innerHTML = eventName;
            let imgEvent = document.querySelector( ".event-img" );
            imgEvent.src = "../images/" + eventCode + ".jpg";
            document.getElementById( "details-go-here" ).innerHTML = eventdetails;
            
            
        } );
}
displayEventInfo();