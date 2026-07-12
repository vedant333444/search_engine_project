# 🔍 Advanced VR Search Engine

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-3.x-green)
![NLTK](https://img.shields.io/badge/NLTK-NLP-orange)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Overview

Advanced VR Search Engine is a web-based information retrieval system developed using Flask and NLTK. The project demonstrates the implementation of core search engine concepts such as document preprocessing, inverted indexing, TF-IDF ranking, and query processing through a modern web interface.

---

## ✨ Features

- Document preprocessing using NLTK
- Tokenization, Stopword Removal & Stemming
- Inverted Index construction
- TF-IDF based document ranking
- Fast keyword search
- Responsive Bootstrap interface
- About and Contact pages
- Custom website shortcuts

---

## 🛠️ Tech Stack

- **Backend:** Flask, Python
- **NLP:** NLTK
- **Information Retrieval:** Inverted Index, TF-IDF
- **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript

---

## 🏗️ System Architecture

```mermaid
flowchart TD

    A[👤 User] --> B[🌐 Web Browser]

    B --> C[🎨 Frontend<br/>HTML + CSS + JavaScript]

    C --> D[⚙️ Flask Backend]

    D --> E[📝 Query Preprocessing]

    E --> E1[Tokenization]
    E1 --> E2[Lowercase Conversion]
    E2 --> E3[Stopword Removal]
    E3 --> E4[Porter Stemming]

    E4 --> F[📚 Inverted Index]

    F --> G[🔎 Candidate Document Retrieval]

    G --> H[📊 TF-IDF Ranking]

    H --> I[(Pickle Files)]

    I --> J[📄 Ranked Search Results]

    J --> C

    C --> K[👤 Display Results]
```

---

## ⚙️ Data Processing Workflow

```mermaid
flowchart LR

A[Raw Documents]
--> B[Text Preprocessing]

B --> C[Tokenization]

C --> D[Stopword Removal]

D --> E[Porter Stemming]

E --> F[Build Inverted Index]

F --> G[Calculate TF-IDF]

G --> H[Store Pickle Files]

H --> I[Flask Search API]
```

---

## Screenshots

<img width="1918" height="967" alt="image" src="https://github.com/user-attachments/assets/0f2bf6fc-e6ab-4350-8ef3-a1c0bf2da526" />
<img width="1898" height="562" alt="image" src="https://github.com/user-attachments/assets/8fbe1b70-a7c1-4325-9074-1035a261a1e4" />
<img width="1918" height="971" alt="image" src="https://github.com/user-attachments/assets/bb335874-bcad-4fea-83a3-84403d516089" />
<img width="1918" height="971" alt="image" src="https://github.com/user-attachments/assets/9732f1da-bb74-4439-892a-b6077f0cc76c" />

---

## 🚀 Installation

```bash
git clone https://github.com/vedant333444/search_engine_project.git

cd search_engine_project

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

## 🌐 Live Demo

**Try the application here:**

https://vr-search-engine.onrender.com

---

## 📁 Project Structure

```text
search_engine_project/
│
├── app.py
├── build_index.py
├── calculate_tfidf.py
├── process_data.py
├── convert_csv_to_txt.py
├── download_nltk_data.py
│
├── data/
│   ├── raw/
│   └── processed/
│
├── static/
│   ├── style.css
│   └── script.js
│
├── templates/
│   ├── index.html
│   ├── about.html
│   └── contact.html
│
├── README.md
├── requirements.txt
├── .gitignore
└── LICENSE
```

---

## 🚀 Future Improvements

- Autocomplete Suggestions
- Boolean Search
- Phrase Search
- Wildcard Search
- Spell Correction
- Voice Search
- Semantic Search using Sentence Transformers
- Elasticsearch Integration

---

## 👨‍💻 Authors

- Vedant Singhal
- Ravi Kumar

---

## 📄 License

This project is licensed under the MIT License.

