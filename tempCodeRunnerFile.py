# process_data.py
import os
import json
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# --- NLTK Setup: Run these lines once to download necessary data ---
try:
    stopwords.words('english')
except LookupError:
    print("Downloading NLTK stopwords...")
    nltk.download('stopwords')
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    print("Downloading NLTK punkt tokenizer...")
    nltk.download('punkt')
# --- End of Setup ---

def process_text(text):
    """Applies the full NLP pipeline to a single string of text."""
    # 1. Tokenize: Split text into a list of words.
    tokens = word_tokenize(text)

    # 2. Lowercase all words.
    tokens = [word.lower() for word in tokens]

    # 3. Remove punctuation and non-alphabetic characters.
    words = [word for word in tokens if word.isalpha()]

    # 4. Remove stop words.
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if not word in stop_words]

    # 5. Stemming: Reduce words to their root form.
    stemmer = PorterStemmer()
    stems = [stemmer.stem(word) for word in words]

    return stems

def main():
    """Main function to run the data processing pipeline."""
    raw_data_path = 'data/raw'
    processed_data_path = 'data/processed/processed_data.json'
    
    processed_data = {} # Dictionary to store {doc_id: [processed_words]}

    print("Starting data processing...")
    # Loop through each file in the raw data directory
    for filename in os.listdir(raw_data_path):
        if filename.endswith(".txt"):
            file_path = os.path.join(raw_data_path, filename)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                processed_words = process_text(content)
                processed_data[filename] = processed_words
    
    # Save the processed data to a single JSON file
    with open(processed_data_path, 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, indent=4)
        
    print(f"Processing complete. {len(processed_data)} documents processed.")
    print(f"Clean data saved to: {processed_data_path}")

if __name__ == '__main__':
    main()