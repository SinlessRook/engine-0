import os
from flask import jsonify

def get_raw_syllabus(filename):
    """
    Reads the raw text of a markdown syllabus file and returns it.
    Raises FileNotFoundError if the file doesn't exist.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "syllabus", filename)
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Syllabus file '{filename}' not found.")
        
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()
        
    return {
        "filename": filename,
        "content": content
    }

if __name__ == "__main__":
    # Test execution
    test_filename = "DSA.md"
    
    try:
        syllabus_data = get_raw_syllabus(test_filename)
        print("Syllabus Data:", syllabus_data)
        print("Syllabus file read successfully!")
    except FileNotFoundError as e:
        print(e)