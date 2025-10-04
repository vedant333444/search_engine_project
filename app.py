# app.py
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    """Renders the main search page."""
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    """
    PLACEHOLDER: Handles the main search query.
    Later, this will return ranked results.
    """
    query = request.json.get('query', '')
    print(f"Received search query: {query}")
    # Dummy response for Person B to work with
    return jsonify({
        "results": [
            {"title": "Document 1", "snippet": "This is a dummy result...", "score": 0.9},
            {"title": "Document 2", "snippet": "Another dummy result...", "score": 0.8}
        ],
        "query_terms": ["dummy", "result"]
    })

@app.route('/autocomplete', methods=['POST'])
def autocomplete():
    """
    PLACEHOLDER: Handles autocomplete suggestions.
    Later, this will use the Trie.
    """
    prefix = request.json.get('prefix', '')
    print(f"Received autocomplete prefix: {prefix}")
    # Dummy response for Person B to work with
    return jsonify(["suggestion1", "suggestion2", "suggestion3"])

if __name__ == '__main__':
    app.run(debug=True)