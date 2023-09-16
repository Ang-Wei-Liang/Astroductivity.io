import keyboard
import time
from threading import Thread

class TypingTimer:
    def __init__(self):
        self.typing_timer = None
        self.last_key_time = None

    def start_timer(self):
        self.typing_timer = time.time()
        self.last_key_time = self.typing_timer
        print("Timer started.")

    def update_last_key_time(self):
        self.last_key_time = time.time()

    def check_interval(self):
        while True:
            if self.last_key_time is not None:
                current_time = time.time()
                if current_time - self.last_key_time > 8:
                    print("Timer paused.")
                    self.typing_timer = None
                else:
                    if self.typing_timer is None:
                        print("Timer resumed.")
                        self.start_timer()
            time.sleep(1)

def esc_listener():
    keyboard.wait("esc")
    print("Exiting...")
    global is_running
    is_running = False

def countdown_timer(seconds):
    for i in range(seconds, 0, -1):
        if is_running:
            print(i)
            time.sleep(1)

# Start the timer and countdown when user types something
is_running = True
timer = TypingTimer()
Thread(target=timer.check_interval).start()
Thread(target=esc_listener).start()

print("Type something to start the timer. Press Ctrl+C to exit.")

keyboard.wait()  # Wait for user to type something

# Start countdown for 10 seconds immediately after typing
countdown_timer(10)

# Allow user to enter new commands
while is_running:
    command = input("Enter a new command or type 'exit' to quit: ")
    if command.lower() == "exit":
        is_running = False
        print("Exiting...")
        break
