# process_data.py
import os
import json
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import pickle 


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
    processed_data_file = 'data/processed/processed_data.json'
    raw_content_file = 'data/processed/raw_content_dict.pkl' # <--- NEW FILE PATH
    
    processed_data = {} # Dictionary to store {doc_id: [processed_words]}
    raw_content_dict = {} # <--- NEW: Dictionary to store {doc_id: raw_text}

    print("Starting data processing...")
    # Loop through each file in the raw data directory
    for filename in os.listdir(raw_data_path):
        if filename.endswith(".txt"):
            file_path = os.path.join(raw_data_path, filename)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
                # Store raw content
                raw_content_dict[filename] = content # <--- STORE RAW CONTENT
                
                processed_words = process_text(content)
                processed_data[filename] = processed_words
    
    # Save the processed words data
    with open(processed_data_file, 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, indent=4)
    
    # Save the raw content dictionary <--- NEW SAVE STEP
    with open(raw_content_file, 'wb') as f: # Use 'wb' for pickle
        pickle.dump(raw_content_dict, f)
        
    print(f"Processing complete. {len(processed_data)} documents processed.")
    print(f"Clean data saved to: {processed_data_file}")
    print(f"Raw content saved to: {raw_content_file}") # <--- NEW PRINT
if __name__ == '__main__':
    main()