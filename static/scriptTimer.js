

document.addEventListener("DOMContentLoaded", function() {

    



const userEmail = sessionStorage.getItem("userEmail");

const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const exitButton = document.getElementById("exit-button");

const totaltypebitsElement = document.getElementById("totaltypebitsValue");

/*setTimeout(function() {
    var typebitsValue = 100; // Replace with the actual value from your backend
    // Update the content of the span element with the retrieved value
    document.getElementById("typebitsValue").textContent = typebitsValue;
}, 2000);*/


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


//Update planet selection dropdown
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
    if (planetArr.includes(text)) {
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
        Venus: '../static/images/planets/Venus.png',
        Mercury: '../static/images/planets/Mercury.png',
    };
}

// Add an event listener for the 'change' event on the select element
planetSelect.addEventListener('change', function () {
    // Get the selected planet's value
    const selectedPlanet = planetSelect.value;

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
            });

    } else {
        // Set a default background image or clear it if no mapping is found
        circularCard.style.backgroundImage = `url('${planetImageMap["Moon"]}')`;
    }
});






// JavaScript code here===============================================================




//Index.html timer set up

// Function to retrieve points from the Flask endpoint

function retrievePoints() {
    uid = sessionStorage.getItem("uid");
    fetch(`/retrieve_points?uid=${uid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.points !== undefined) {
          console.log(`User's points: ${data.points}`);
          // Update the UI to display the user's points
          // Example: document.getElementById("points-display").textContent = data.points;
          //timerElement.innerText = `You currently have: ${data.points} typebits today, press start to begin`;
          timerElement.innerText = `${data.points}`;

          totaltypebitsElement.innerText = `${data.totalpoints}`;
          const planetImageMap = planetImageMapObj()
          if (data.selectedPlanet in planetImageMap) {
            circularCard.style.backgroundImage = `url('${planetImageMap[data.selectedPlanet]}')`;
          }

          //totaltypebitsElement.innerText = `${data.totalpoints}`;
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
    timerElement.innerText = `Press Start` 
}


  

//=============================================================================













// Client-side SocketIO setup
const currentURL = window.location.href;
const socket = io.connect('http://127.0.0.1:5000/');

socket.on('timer_update', function(data) {
    console.log("Timer should be shown is " + data.timer);
    timerElement.innerText = `${data.timer}`;
    //typebits gathered today
});


// Function to enable/disable buttons
function toggleButtons(startEnabled, exitEnabled) {
    startButton.disabled = !startEnabled;
    exitButton.disabled = !exitEnabled;
}

toggleButtons(true, false);

if (startButton && exitButton) {
    startButton.addEventListener("click", () => {
        fetch("/start_timer")
            .then(response => response.text())
            .then(() => {
                // After starting, disable Start and enable Exit
                toggleButtons(false, true);
            });
    });

    exitButton.addEventListener("click", () => {
        //clearInterval(timerInterval);
        fetch("/stop_timer")
            .then(response => response.json())
            .then((data) => {
                // After starting, disable Start and enable Exit'
                if (userEmail){
                totaltypebitsElement.innerText = `${data.totalpoints}`;
                }
                toggleButtons(true, false);
            });
    });

    function updateTimer() {
        // No need to fetch timer updates here since they will be received via WebSocket
    }
}






});