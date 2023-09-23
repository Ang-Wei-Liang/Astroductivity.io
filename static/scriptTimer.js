

document.addEventListener("DOMContentLoaded", function() {

    

// Part 6: Timer Functions

const userEmail = sessionStorage.getItem("userEmail");

const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const exitButton = document.getElementById("exit-button");

const totalAstroCoinsElement = document.getElementById("totalAstroCoinsValue");

/*setTimeout(function() {
    var AstroCoinsValue = 100; // Replace with the actual value from your backend
    // Update the content of the span element with the retrieved value
    document.getElementById("AstroCoinsValue").textContent = AstroCoinsValue;
}, 2000);*/

// 6.1: Date

function updateDateTime() {
    const datetimeDisplay = document.getElementById('datetime-display');
    const now = new Date();
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const formattedDateTime = now.toLocaleDateString('en-US', options);
    datetimeDisplay.textContent = formattedDateTime;
}

// Update the date and time initially and every second
updateDateTime();
setInterval(updateDateTime, 1000);



// 6.2: Update planet selection dropdown
function obtainPlanetArr(){
    const planetSelect = document.getElementById('planet-select');

    while (planetSelect.options.length > 1) {
        planetSelect.remove(1);
    }

    uid = sessionStorage.getItem("uid");
    fetch(`/retrieve_button_status?uid=${uid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.planetArr !== undefined) {
            planetArr = data.planetArr

            addOptionToDropdown(planetSelect, 'Earth', 'Earth', planetArr);
            addOptionToDropdown(planetSelect, 'Mercury', 'Mercury', planetArr);
            addOptionToDropdown(planetSelect, 'Venus', 'Venus', planetArr);
            addOptionToDropdown(planetSelect, 'Jupiter', 'Jupiter', planetArr);
            addOptionToDropdown(planetSelect, 'Saturn', 'Saturn', planetArr);
            addOptionToDropdown(planetSelect, 'Uranus', 'Uranus', planetArr);
            addOptionToDropdown(planetSelect, 'Neptune', 'Neptune', planetArr);
            addOptionToDropdown(planetSelect, 'Pluto', 'Pluto', planetArr);
            addOptionToDropdown(planetSelect, 'Proxima', 'Proxima Cenatauri B', planetArr);
            addOptionToDropdown(planetSelect, 'Cancrie', '55 Cancri e', planetArr);
            addOptionToDropdown(planetSelect, 'Sun', 'Sun', planetArr);
           
          console.log(`User's planetArr Timer: ${data.planetArr}`);
          

        } else {
          console.error("Error retrieving planetArr:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error retrieving planetArr:", error);
      });

}

function addOptionToDropdown(selectElement, value, text, planetArr) {
    if (planetArr.includes(value)) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        selectElement.appendChild(option);
     
    }
}

//Update actual planet picture

// Get references to the select element and the circular-card element
const planetSelect = document.getElementById('planet-select');
const circularCard = document.querySelector('.circular-card');

function planetImageMapObj(){
    return {
        Moon: '../static/images/planets/moon-Eugene.png',
        Earth: '../static/images/planets/Earth.jpg',
        Mercury: '../static/images/planets/Mercury.png',
        Venus: '../static/images/planets/Venus.png',
        Jupiter: '../static/images/planets/Jupiter.png',
        Saturn: '../static/images/planets/Saturn.png',
        Uranus: '../static/images/planets/Uranus.png',
        Neptune: '../static/images/planets/Neptune.png',
        Pluto: '../static/images/planets/Pluto.png',
        Proxima: '../static/images/planets/Proxima.png',
        Cancrie: '../static/images/planets/Cancrie.png',
        Sun: '../static/images/planets/Sun.png',
        
    };
}

// Add an event listener for the 'change' event on the select element
planetSelect.addEventListener('change', function () {
    // Get the selected planet's value
    const selectedPlanet = planetSelect.value;
    //This is Moon etc.

    // Define an object to map planet values to image URLs
    const planetImageMap = planetImageMapObj()

    // Check if the selected planet is in the map
    if (selectedPlanet in planetImageMap) {
        // Set the background image based on the selected planet
        
        currentlySelectedPlanet = selectedPlanet

        fetch(`/set_currentlySelectedPlanet?currentlySelectedPlanet=${currentlySelectedPlanet}`)
            .then(response => response.json())
            .then((data) => {
                circularCard.style.backgroundImage = `url('${planetImageMap[data.selectedPlanet]}')`;
                
                if (data.selectedPlanet === 'Saturn'){
                    console.log('It was saturn')
                    circularCard.style.animation = 'none';
                    //circularCard.style.box-shadow = 'none';
                } else {
                    circularCard.style.animation = 'glow 3s linear infinite';
                }
                               
            });

    } else {
        // Set a default background image or clear it if no mapping is found
        circularCard.style.backgroundImage = `url('${planetImageMap["Moon"]}')`;
    }
});



// 6.3 Standard Time Retrival: Function to retrieve points from the Flask endpoint

function retrievePoints() {
    uid = sessionStorage.getItem("uid");
    fetch(`/retrieve_points?uid=${uid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.points !== undefined) {
          console.log(`User's points: ${data.points}`);
          // Update the UI to display the user's points
          // Example: document.getElementById("points-display").textContent = data.points;
          //timerElement.innerText = `You currently have: ${data.points} AstroCoins today, press start to begin`;
          timerElement.innerText = `${data.points}`;

          totalAstroCoinsElement.innerText = `${data.totalpoints}`;
          const planetImageMap = planetImageMapObj()
          if (data.selectedPlanet in planetImageMap) {
            circularCard.style.backgroundImage = `url('${planetImageMap[data.selectedPlanet]}')`;

            planetSelect.value = data.selectedPlanet

            if (data.selectedPlanet === 'Saturn'){
                    console.log('It was saturn')
                    circularCard.style.animation = 'none';
                    //circularCard.style.box-shadow = 'none';
            } else {
                circularCard.style.animation = 'glow 3s linear infinite';
            }

          }

          //totalAstroCoinsElement.innerText = `${data.totalpoints}`;
        } else {
          console.error("Error retrieving points:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error retrieving points:", error);
      });
  }



if (userEmail){
retrievePoints()
obtainPlanetArr()
} else {
    
    fetch("/start_timer_noUID")
            .then(response => response.json())
            .then((data) => {
                // After starting, disable Start and enable Exit
               
                timerElement.innerText = `${data.startTime}`;
            });
}


// Function to enable/disable buttons
function toggleButtons(startEnabled, exitEnabled) {
    startButton.disabled = !startEnabled;
    exitButton.disabled = !exitEnabled;
}

toggleButtons(true, false);

if (startButton && exitButton) {
    let timerInterval; // To store the interval ID

    // Function to debounce button clicks
    function debounceClick(handler, delay) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(() => {
                handler.apply(this, arguments);
            }, delay);
        };
    }

    // Debounced click event handler for "Start" button
    const debouncedStartClick = debounceClick(() => {
        fetch("/start_timer")
            .then(response => response.json())
            .then((data) => {
                // After starting, disable Start and enable Exit
                toggleButtons(false, true);
                timerElement.innerText = `${data.startTime}`;

                // Start a timer to periodically update the UI
                timerInterval = setInterval(() => {
                    fetch("/retrieving_timer_interval") // Create a new Flask route to get the timer value
                        .then(response => response.json())
                        .then((data) => {
                         
                            timerElement.innerText = `${data.startTime}`;
                        });
                }, 2000); // Fetch timer value every 5 seconds
            });
    }, 1000); // Debounce delay of 1 second

    // Debounced click event handler for "Exit" button
    const debouncedExitClick = debounceClick(() => {
        clearInterval(timerInterval); // Stop the timer interval
        fetch("/stop_timer")
            .then(response => response.json())
            .then((data) => {
                // After stopping, disable Start and enable Exit
                if (userEmail) {
                    
                    totalAstroCoinsElement.innerText = `${data.totalpoints}`;
                }
                toggleButtons(true, false);
                timerElement.innerText = `${data.endTime}`;
            });
    }, 1000); // Debounce delay of 1 second

    // Attach debounced click event handlers to the buttons
    startButton.addEventListener("click", debouncedStartClick);
    exitButton.addEventListener("click", debouncedExitClick);
}

window.addEventListener("beforeunload", () => {
    clearInterval(timerInterval); // Clear the interval before unloading
    fetch("/user_leaving", { method: "POST" });
});


});