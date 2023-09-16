

document.addEventListener("DOMContentLoaded", function() {


const userEmail = sessionStorage.getItem("userEmail");

const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const exitButton = document.getElementById("exit-button");
    
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
          timerElement.innerText = `You currently have: ${data.points} typebits today, press start to begin`;
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
} else {
    timerElement.innerText = `Press start to begin/continue. You are not logged in` 
}


  

//=============================================================================













// Client-side SocketIO setup
const socket = io.connect('http://127.0.0.1:5000/');

socket.on('timer_update', function(data) {
    console.log("Timer should be shown is " + data.timer);
    timerElement.innerText = `${data.timer} typebits gathered today`;
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
            .then(response => response.text())
            .then(() => {
                // After starting, disable Start and enable Exit
                toggleButtons(true, false);
            });
    });

    function updateTimer() {
        // No need to fetch timer updates here since they will be received via WebSocket
    }
}






});