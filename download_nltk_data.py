# download_nltk_data.py
import nltk

print("--- Starting NLTK Downloader ---")

# List of all the resources your project needs
resources_to_download = [
    'stopwords',
    'punkt',
    'punkt_tab'
]

for resource in resources_to_download:
    try:
        print(f"Checking for resource: {resource}...")
        # A more reliable way to check if a resource is present
        nltk.data.find(f'corpora/{resource}' if resource == 'stopwords' else f'tokenizers/{resource}')
        print(f"Resource '{resource}' already downloaded.")
    except LookupError:
        print(f"Resource '{resource}' not found. Downloading...")
        nltk.download(resource)
        print(f"Successfully downloaded '{resource}'.")

print("\n--- NLTK Downloader Finished ---")
print("All necessary resources should now be available.")