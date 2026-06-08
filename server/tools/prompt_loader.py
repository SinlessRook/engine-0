import os

def load_prompt_file(filename):
    """
    Reads the raw string content out of the target text prompt file.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "prompts", filename)
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Configured prompt asset missing: {filename}")
        
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()