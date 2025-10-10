# calculate_tfidf.py
import json
import math
import pickle
from collections import defaultdict

# --- Configuration ---
PROCESSED_DATA_FILE = 'data/processed/processed_data.json'
INVERTED_INDEX_FILE = 'inverted_index.pkl'
TFIDF_SCORES_FILE = 'tfidf_scores.pkl'
# --- End of Configuration ---

def calculate_tfidf():
    """
    Calculates and saves the TF-IDF scores for each word in each document.
    """
    print("Loading processed data and inverted index...")
    try:
        with open(PROCESSED_DATA_FILE, 'r', encoding='utf-8') as f:
            processed_data = json.load(f)
        with open(INVERTED_INDEX_FILE, 'rb') as f:
            inverted_index = pickle.load(f)
    except FileNotFoundError as e:
        print(f"ERROR: A required file was not found: {e.filename}")
        print("Please run process_data.py and build_index.py first.")
        return

    total_documents = len(processed_data)
    tfidf_scores = defaultdict(dict) # Structure: {doc_id: {word: score}}

    print("Calculating TF-IDF scores...")
    # Iterate through each document in our dataset.
    for doc_id, words in processed_data.items():
        total_words_in_doc = len(words)
        
        # Use a temporary dictionary to count word frequencies for the current doc.
        word_counts = defaultdict(int)
        for word in words:
            word_counts[word] += 1
            
        # Now, calculate TF-IDF for each unique word in the document.
        for word, count in word_counts.items():
            # 1. Calculate Term Frequency (TF)
            # How often does this word appear in this one document?
            tf = count / total_words_in_doc
            
            # 2. Calculate Inverse Document Frequency (IDF)
            # How rare is this word across all documents?
            # We get the number of documents containing the word from our inverted index.
            num_docs_with_word = len(inverted_index.get(word, []))
            
            # Add 1 to the denominator to avoid division by zero if a word is not in the index (should not happen).
            idf = math.log(total_documents / (1 + num_docs_with_word))
            
            # 3. Calculate the final TF-IDF score
            tfidf = tf * idf
            
            # Store the score
            tfidf_scores[doc_id][word] = tfidf

    print(f"TF-IDF calculation complete for {len(tfidf_scores)} documents.")
    
    # Save the TF-IDF scores to a file using pickle.
    print(f"Saving TF-IDF scores to {TFIDF_SCORES_FILE}...")
    with open(TFIDF_SCORES_FILE, 'wb') as f:
        pickle.dump(tfidf_scores, f)
        
    print("Saving complete.")

if __name__ == '__main__':
    calculate_tfidf()