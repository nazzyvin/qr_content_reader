import webbrowser
import pyperclip

from downloader import download_file


# Content types that support downloading
DOWNLOADABLE_TYPES = [
    "IMAGE",
    "AUDIO",
    "VIDEO",
    "PDF",
    "WORD",
    "EXCEL",
    "POWERPOINT"
]


# Common actions for downloadable files
DOWNLOAD_ACTIONS = [
    "Open",
    "Download",
    "Copy Link"
]


# Maps each content type to its available actions
ACTIONS = {
    "IMAGE": DOWNLOAD_ACTIONS,
    "AUDIO": DOWNLOAD_ACTIONS,
    "VIDEO": DOWNLOAD_ACTIONS,
    "PDF": DOWNLOAD_ACTIONS,
    "WORD": DOWNLOAD_ACTIONS,
    "EXCEL": DOWNLOAD_ACTIONS,
    "POWERPOINT": DOWNLOAD_ACTIONS,

    "URL": [
        "Open Website",
        "Copy Link",
        "Save Link"
    ],

    "TEXT": [
        "Copy Text",
        "Save as TXT"
    ]
}


def handle_downloadable(file_type, data):
    """
    Handles downloadable content by displaying a menu of actions.

    Args:
        file_type (str): The type of downloadable file.
        data (str): The URL of the file.
    """

    choice = show_menu(file_type)

    if choice == "1":
        # Open file in browser
        webbrowser.open(data)
        return "exit"

    elif choice == "2":
        # Download file
        download_file(data)
        return "exit"

    elif choice == "3":
        # Copy file link
        pyperclip.copy(data)
        print("📋 Link copied to clipboard.")
        return "exit"

    elif choice == "4":
        return "decode"

    elif choice == "5":
        return "exit"


def handle_url(data):
    """
    Handles regular website URLs.

    Args:
        data (str): The website URL.
    """

    choice = show_menu("URL")

    if choice == "1":
        # Open website
        webbrowser.open(data)
        return "exit"

    elif choice == "2":
        # Copy website link
        pyperclip.copy(data)
        print("📋 Link copied to clipboard.")
        return "exit"

    elif choice == "3":
        # Save link
        with open("saved_links.txt", "a", encoding="utf-8") as file:
            file.write(data + "\n")

        print("💾 Link saved successfully.")
        return "exit"

    elif choice == "4":
        return "decode"

    elif choice == "5":
        return "exit"


def handle_text(data):
    """
    Displays plain text decoded from the QR code.

    Args:
        data (str): The decoded text.
    """

    print(data)
    return "exit"


def handle_content(content_type, data):
    """
    Routes the decoded content to the correct handler.

    Args:
        content_type (str): The detected QR content type.
        data (str): The QR code content.
    """

    if content_type in DOWNLOADABLE_TYPES:
        return handle_downloadable(content_type, data)

    elif content_type == "URL":
        handle_url(data)

    elif content_type == "TEXT":
        handle_text(data)


def show_menu(content_type):
    """
    Displays available actions for a content type.

    Args:
        content_type (str): The detected content type.

    Returns:
        str: User's selection.
    """

    actions = ACTIONS.get(content_type)

    if actions is None:
        print("No actions available.")
        return None

    print("\nAvailable Actions\n")

    for index, action in enumerate(actions, start=1):
        print(f"{index}. {action}")

    print(f"{len(actions) + 1}. Decode Another QR")
    print(f"{len(actions) + 2}. Exit")

    return input("\nChoose an option: ")