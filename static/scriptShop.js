
document.addEventListener("DOMContentLoaded", function () {


    /*BUYING*/

    // Attach a click event listener to all Buy buttons with the .buy-button class
    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const itemValue = this.getAttribute('data-item-value'); // Get the item value from the data attribute
            document.getElementById('itemValue').textContent = itemValue; // Set the item value in the modal

            const itemName = this.getAttribute('data-item-name');
            document.getElementById('itemName').textContent = itemName; 
        });
    });

    // Add a click event listener to the Confirm button to handle the purchase action (as shown in the previous example)
    document.getElementById('confirmPurchaseButton').addEventListener('click', function () {

        // Handle the purchase action here
        // Close the modal and update the UI as needed

        //var totalPoints = retrievePoints();

        /*Repeater*/

        uid = sessionStorage.getItem("uid");
        fetch(`/retrieve_points?uid=${uid}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.totalpoints !== undefined) {
                    console.log(`User's total points retrival: ${data.totalpoints}`);
                    // Update the UI to display the user's points
                    // Example: document.getElementById("points-display").textContent = data.points;
                    //timerElement.innerText = `You currently have: ${data.points} typebits today, press start to begin`;

                    console.log("Retrival for subtraction Completed, totalPoints is " + data.totalpoints)

                    totalPoints = data.totalpoints
                    const itemValue = document.getElementById('itemValue').textContent
                    const itemName = document.getElementById('itemName').textContent

                    if (totalPoints - itemValue < 0) {
                        $('#buyConfirmationModal').modal('hide');
                        document.getElementById('itemValue2').textContent = 'You do not hae enough typebits.';
                        $('#purchaseSuccessModal').modal('show')

                    } else {

                        buyProcess(itemValue, itemName);

                        $('#buyConfirmationModal').modal('hide');
                        document.getElementById('itemValue2').textContent = 'Your purchase has been successfully completed.';
                        $('#purchaseSuccessModal').modal('show');



                    }

                } else {
                    console.error("Error retrieving points:", data.error);
                }
            })
            .catch((error) => {
                console.error("Error retrieving points:", error);
            });



        /*Repeater*/


    });


    function buyProcess(itemValue, itemName) {

        console.log("itemValue JS is " + itemValue + " and itemName JS is " + itemName)

        uid = sessionStorage.getItem("uid");
        var totalPoints


        fetch(`/buyProcess?uid=${uid}&itemValue=${itemValue}&itemName=${itemName}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.totalpoints !== undefined) {
                    console.log(`User's new points after buy: ${data.totalpoints}`);


                    totaltypebitsElement.innerText = `${data.totalpoints}`;

                    totalPoints = data.totalpoints

                    retrieveButtonStatus()
                    console.log("Buy Process Completed")


                } else {
                    console.error("Error retrieving points:", data.error);
                }
            })
            .catch((error) => {
                console.error("Error retrieving points:", error);
            });


    }












    const userEmail = sessionStorage.getItem("userEmail");

    /*window.addEventListener('scroll', function () {
        const topCenterText = document.querySelector('.top-center-text');
        const scrollY = window.scrollY;
    
        if (scrollY > 90) { // Adjust the threshold as needed
            topCenterText.style.top = '0';
        } else {
            topCenterText.style.top = '-100px'; // Move the element off the screen
        }
    });*/


    const totaltypebitsElement = document.getElementById("totaltypebitsValue");


    function retrievePoints() {

        uid = sessionStorage.getItem("uid");
        fetch(`/retrieve_points?uid=${uid}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.totalpoints !== undefined) {
                    console.log(`User's total points retrival: ${data.totalpoints}`);
                    // Update the UI to display the user's points
                    // Example: document.getElementById("points-display").textContent = data.points;
                    //timerElement.innerText = `You currently have: ${data.points} typebits today, press start to begin`;

                    console.log("Retrival Completed, totalPoints is " + data.totalpoints)
                    totaltypebitsElement.innerText = `${data.totalpoints}`;
                    //var totalPoints = data.totalpoints
                    //return totalPoints
                } else {
                    console.error("Error retrieving points:", data.error);
                }
            })
            .catch((error) => {
                console.error("Error retrieving points:", error);
            });
    }


    if (userEmail) {
        //totalPoints = retrievePoints()
        retrievePoints()
        retrieveButtonStatus()
    } else {

    }

    const moonButton = document.getElementById('moonButton');
    const mercuryButton = document.getElementById('mercuryButton');
    const earthButton = document.getElementById('earthButton');
    const venusButton = document.getElementById('venusButton');


    function retrieveButtonStatus() {
        uid = sessionStorage.getItem("uid");
        fetch(`/retrieve_button_status?uid=${uid}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                if (data.planetArr !== undefined) {
                    console.log(`User's planet array retrieved, it is ` + data.planetArr);

                    planetArr = data.planetArr

                    if (planetArr.includes("Moon")) {
                        moonButton.classList.add('disabled');
                        document.getElementById('moonBuyStatus').textContent = "Owned"             
                    }

                    if (planetArr.includes("Mercury")) {
                        mercuryButton.classList.add('disabled');
                        document.getElementById('mercuryBuyStatus').textContent = "Owned"             
                    }

                    if (planetArr.includes("Earth")) {
                        earthButton.classList.add('disabled');
                        document.getElementById('earthBuyStatus').textContent = "Owned"             
                    }

                    if (planetArr.includes("Venus")) {
                        venusButton.classList.add('disabled');
                        document.getElementById('venusBuyStatus').textContent = "Owned"             
                    }
                } else {
                    console.error("Error retrieving planets:", data.error);
                }
            })
            .catch((error) => {
                console.error("Error retrieving planets:", error);
            });
    }

});