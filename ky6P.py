import tkinter as tk
import keyboard
import time
from threading import Thread

class TypingTimerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Typing Timer")
        
        self.timer_label = tk.Label(root, text="Time passed: 0 typebits")
        self.timer_label.pack()

        self.start_button = tk.Button(root, text="Start", command=self.start_timer)
        self.start_button.pack()

        self.exit_button = tk.Button(root, text="Exit", command=self.exit_program)
        self.exit_button.pack()

        self.letter_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                           'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

        self.timer_running = False
        self.timer = 0

    def start_timer(self):
        self.timer_running = True
        self.timer = 0
        self.update_timer_label()

        def timer_thread():
            while self.timer_running:
                if any(keyboard.is_pressed(key) for key in self.letter_keys):
                    self.timer += 1
                    self.update_timer_label()
                time.sleep(0.975)

        self.timer_thread = Thread(target=timer_thread)
        self.timer_thread.start()

    def update_timer_label(self):
        self.timer_label.config(text=f"Time passed: {self.timer} typebits")
        self.timer_label.update_idletasks()

    def exit_program(self):
        self.timer_running = False
        self.root.quit()

if __name__ == "__main__":
    root = tk.Tk()
    app = TypingTimerApp(root)
    root.mainloop()
