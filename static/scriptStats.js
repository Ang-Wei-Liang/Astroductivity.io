

document.addEventListener("DOMContentLoaded", function () {
    // Get a reference to the canvas element
    var ctx = document.getElementById("bar-chart").getContext("2d");

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

    // Define your data for the bar chart (modify as needed)
    var data = {
        labels: previous_10_days,
        datasets: [{
            label: "Points Past 10 Days",
            data: previous_10_days_points, // Replace with your actual data
            backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)"
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)"
            ],
            borderWidth: 1
        }]
    };

    // Create a new bar chart instance
    var myBarChart = new Chart(ctx, {
        type: "bar",
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

});