# Import necessary modules
import os              # For file path operations (joining paths, getting filenames)
import requests        # For making HTTP requests to download files from the internet


def download_file(url):
    """
    Download a file from a URL and save it to the 'downloads' folder.
    
    Args:
        url (str): The web address of the file to download
    
    Returns:
        bool: True if download was successful, False if it failed
    """

    try:
        # --- Step 1: Download the file from the internet ---
        # Send a GET request to the URL to fetch the file
        # Example: requests.get("https://example.com/image.png")
        response = requests.get(url)

        # --- Step 2: Check if download was successful ---
        # Status code 200 means "OK" - the server returned the file successfully
        # Any other status code (404, 500, etc.) means an error occurred
        if response.status_code != 200:
            print("❌ Download failed.")  # Notify user of failure
            return False                   # Exit function and indicate failure

        # --- Step 3: Extract the filename from the URL ---
        # Get the base filename from the URL
        # Example: "https://example.com/images/photo.png?v=1" -> "photo.png"
        # .basename() gets the last part after the last slash
        # .split("?")[0] removes any query parameters (like ?v=1)
        filename = os.path.basename(url.split("?")[0])

        # --- Step 4: Create the full file path ---
        # Combine the 'downloads' folder with the filename
        # Example: "downloads/photo.png"
        # This works on both Windows (\) and Mac/Linux (/)
        filepath = os.path.join("downloads", filename)

        # --- Step 5: Save the downloaded content to disk ---
        # Open the file in binary write mode ('wb') for non-text files
        # "with" ensures the file is properly closed even if an error occurs
        with open(filepath, "wb") as file:
            # Write the downloaded content (binary data) to the file
            # response.content contains the actual file data
            file.write(response.content)

        # --- Step 6: Notify user of success ---
        print(f"✅ Downloaded: {filename}")  # Tell user which file was downloaded

        return True  # Return True to indicate successful download

    except Exception as e:
        # --- Error Handling: Something went wrong ---
        # This catches ANY exception that occurs during the download process
        # Examples: network errors, invalid URLs, permission issues, etc.
        print(f"❌ {e}")  # Display the specific error message

        return False  # Return False to indicate download failed