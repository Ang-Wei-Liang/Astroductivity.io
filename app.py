
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import time
from threading import Thread
from datetime import datetime, timedelta
import firebase_admin
import os
from firebase_admin import credentials, initialize_app
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create a dictionary with Firebase credentials
firebase_credentials = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),  # Replace escaped newlines
    "client_email": os.getenv("CLIENT_EMAIL"),
    "client_id": os.getenv("CLIENT_ID"),
    "auth_uri": os.getenv("AUTH_URI"),
    "token_uri": os.getenv("TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("CLIENT_X509_CERT_URL"),
    "universe_domain": os.getenv("UNIVERSE_DOMAIN")
}

# Initialize Firebase Admin SDK with credentials
cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred)

# Import necessary Firebase modules
from firebase_admin import auth
from firebase_admin import firestore

# Initialize Firestore
db = firestore.client()

# Create a Flask app
app = Flask(__name__, static_url_path='/static')



# Define Routes 
@app.route('/index')
def index():
    stop_timer()
    return render_template('index.html')


@app.route('/home')
def home():
    stop_timer()
    return render_template('home.html')

@app.route('/')
def index2():
    stop_timer()
    return redirect(url_for('home'))

@app.route('/statistics')
def statistics():
    stop_timer()
    return render_template('statistics.html')

@app.route('/shop')
def shop():
    stop_timer()
    return render_template('shop.html')


# Home Page

# Define the signup route
@app.route('/signupform', methods=['POST'])
def signupform():
    if request.method == 'POST':
        email = request.json.get('email')
        password = request.json.get('password')

        # Create a new user in Firebase Authentication
        try:
            user = auth.create_user(
                email=email,
                password=password,
                display_name=email
            )
            return jsonify({"message": "Signup successful"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400  # Handle any errors


# Define the login route
@app.route('/loginform', methods=['POST'])
def loginform():
    if request.method == 'POST':
        email = request.json.get('email')
        password = request.json.get('password')

        print("email and password are " + email + "and" + password)

        try:
            # Sign in the user with email and password
            user = auth.get_user_by_email(email)
            # auth.verify_password(user.uid, password)
            uid = user.uid
            # If login is successful, you can return a success message
            return jsonify({"message": "Login successful", "uid": uid}), 200
        except Exception as e:
            # Handle login errors (e.g., incorrect email/password)
            error_message = str(e)
            return jsonify({"error": error_message}), 401


# Timer Page 

# Define the retrival and saving of points

timer_running = False
timer = 0
savedtime = 0
uid = 'XXX'

timerSum = 0
startTimer = 0
timerStatus = False
currentlySelectedPlanet = "Moon"


# Define the delete route

@app.route('/deleteAcc', methods=['GET'])
def delete_Account():
    global uid
    uid = request.args.get('uid')  # Get user_id from request
    
    try:
        # Delete the user from Firebase Authentication
        auth.delete_user(uid)

        user_ref = db.collection('users').document(uid)
        doc = user_ref.get()

        if doc.exists:
            print("A doc exists, deleting...")

            # Delete documents within the user's subcollection
            subcollection_ref = user_ref.collection("dailyPoints")  # Replace "subcollection_name" with the actual subcollection name

            for sub_doc in subcollection_ref.stream():
               sub_doc.reference.delete()

            # Optionally, delete the user document itself
            user_ref.delete()

        else:
            print("No doc exists already!")

        return "Account deleted successfully", 200
    except auth.UserNotFoundError:
        return "User not found", 404
    except Exception as e:
        print("There was exception error")
        print(str(e))
        return str(e), 500

# Define the points retrival (logged in)

@app.route('/retrieve_points', methods=['GET'])
def retrieve_points():
    global uid
    uid = request.args.get('uid')  # Get user_id from request

    # Check if the user document exists
    user_ref = db.collection('users').document(uid)
    doc = user_ref.get()

    global timer
    global timerSum
    global currentlySelectedPlanet

    current_date = datetime.now().strftime('%Y-%m-%d')

    if doc.exists:
        # User document exists, check if dailyPoints subcollection exists
        print("main document exists")

        daily_points_ref = user_ref.collection('dailyPoints')      
        daily_doc = daily_points_ref.document(current_date).get()


        # Getting total points
        user_data = doc.to_dict()
        totalPoints = user_data.get('points', 0)  # Default to 0 if 'points' field doesn't exist

        print("Total points0 is: " + str(totalPoints))
        timerSum = totalPoints

        print("Total points is (timerSum): " + str(timerSum))

        # Getting Current Planet
        currentlySelectedPlanet = user_data.get('selectedPlanet', 'Moon')

        if daily_doc.exists:
            
            # If points for the specified date exist, return them
            points = daily_doc.to_dict().get('points')
            print("daily document exists, retrieved points: " + str(points))
            timer = points
        else:
            # Points for the specified date don't exist, set points to 0
            timer = 0
            daily_points_ref.document(current_date).set({'points': 0}, merge=True)
    else:
        # User not found, create a new user document with some initial data
        
        initial_data = {
            'points': 0,  # You can initialize points to any default value
            # Add other user data as needed
            'planet': ["Moon"],
            'selectedPlanet': 'Moon'
        }
        user_ref.set(initial_data)
        

        #Here, create the dailypoints collection!
        
         # Also set points to 0 for today's date
        daily_points_ref = user_ref.collection('dailyPoints').document(current_date)
        daily_points_ref.set({'points': 0}, merge=True)
        timer = 0
        timerSum = 0

    return jsonify({'points': timer, 'totalpoints':timerSum, 'selectedPlanet':currentlySelectedPlanet}), 200


# Define the planets array retrival (logged in, shop)

@app.route('/retrieve_button_status', methods=['GET'])
def retrieve_button_status():
    global uid
    uid = request.args.get('uid')  # Get user_id from request currentlySelectedPlanet

    # Check if the user document exists
    user_ref = db.collection('users').document(uid)
    doc = user_ref.get()

    if doc.exists:
        # User document exists, check if dailyPoints subcollection exists
        print("main document exists, retrieving planet status")

        # Getting total points
        user_data = doc.to_dict()
        planetArr = user_data.get('planet', ["Moon"])  # Default to 0 if 'points' field doesn't exist

        print(planetArr)

    else:
        # User not found, create a new user document with some initial data
        
        initial_data = {
            'points': 0,  # You can initialize points to any default value
            # Add other user data as needed
            'planet': ['Moon'],
            'selectedPlanet': 'Moon'
        }
        user_ref.set(initial_data)

        planetArr = ["Moon"]

    return jsonify({'planetArr': planetArr}), 200


# Thread: Move the timer logic into a separate function
def start_timer():
    global timer_running, timer, startTimer, timerStatus

    timerStatus = True
    startTimer = timer

    print("Timer started")
    #this is prev
    
    if timer_running:
        #timer_running = True
        print("Timer started")

        print(timer_running)
        while timer_running:
            # Increment the timer every second
            time.sleep(2)
            timer += 1
            print(f"Timer number is {timer}")


# Start Timer and Activate Thread

@app.route('/start_timer')
def start_timer_route():
    global timer_running, timer, savedtime
    print("Timer route started")
    timer_running = True

    timer_thread = Thread(target=start_timer)
    timer_thread.start()
    print("Start display timer = ========================" + str(timer))
    return jsonify({'startTime': timer}), 200


# Define the points retrival (not logged in)
@app.route('/start_timer_noUID')
def start_timer_route_noUID():
    global timer
    timer = 0
    print("No uID start Timer retrieved")
    return jsonify({'startTime': timer}), 200


# Define the points retrival at intervals
@app.route('/retrieving_timer_interval')
def retrieving_timer_interval():
    global timer
    
    print("No uID start Timer retrieved")
    return jsonify({'startTime': timer}), 200


# Stop Timer
@app.route('/stop_timer')
def stop_timer():
    global timer_running
    global savedtime
    print("timer stopped")
    timer_running = False
    global timer
    global startTimer
    global timerSum
    global uid
    global timerStatus

    if timerStatus == False:
        timeGained = 0
    else:
        timeGained = timer - startTimer

    print("=========================================================")
    print("Stop timer uid = " + str(uid))
    print("Stop timer, timer is = " + str(timer))
    print("Stop timer, at the start timer is = " + str(startTimer))
    print("Time gained to add is" + str(timeGained))
       
    if uid != 'XXX':
        # Get the current date in 'YYYY-MM-DD' format
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        user_ref = db.collection('users').document(uid)
        daily_points_ref = user_ref.collection('dailyPoints').document(current_date)
        
        # Update the points for today's date
        daily_points_ref.set({'points': timer}, merge=True)  # Merge is used to update existing points
        savedtime = timer

        #if timer_status_check != False:

        # Adding to total, Update the points for total        
        FinalTotalTime = timerSum + timeGained
        print("timerSum is" + str(timerSum))
        print("FinalTotalTime is " + str(FinalTotalTime))
        #FinalTotalTime = 12000
        user_ref.set({'points': FinalTotalTime}, merge=True)

        timerSum = FinalTotalTime

        startTimer = timer
        print("after equating, startTimer is now updated as new" + str(startTimer))
        print("=========================================================")

    timerStatus == False

    return jsonify({'totalpoints':timerSum, 'endTime':timer}), 200
    


# Set current Planet

@app.route('/set_currentlySelectedPlanet')
def set_currentlySelectedPlanetr():
    global uid
    currentlySelectedPlanet = request.args.get('currentlySelectedPlanet')
    if uid != 'XXX':
        
        user_ref = db.collection('users').document(uid)

        user_ref.set({'selectedPlanet': currentlySelectedPlanet}, merge=True)  # Merge is used to update existing points

    return jsonify({'selectedPlanet': currentlySelectedPlanet}), 200



# Buy Process (shop)

@app.route('/buyProcess')
def buyProcess():
    global uid
    global timerSum
    uid = request.args.get('uid')  # Get user_id from request
    itemValue = request.args.get('itemValue')  # Get itemValue from request
    itemName = request.args.get('itemName')

    updatedtimerSum = timerSum - int(itemValue)
    timerSum = updatedtimerSum
    
    print("Item name is " + itemName)

    if uid != 'XXX':  
        # Setting total points            
        user_ref = db.collection('users').document(uid)
        print("updated totalSum is " + str(timerSum))
        user_ref.set({'points': timerSum}, merge=True)

        # Adding planet status
        doc = user_ref.get()
        user_data = doc.to_dict()
        planetArr = user_data.get('planet', ['Moon'])
        print("Retrieved array is " + ', '.join(planetArr))
        planetArr.append(itemName)
        print("Set array 2 is " + ', '.join(planetArr))


        user_ref.set({'planet': planetArr}, merge=True)
     
    return jsonify({'totalpoints':timerSum}), 200


# Stop Timer (upon leaving)

@app.route("/user_leaving", methods=["POST"])
def user_leaving():
    # Perform actions when the user is leaving (e.g., logging, cleanup)
   
    print("User is leaving the page.")
    stop_timer()

    return "OK", 200


# Logout function

@app.route('/logout_timer')
def logout_timer():
    stop_timer()
    global timer_running
    global timer
    global uid

    timer = 0
    uid = 'XXX'
    timer_running = False

    return "Logout Timer stopped."


# Obtain Statistics

@app.route('/get_daily_stats10', methods=['GET'])
def get_daily_stats10():
    global uid
    uid = request.args.get('uid')  # Get user_id from request

    if not uid:
        return jsonify({"error": "uid not provided"})

    # Check if the user document exists
    user_ref = db.collection('users').document(uid)
    doc = user_ref.get()

    if doc.exists:
        # User document exists, check if dailyPoints subcollection exists
        print("main document exists")

        daily_points_ref = user_ref.collection('dailyPoints')
        
        current_date_1 = datetime.now()
        current_date = datetime.now().strftime('%Y-%m-%d')
        # Create an empty list to store the previous 10 days

        previous_10_days = []
        previous_10_days_points = []
        
        # Use a loop to calculate the previous 15 days and format them
        for i in range(0, 15):
            previous_date = current_date_1 - timedelta(days=i)

            #print("===============previous_date is " + str(previous_date))

            formatted_date = previous_date.strftime('%Y-%m-%d')
            #previous_10_days_points.append(formatted_date)

            daily_doc = daily_points_ref.document(formatted_date).get()

            if daily_doc.exists:
            
            # If points for the specified date exist, return them
                statsPoints = daily_doc.to_dict().get('points')
                
                previous_10_days.insert(0, formatted_date)
                previous_10_days_points.insert(0, statsPoints)
                           
            else:
            # Points for the specified date don't exist, set points to 0
                
                previous_10_days.insert(0, formatted_date)
                previous_10_days_points.insert(0, 0)
                daily_points_ref.document(formatted_date).set({'points': 0})

        print(previous_10_days)
        print(previous_10_days_points)

    return jsonify({"previous_10_days": previous_10_days, "previous_10_days_points": previous_10_days_points})

if __name__ == "__main__":
    #app.run(debug=False,host='0.0.0.0')
    app.run(debug=True)
    
