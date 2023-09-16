import keyboard
import time
from threading import Thread

class TypingTimer:
    def __init__(self):
        self.start_time = None
        self.is_typing = False
        self.timer_thread = None
        self.paused_time = 0

    def start_timer(self, event):
        if not self.is_typing:
            self.start_time = time.time()
            self.is_typing = True
            self.timer_thread = Thread(target=self.update_timer)
            self.timer_thread.start()

    def update_timer(self):
        while self.is_typing:
            elapsed_time = time.time() - self.start_time - self.paused_time
            print(f"Timer: {int(elapsed_time)} seconds", end="\r")
            time.sleep(1)

    def pause_timer(self, event):
        if self.is_typing:
            self.is_typing = False
            self.paused_time = time.time() - self.start_time
            print("\nTimer paused")

    def resume_timer(self, event):
        if not self.is_typing:
            self.start_timer(event)
            print("Timer resumed")

def main():
    typing_timer = TypingTimer()
    keyboard.on_press(typing_timer.start_timer)
    keyboard.on_press_key('a', typing_timer.pause_timer)
    keyboard.on_press_key('b', typing_timer.resume_timer)

    print("Start typing to begin the timer.")
    print("Press Enter to resume the timer after a pause.")
    print("Press Esc to pause the timer.")

    keyboard.wait('esc')  # Wait for the Esc key to exit the program

if __name__ == "__main__":
    main()
