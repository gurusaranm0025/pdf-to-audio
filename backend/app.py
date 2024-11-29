from flask import Flask, request, jsonify, send_file
import os

from audio_generator import extract_text, text_to_audio

app = Flask(__file__)

AUDIO_FOLDER = "audio"
AUDIO_FILE = "audio.mp3"
BUCKET = "uploads"

if not os.path.exists(BUCKET):
    os.makedirs(BUCKET)

app.config["BUCKET"] = BUCKET

@app.route("/generate", methods=['POST'])
def generate():
    
    if "file" not in request.files:
        return jsonify({"message": "No file part in the request"}), 400

    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400
    
    if not file.filename.endswith(".pdf"):
        return jsonify({"message": "Only PDF files are allowed."}), 400
    
    print(file.filename)
    
    file_path = os.path.join(app.config["BUCKET"], file.filename)
    
    try:
        file.save(file_path)
        
        text = extract_text(file_path)
        
        text_to_audio(text, out_file_name=os.path.join(AUDIO_FOLDER, AUDIO_FILE))
        
        os.remove(file_path)
        
        return send_file(os.path.join(AUDIO_FOLDER, AUDIO_FILE), as_attachment=True)
        
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=8000)
    
    