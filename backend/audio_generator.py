import nltk
from gtts import gTTS
from PyPDF2 import PdfReader

nltk.download("words")

from nltk.corpus import words

word_set = set(words.words())

def extract_text(pdf_path: str) -> str:
    """
        Extarcts text from the pdf file, and returns them.
        
        Parameters:
        pdf_path (string) - path to the pdf file.
        
        Returns:
        str - extracted text from the pdf file.
    """
    
    try:
        reader = PdfReader(pdf_path)
        
        extracted_text = []
        for page in reader.pages:
            if page.extract_text():
                extracted_text.append(page.extract_text())
        
        raw_text = "\n".join(extracted_text)
        
        return raw_text.strip()
    except Exception as e:
        return f"An error occured: {str(e)}"

def text_to_audio(text: str, out_file_name: str, lang: str = "en") -> None:
    """
        converts the given text into audio file.
        
        Parameters:
        text (string) - text to convert.
        out_file_name (string) - name or path to save the audio file.
        lang (string) - language
        
        Returns:
        Saves the file in the given path.
    """
    splits = text.split(".")
    splits = [split.replace("\n", " ") for split in splits]
    splits = [split.replace("**", "") for split in splits]
    text = "\n".join(splits)
    try:
        tts = gTTS(text=text, lang=lang)
        
        tts.save(out_file_name)
        return f"Audio file saved as: {out_file_name}"
    except Exception as e:
        return f"An error occurred: {str(e)}"

if __name__ == "__main__":
    pdf_file_path = "./sample/pdf2 .pdf"
    text = extract_text(pdf_file_path)
    print(text)
    text_to_audio(text, "./sample/audio.mp3")