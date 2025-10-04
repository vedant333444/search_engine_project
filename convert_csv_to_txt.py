# convert_csv_to_txt.py
import csv
import os

# --- Configuration ---
# The path to your source CSV file.
CSV_FILE_PATH = 'data/raw/articles.csv' 
# The directory where you want to save the new .txt files.
OUTPUT_DIR = 'data/raw' 
# The name of the column in your CSV that contains the article text.
# IMPORTANT: Open the CSV to check the exact column name! It might be 'content', 'text', 'article', etc.
CONTENT_COLUMN_NAME = 'content' 
# The maximum number of files to create.
MAX_FILES_TO_CREATE = 500 
# --- End of Configuration ---


def convert_csv_to_txt():
    """
    Reads a large CSV file and extracts the content from a specified column,
    saving each entry as a separate .txt file.
    """
    print(f"Starting conversion of {CSV_FILE_PATH}...")

    # Ensure the output directory exists.
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    try:
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8', errors='ignore') as infile:
            # Use DictReader to easily access columns by name.
            reader = csv.DictReader(infile)
            
            for i, row in enumerate(reader):
                if i >= MAX_FILES_TO_CREATE:
                    print(f"Reached the limit of {MAX_FILES_TO_CREATE} files. Stopping.")
                    break
                
                # Construct a unique filename for each article.
                output_filename = f"doc_{i+1}.txt"
                output_filepath = os.path.join(OUTPUT_DIR, output_filename)
                
                try:
                    # Get the article content from the specified column.
                    content = row[CONTENT_COLUMN_NAME]
                    
                    # Write the content to the new .txt file.
                    with open(output_filepath, 'w', encoding='utf-8') as outfile:
                        outfile.write(content)

                except KeyError:
                    print(f"ERROR: Column '{CONTENT_COLUMN_NAME}' not found in the CSV.")
                    print("Please check the CSV header and update the CONTENT_COLUMN_NAME variable.")
                    return # Stop the script if the column is wrong.
                except Exception as e:
                    print(f"An error occurred while processing row {i+1}: {e}")

            print(f"\nConversion complete. {i} .txt files created in '{OUTPUT_DIR}'.")

    except FileNotFoundError:
        print(f"ERROR: The file {CSV_FILE_PATH} was not found.")
        print("Please make sure the CSV file is in the correct directory.")

if __name__ == '__main__':
    convert_csv_to_txt()