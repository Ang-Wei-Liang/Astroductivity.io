

document.addEventListener("DOMContentLoaded", function () {
    // Get a reference to the canvas element
    var ctx = document.getElementById("line-chart").getContext("2d");

    uid = sessionStorage.getItem("uid");
    console.log("real uid is " + uid)

    var previous_10_days = [];

    var previous_10_days_points = [];

    fetch(`/get_daily_stats10?uid=${uid}`)
            .then(response => response.json())
            .then(data => {  

                console.log(data)
              
                previous_10_days = data.previous_10_days;
                
                previous_10_days_points = data.previous_10_days_points;

                createBarChart(ctx, previous_10_days, previous_10_days_points);
                

            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });


    function createBarChart(ctx, previous_10_days, previous_10_days_points) {

    // Define your data for the line chart (modify as needed)
var data = {
    labels: previous_10_days,
    datasets: [{
        label: "Typebits Past 15 Days",
        data: previous_10_days_points, // Replace with your actual data
        fill: false, // Do not fill the area under the line
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        borderWidth: 2, // Line width
        pointBackgroundColor: "rgba(75, 192, 192, 1)", // Point color
        pointRadius: 5, // Point radius
        pointHitRadius: 10, // Clickable area for points
    }]
};

// Create a new line chart instance
var myLineChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


}

const userEmail = sessionStorage.getItem("userEmail");

//const timerElement = document.getElementById("timer");

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
          //timerElement.innerText = `${data.points}`;
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
    timerElement.innerText = `Press Start` 
}


});