import keyboard
import time


letter_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
               'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

def start_timer():
    timer = 1
    while True:

        if keyboard.is_pressed('esc'):
            print("Programme exited, typebits earned: " + str(timer));
            break
        
        if any(keyboard.is_pressed(key) for key in letter_keys):
            print("Time passed: " + str(timer) + " typebits", end="\r");
            timer += 1
            time.sleep(0.975)
        else:
            time.sleep(0.1)

start_timer()



