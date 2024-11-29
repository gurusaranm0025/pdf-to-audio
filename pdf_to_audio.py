import subprocess
import os

def start_app():
    curr_dir = os.path.dirname(__file__)
    
    path1 = os.path.join(curr_dir, "frontend")
    path2 = os.path.join(curr_dir, "backend")
    
    print("Open this URL in any browser ==> http://localhost:6060")
    
    process1 = subprocess.Popen(['pnpm', 'preview'], 
                                cwd=path1,
                                stdout=subprocess.DEVNULL,
                            )
    process2 = subprocess.Popen(['python', '-m', 'gunicorn', '--config', 'gunicorn_config.py', 'app:app'], 
                                cwd=path2,
                                stdout=subprocess.DEVNULL,
                                stderr=subprocess.DEVNULL
                            )
    
    process1.wait()
    process2.wait()

if __name__ == "__main__":
    start_app()