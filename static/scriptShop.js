
document.addEventListener("DOMContentLoaded", function () {

    //Part 4: The Buying
    // Buy Button Part 1
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

    // Buy Button Part 2a
    // Add a click event listener to the Confirm button to handle the purchase action (as shown in the previous example)
    document.getElementById('confirmPurchaseButton').addEventListener('click', function () {

        uid = sessionStorage.getItem("uid");
        fetch(`/retrieve_points?uid=${uid}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.totalpoints !== undefined) {
                    console.log(`User's total points retrival: ${data.totalpoints}`);
                    // Update the UI to display the user's points
                    // Example: document.getElementById("points-display").textContent = data.points;
                    //timerElement.innerText = `You currently have: ${data.points} AstroCoins today, press start to begin`;

                    console.log("Retrival for subtraction Completed, totalPoints is " + data.totalpoints)

                    totalPoints = data.totalpoints
                    const itemValue = document.getElementById('itemValue').textContent
                    const itemName = document.getElementById('itemName').textContent

                    if (totalPoints - itemValue < 0) {
                        $('#buyConfirmationModal').modal('hide');
                        document.getElementById('itemValue2').textContent = 'You do not hae enough AstroCoins.';
                        $('#purchaseSuccessModal').modal('show')

                    } else {

                        buyProcess(itemValue, itemName);

                        $('#buyConfirmationModal').modal('hide');
                        document.getElementById('itemValue2').textContent = 'Your purchase has been successfully completed.';
                        $('#purchaseSuccessModal').modal('show');

                        /*
                        const audioBought = document.getElementById('triggerBought-audio');
                        audioBought.src = '../../static/audio/WooHoo.mp3';
                        //Sound Effect from <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=73283">Pixabay</a>
                        audioBought.play();
                        */

                        const audio = new Audio('../../static/audio/WooHoo.mp3');
                        audio.play();

                    }

                } else {
                    console.error("Error retrieving points:", data.error);
                }
            })
            .catch((error) => {
                console.error("Error retrieving points:", error);
            });
    });

    // Buy Button Part 2b
    function buyProcess(itemValue, itemName) {

        console.log("itemValue JS is " + itemValue + " and itemName JS is " + itemName)

        uid = sessionStorage.getItem("uid");
        var totalPoints

        fetch(`/buyProcess?uid=${uid}&itemValue=${itemValue}&itemName=${itemName}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.totalpoints !== undefined) {
                    console.log(`User's new points after buy: ${data.totalpoints}`);


                    totalAstroCoinsElement.innerText = `${data.totalpoints}`;

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
    const totalAstroCoinsElement = document.getElementById("totalAstroCoinsValue");


    // Points Retrival
    function retrievePoints() {

        uid = sessionStorage.getItem("uid");
        fetch(`/retrieve_points?uid=${uid}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.totalpoints !== undefined) {
                    console.log(`User's total points retrival: ${data.totalpoints}`);

                    console.log("Retrival Completed, totalPoints is " + data.totalpoints)
                    totalAstroCoinsElement.innerText = `${data.totalpoints}`;
    
                } else {
                    console.error("Error retrieving points:", data.error);
                }
            })
            .catch((error) => {
                console.error("Error retrieving points:", error);
            });
    }

    if (userEmail) {
        retrievePoints()
        retrieveButtonStatus()
    } else {

    }

    const moonButton = document.getElementById('moonButton');
    const mercuryButton = document.getElementById('mercuryButton');
    const earthButton = document.getElementById('earthButton');
    const venusButton = document.getElementById('venusButton');
    const jupiterButton = document.getElementById('jupiterButton');
    const saturnButton = document.getElementById('saturnButton');
    const uranusButton = document.getElementById('uranusButton');
    const neptuneButton = document.getElementById('neptuneButton');
    const plutoButton = document.getElementById('plutoButton');
    const proximaButton = document.getElementById('proximaButton');
    const cancrieButton = document.getElementById('cancrieButton');
    const sunButton = document.getElementById('sunButton');



    // Button Status Retrival

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

                    if (planetArr.includes("Jupiter")) {
                        jupiterButton.classList.add('disabled');
                        document.getElementById('jupiterBuyStatus').textContent = "Owned"             
                    }

                    if (planetArr.includes("Saturn")) {
                        saturnButton.classList.add('disabled');
                        document.getElementById('saturnBuyStatus').textContent = "Owned"             
                    }

                    if (planetArr.includes("Uranus")) {
                        uranusButton.classList.add('disabled');
                        document.getElementById('uranusBuyStatus').textContent = "Owned"             
                    }

                    if (planetArr.includes("Neptune")) {
                        neptuneButton.classList.add('disabled');
                        document.getElementById('neptuneBuyStatus').textContent = "Owned"             
                    }

                    if (planetArr.includes("Pluto")) {
                        plutoButton.classList.add('disabled');
                        document.getElementById('plutoBuyStatus').textContent = "Owned"             
                    }

                    if (planetArr.includes("Proxima")) {
                        proximaButton.classList.add('disabled');
                        document.getElementById('proximaBuyStatus').textContent = "Owned"             
                    }

                    if (planetArr.includes("Cancrie")) {
                        cancrieButton.classList.add('disabled');
                        document.getElementById('cancrieBuyStatus').textContent = "Owned"             
                    }

                    if (planetArr.includes("Sun")) {
                        sunButton.classList.add('disabled');
                        document.getElementById('sunBuyStatus').textContent = "Owned"             
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