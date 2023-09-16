import tkinter as tk
import threading
import keyboard
import time

letter_keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
               'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

class TimerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Timer App")
        
        self.timer_value = 0
        self.running = False
        
        self.timer_label = tk.Label(root, text="Time passed: 0 typebits")
        self.timer_label.pack(pady=20)
        
        self.start_button = tk.Button(root, text="Start", command=self.start_timer)
        self.start_button.pack()
        
        self.stop_button = tk.Button(root, text="Stop", command=self.stop_timer)
        self.stop_button.pack()
        
        self.exit_button = tk.Button(root, text="Exit", command=self.exit_program)
        self.exit_button.pack()

    def update_timer_label(self):
        while self.running:
            self.timer_label.config(text=f"Time passed: {self.timer_value} typebits")
            time.sleep(0.1)
    
    def start_timer(self):
        if not self.running:
            self.running = True
            self.timer_thread = threading.Thread(target=self.update_timer_label)
            self.timer_thread.start()
            self.detect_keypress()

    def detect_keypress(self):
        while self.running:
            if any(keyboard.is_pressed(key) for key in letter_keys):
                self.timer_value += 1
                time.sleep(1)
            else:
                time.sleep(0.1)
    
    def stop_timer(self):
        self.running = False
    
    def exit_program(self):
        self.running = False
        self.root.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    app = TimerApp(root)
    root.mainloop()
