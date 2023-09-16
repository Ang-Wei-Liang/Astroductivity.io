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

timer = TypingTimer()
Thread(target=timer.check_interval).start()

keyboard.on_press(lambda event: timer.update_last_key_time())

print("Type something to start the timer. Press Ctrl+C to exit.")
keyboard.wait("esc")
