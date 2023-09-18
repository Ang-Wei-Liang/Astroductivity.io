
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import keyboard
import time
from threading import Thread
from flask_sockets import Sockets

from flask_socketio import SocketIO, emit
from datetime import datetime, timedelta

#========================
import firebase_admin
from firebase_admin import credentials

# Initialize Firebase with your Firebase Admin SDK JSON file
cred = credentials.Certificate('typebitsver2-firebase-adminsdk-m68lt-e6d733790b.json')
firebase_admin.initialize_app(cred)

from firebase_admin import auth
#========================

#========================
from firebase_admin import firestore
db = firestore.client()
#========================

app = Flask(__name__, static_url_path='/static')

socketio = SocketIO(app)








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


#================= Timer Page ===================================
letter_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
               'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']



#Define the retrival and saving of points

timer_running = False
timer = 0
savedtime = 0
uid = 'XXX'

"""
@app.route('/deleteAcc', methods=['GET'])
def delete_Account():
    global uid
    uid = request.args.get('uid')  # Get user_id from request
    user_ref = db.collection('users').document(uid)
    doc = user_ref.get()

    if doc.exists:
        # Delete documents within the user's subcollection
        subcollection_ref = user_ref.collection("dailyPoints")  # Replace "subcollection_name" with the actual subcollection name

        for sub_doc in subcollection_ref.stream():
            sub_doc.reference.delete()

        # Delete the subcollection itself
        db.collection("users").document(uid).collection("dailyPoints").delete()

        # Optionally, delete the user document itself
        user_ref.delete()

        return "Account deleted successfully", 200
    else:
        return "User not found", 404
"""

@app.route('/deleteAcc', methods=['GET'])
def delete_Account():
    global uid
    uid = request.args.get('uid')  # Get user_id from request
    
    try:
        # Delete the user from Firebase Authentication
        auth.delete_user(uid)

        #--------------------------------------

        user_ref = db.collection('users').document(uid)
        doc = user_ref.get()

        if doc.exists:
            print("A doc exists, deleting...")
        # Delete documents within the user's subcollection
            subcollection_ref = user_ref.collection("dailyPoints")  # Replace "subcollection_name" with the actual subcollection name

            for sub_doc in subcollection_ref.stream():
               sub_doc.reference.delete()

            print("deletion phase 1")

            # Delete the subcollection itself
            #db.collection("users").document(uid).delete()
            #.collection("dailyPoints")

            print("deletion phase 2")

            # Optionally, delete the user document itself
            user_ref.delete()

            print("deletion phase 3")

        else:
            print("No doc exists already!")


        return "Account deleted successfully", 200
    except auth.UserNotFoundError:
        return "User not found", 404
    except Exception as e:
        print("There was exception error")
        print(str(e))
        return str(e), 500


@app.route('/retrieve_points', methods=['GET'])
def retrieve_points():
    global uid
    uid = request.args.get('uid')  # Get user_id from request

    # Check if the user document exists
    user_ref = db.collection('users').document(uid)
    doc = user_ref.get()

    global timer

    current_date = datetime.now().strftime('%Y-%m-%d')

    if doc.exists:
        # User document exists, check if dailyPoints subcollection exists
        print("main document exists")

        daily_points_ref = user_ref.collection('dailyPoints')
        
        

        daily_doc = daily_points_ref.document(current_date).get()

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
        }
        user_ref.set(initial_data)
        

        #Here, create the dailypoints collection!
        
         # Also set points to 0 for today's date
        daily_points_ref = user_ref.collection('dailyPoints').document(current_date)
        daily_points_ref.set({'points': 0}, merge=True)
        timer = 0

    return jsonify({'points': timer}), 200







@app.route('/index')
def index():
    stop_timer()
    return render_template('index.html')


@app.route('/home')
def login():
    return render_template('home.html')

"""
@app.route('/signup')
def signup():
    return render_template('signup.html')
"""

@app.route('/statistics')
def statistics():
    stop_timer()
    return render_template('statistics.html')

@app.route('/shop')
def statistics():
    stop_timer()
    return render_template('shop.html')


# Start timer function (modify as needed)
def start_timer():
    global timer_running, timer
    
    print("timer started 2")

    socketio.emit('timer_update', {'timer': timer})

    while timer_running:

        """
        timer += 1
        print("timer number is " + str(timer))
        socketio.emit('timer_update', {'timer': timer}, namespace='/index')
        time.sleep(1)
        """

        if any(keyboard.is_pressed(key) for key in letter_keys):
            timer += 1
            print("timer number is " + str(timer))
            socketio.emit('timer_update', {'timer': timer})
            time.sleep(0.975)


@app.route('/start_timer')
def start_timer_route():
    global timer_running, timer, savedtime
    print("timer route started")
    timer_running = True

    #if timer != 0:
    #timer = savedtime

    timer_thread = Thread(target=start_timer)
    timer_thread.start()
    return "Timer started."

@app.route('/stop_timer')
def stop_timer():
    global timer_running
    global savedtime
    print("timer stopped")
    timer_running = False
    global timer

    global uid
    print("Stop timer uid = " + str(uid))
    print("Stop timer timer is = " + str(timer))
    if uid != 'XXX':
        # Get the current date in 'YYYY-MM-DD' format
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        user_ref = db.collection('users').document(uid)
        daily_points_ref = user_ref.collection('dailyPoints').document(current_date)
        
        # Update the points for today's date
        daily_points_ref.set({'points': timer}, merge=True)  # Merge is used to update existing points
        savedtime = timer

    return "Timer stopped."
    


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
    app.run(debug=True)
