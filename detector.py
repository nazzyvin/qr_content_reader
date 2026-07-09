def detect_content(data):
    """
    Determines the type of content contained in a QR code.

    Args:
        data (str): The decoded QR code content.

    Returns:
        str: A string representing the detected content type.
             Possible values include:
             - UNKNOWN
             - URL
             - IMAGE
             - AUDIO
             - VIDEO
             - PDF
             - WORD
             - EXCEL
             - POWERPOINT
             - ZIP
             - RAR
             - TEXT
    """

    # Return UNKNOWN if the QR code contains no data
    if not data:
        return "UNKNOWN"

    # Check if the content is a URL
    if data.startswith(("http://", "https://")):

        # Convert the URL to lowercase and remove query parameters
        # (e.g., ?download=true) so file extensions can be detected correctly
        clean_url = data.lower().split("?")[0]

        # Check if the URL points to an image
        if clean_url.endswith((".png", ".jpg", ".jpeg", ".gif", ".webp")):
            return "IMAGE"

        # Check if the URL points to an audio file
        elif clean_url.endswith((".mp3", ".wav", ".ogg")):
            return "AUDIO"

        # Check if the URL points to a video file
        elif clean_url.endswith((".mp4", ".avi", ".mov", ".mkv")):
            return "VIDEO"

        # Check if the URL points to a PDF document
        elif clean_url.endswith(".pdf"):
            return "PDF"

        # Check if the URL points to a Word document
        elif clean_url.endswith((".doc", ".docx")):
            return "WORD"

        # Check if the URL points to an Excel spreadsheet
        elif clean_url.endswith((".xls", ".xlsx")):
            return "EXCEL"

        # Check if the URL points to a PowerPoint presentation
        elif clean_url.endswith((".ppt", ".pptx")):
            return "POWERPOINT"

        # Check if the URL points to a ZIP archive
        elif clean_url.endswith(".zip"):
            return "ZIP"

        # Check if the URL points to a RAR archive
        elif clean_url.endswith(".rar"):
            return "RAR"

        # If it's a URL but doesn't match any known file type
        return "URL"

    # If the data is not a URL, treat it as plain text
    return "TEXT"