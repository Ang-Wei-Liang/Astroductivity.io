document.addEventListener("DOMContentLoaded", function() {
    const timerElement = document.getElementById("timer");
    const startButton = document.getElementById("start-button");
    const exitButton = document.getElementById("exit-button");
 
    const loginButton = document.getElementById("loginbutton"); // Add login button element
    const signupButton = document.getElementById("signupbutton"); // Add signup button element


//------------------------------------------------------

/*login.html*/
loginButton.addEventListener("click", () => {
    // Handle login form submission here
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    console.log(email + password);

    fetch("/loginform", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Set the Content-Type header to JSON
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        if (data.message === "Login successful") {
            // Redirect to the desired page after successful login
            window.location.href = "/index.html"; // Replace with the actual URL
        } else {
            // Handle login errors or display messages to the user
            console.error("Login failed:", data.error);
        }
    })
    .catch(error => {
        console.error("Login failed:", error);
    });
});

/*signup.html*/
signupButton.addEventListener("click", () => {
    // Handle signup form submission here
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    console.log(email + password);



    fetch("/signupform", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Set the Content-Type header to JSON
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        if (data.message === "Signup successful") {
            // Redirect to the desired page after successful signup
            window.location.href = "/login.html"; // Replace with the actual URL
        } else {
            // Handle signup errors or display messages to the user
            console.error("Signup failed:", data.error);
        }
    })
    .catch(error => {
        console.error("Signup failed:", error);
    });
});


//--------------------------------------------------

/*sindex.html*/
    let timerInterval;

    startButton.addEventListener("click", () => {
        fetch("/start_timer");
        timerInterval = setInterval(updateTimer, 975);
    });

    exitButton.addEventListener("click", () => {
        clearInterval(timerInterval);
        fetch("/stop_timer");
    });

    function updateTimer() {
        fetch("/get_timer")
            .then(response => response.text())
            .then(timer => {
                timerElement.innerText = `Time passed: ${timer} typebits`;
            });
    }
});



//const loginButton = document.getElementById("loginbutton"); // Add login button element
//const signupButton = document.getElementById("signupbutton"); // Add signup button element