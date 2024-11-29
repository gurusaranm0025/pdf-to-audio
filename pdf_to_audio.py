import subprocess
import os

def start_app():
    curr_dir = os.path.dirname(__file__)
    
    path1 = os.path.join(curr_dir, "frontend")
    path2 = os.path.join(curr_dir, "backend")
    
    process1 = subprocess.Popen(['pnpm', 'preview'], cwd=path1)
    process2 = subprocess.Popen(['python', 'app.py'], cwd=path2)
    
    process1.wait()
    process2.wait()
    

if __name__ == "__main__":
    start_app()