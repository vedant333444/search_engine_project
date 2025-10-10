import os
import json
import pickle
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from flask import Flask, render_template, jsonify, request


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
    nltk.download('punkt_tab')

STOP_WORDS = set(stopwords.words('english'))
STEMMER = PorterStemmer()

def process_query_text(text):
    """Applies the same NLP pipeline to a query string."""
    tokens = word_tokenize(text)
    tokens = [word.lower() for word in tokens]
    words = [word for word in tokens if word.isalpha()]
    words = [word for word in words if not word in STOP_WORDS]
    stems = [STEMMER.stem(word) for word in words]
    return stems

INVERTED_INDEX = {}
TFIDF_SCORES = {}
RAW_CONTENT_DICT = {}

app = Flask(__name__)

def load_search_data():
    global INVERTED_INDEX, TFIDF_SCORES, RAW_CONTENT_DICT
    
    print("Loading search data into Flask app...")
    try:
        with open('inverted_index.pkl', 'rb') as f:
            INVERTED_INDEX = pickle.load(f)
        print(f"Loaded {len(INVERTED_INDEX)} unique words into Inverted Index.")

        with open('tfidf_scores.pkl', 'rb') as f:
            TFIDF_SCORES = pickle.load(f)
        print(f"Loaded TF-IDF scores for {len(TFIDF_SCORES)} documents.")

        with open('data/processed/raw_content_dict.pkl', 'rb') as f:
            RAW_CONTENT_DICT = pickle.load(f)
        print(f"Loaded raw content for {len(RAW_CONTENT_DICT)} documents.")

    except FileNotFoundError as e:
        print(f"FATAL ERROR: Missing data file: {e.filename}")
        print("Please ensure process_data.py and build_index.py have been run successfully.")
        exit()

with app.app_context():
     load_search_data()


@app.route('/search', methods=['POST'])
def search():
    """
    Handles the main search query, retrieves, ranks, and returns results.
    """
    query_text = request.json.get('query', '')
    if not query_text:
        return jsonify({"results": [], "message": "Please enter a query."}), 200

    print(f"Received search query: '{query_text}'")
    
    # 1. Process the query
    processed_query_terms = process_query_text(query_text)
    
    if not processed_query_terms:
        return jsonify({"results": [], "message": "Query contains only stop words or invalid characters."}), 200

    print(f"Processed query terms: {processed_query_terms}")

    # 2. Retrieve candidate documents using the Inverted Index
    candidate_doc_ids = set()
    first_term = True

    for term in processed_query_terms:
        docs_for_term = set(INVERTED_INDEX.get(term, []))
        if not docs_for_term:
            return jsonify({"results": [], "message": f"No results found for '{query_text}'."}), 200
            
        if first_term:
            candidate_doc_ids = docs_for_term
            first_term = False
        else:
            candidate_doc_ids = candidate_doc_ids.intersection(docs_for_term)
        
        if not candidate_doc_ids:
            return jsonify({"results": [], "message": f"No results found for '{query_text}'."}), 200

    if not candidate_doc_ids:
        return jsonify({"results": [], "message": f"No results found for '{query_text}'."}), 200


    # 3. Rank the candidate documents using TF-IDF scores
    ranked_results = []
    for doc_id in candidate_doc_ids:
        doc_score = 0
        for term in processed_query_terms:
            doc_score += TFIDF_SCORES.get(doc_id, {}).get(term, 0)
        
        raw_content = RAW_CONTENT_DICT.get(doc_id, "No content available.")
        snippet = raw_content[:150] + "..." if len(raw_content) > 150 else raw_content
        
        title = doc_id.replace('.txt', '').replace('_', ' ').title()

        ranked_results.append({
            "doc_id": doc_id,
            "title": title,
            "snippet": snippet,
            "score": round(doc_score, 4)
        })

    ranked_results.sort(key=lambda x: x['score'], reverse=True)

    print(f"Found {len(ranked_results)} ranked results for '{query_text}'.")
    return jsonify({"results": ranked_results})

if __name__ == '__main__':
    app.run(debug=True)