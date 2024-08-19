let ISBN = "9791196777050"
let handleWishButton = false

// open new window for detailed info
function popWindow() {
    let params = `
        scrollbars=yes,
        resizable=yes,
        status=no,
        location=no,
        toolbar=no,
        menubar=yes,
        width=1000,
        height=800,
        left=(window.screen.width / 2) - (width/2),
        top=(window.screen.height / 4)
        `;
    // Append the ISBN to the URL as a query parameter
    let detailPageURL = `detail_page.html?isbn=${encodeURIComponent(ISBN)}`;
    window.open(detailPageURL, "a", params); 
    console.log("Sent to child window", ISBN)
    }


// This event handler will listen for messages from the child
window.addEventListener("message", (e)=>{
    //e.data hold the message from the child
    // Check if the received message is the expected object
    if (e.data && e.data.isbn && e.data.wishCondition){
        console.log("Received from child window:", e.data)
    }


})

// this is a test
