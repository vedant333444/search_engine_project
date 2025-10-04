# build_index.py
import json
import pickle
from collections import defaultdict

# --- Configuration ---
PROCESSED_DATA_FILE = 'data/processed/processed_data.json'
INVERTED_INDEX_FILE = 'inverted_index.pkl' # We save with .pkl for pickle files
# --- End of Configuration ---

def build_inverted_index():
    """
    Reads the processed data and builds an inverted index.
    The index maps each word to a list of document IDs that contain the word.
    """
    print("Loading processed data...")
    try:
        with open(PROCESSED_DATA_FILE, 'r', encoding='utf-8') as f:
            processed_data = json.load(f)
    except FileNotFoundError:
        print(f"ERROR: The file {PROCESSED_DATA_FILE} was not found.")
        print("Please run process_data.py first to generate the clean data.")
        return

    print("Building the Inverted Index...")
    # Using defaultdict is a convenient way to handle the first time we see a word.
    # It automatically creates a new list for a word if it's not already in the index.
    inverted_index = defaultdict(list)

    # Iterate through each document and its list of processed words.
    for doc_id, words in processed_data.items():
        # For each word in the current document...
        for word in words:
            # ...add the document's ID to that word's list in the index.
            # We add a check to make sure we don't add duplicate doc_ids
            # if a word appears multiple times in the same document.
            if doc_id not in inverted_index[word]:
                inverted_index[word].append(doc_id)
    
    print(f"Inverted Index built successfully. It contains {len(inverted_index)} unique words.")
    
    # Save the inverted index to a file using pickle for fast loading.
    print(f"Saving Inverted Index to {INVERTED_INDEX_FILE}...")
    with open(INVERTED_INDEX_FILE, 'wb') as f:
        # 'wb' means "write binary" which is required for pickle.
        pickle.dump(inverted_index, f)
        
    print("Saving complete.")

if __name__ == '__main__':
    build_inverted_index()