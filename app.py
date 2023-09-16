
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import keyboard
import time
from threading import Thread
from flask_sockets import Sockets

from flask_socketio import SocketIO, emit

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
        except auth.AuthError as e:
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

@app.route('/retrieve_points', methods=['GET'])
def retrieve_points():
    global uid
    uid = request.args.get('uid')  # Get user_id from request
    user_ref = db.collection('users').document(uid)
    doc = user_ref.get()

    global timer

    if doc.exists:
        points = doc.to_dict().get('points')
        
        timer = points
        
        print("retrieved points: " + str(timer))
        return jsonify({'points': points}), 200
    else:
        # User not found, create a new user document with some initial data
        initial_data = {
            'points': 0,  # You can initialize points to any default value
            # Add other user data as needed
        } 
        timer = 0
        user_ref.set(initial_data)
        print("retrieved (and set) points: " + str(timer));
        return jsonify({'points': 0}), 200  # Return the initial data for the new user



@app.route('/index')
def index():
    stop_timer()
    return render_template('index.html')


@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')


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
    if uid != 'XXX':
        user_ref = db.collection('users').document(uid)
        user_ref.set({'points': timer}, merge=True)  # Merge is used to update existing points
        savedtime = timer
    
    return "Timer stopped."


@app.route('/logout_timer')
def logout_timer():
    global timer_running
    global timer
    global uid

    timer = 0
    uid = 'XXX'
    timer_running = False
 
    return "Logout Timer stopped."







"""
@app.route('/save_points', methods=['POST'])
def save_points():
    user_id = request.json.get('user_id')  # Get user_id from JSON request
    new_points = request.json.get('new_points')  # Get new_points from JSON request
    
    if user_id and new_points is not None:
        user_ref = db.collection('users').document(user_id)
        user_ref.set({'points': new_points}, merge=True)  # Merge is used to update existing points
        
        return jsonify({'message': 'Points saved successfully'}), 200
    else:
        return jsonify({'error': 'Invalid data'}), 400
"""



if __name__ == "__main__":
    app.run(debug=True)
