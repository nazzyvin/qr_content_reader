import webbrowser
import pyperclip
import os

from downloader import download_file
from actions import DOWNLOADABLE_TYPES, ACTIONS
from parsers import parse_wifi, parse_contact


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


def handle_email(data):
    """Handles email QR codes (mailto: or MATMSG format). """

    address = data
    if data.lower().startswith("mailto:"):
        address = data[7:].split("?")[0]
    elif data.upper().startswith("MATMSG:"):
        for field in data.split(";"):
            if field.upper().startswith("TO:"):
                address = field[3:]

    choice = show_menu("EMAIL")

    if choice == "1":
        webbrowser.open(data)
        return "exit"
    elif choice == "2":
        pyperclip.copy(address)
        print(f"📋 Email copied: {address}")
        return "exit"
    elif choice == "3":
        return "decode"
    elif choice == "4":
        return "exit"


def handle_phone(data):
    """Handles phone number QR codes (tel: format)."""

    number = data[4:] # strip "tel:"

    choice = show_menu("PHONE")

    if choice == "1":
        webbrowser.open(data)
        return "exit"
    elif choice == "2":
        pyperclip.copy(number)
        print(f"📋 Number copied: {number}")
        return "exit"
    elif choice == "3":
        return "decode"
    elif choice == "4":
        return "exit"


def handle_sms(data):
    """Handles SMS QR codes (SMSTO:, sms:, smsto: format)."""

    number = data.split(":", 1)[1].split(":", 1)[0]

    choice = show_menu("SMS")

    if choice == "1":
        webbrowser.open(data)
        return "exit"
    elif choice == "2":
        pyperclip.copy(number)
        print(f"📋 Number copied: {number}")
        return "exit"
    elif choice == "3":
        return "decode"
    elif choice == "4":
        return "exit"


def handle_wifi(data):
    """Handles Wi-Fi QR codes (WIFI: format)."""

    fields = parse_wifi(data)

    choice = show_menu("WIFI")

    if choice == "1":
        print("\n📶 Wi-Fi Network Details\n")
        print(f"Network (SSID): {fields['ssid']}")
        print(f"Security:       {fields['security'] or 'Open'}")
        print(f"Password:       {fields['password']}")
        if fields["hidden"]:
            print("Hidden:          Yes")
        return "exit"
    elif choice == "2":
        pyperclip.copy(fields["password"])
        print("📋 Password copied to clipboard.")
        return "exit"
    elif choice == "3":
        pyperclip.copy(data)
        print("📋 Wi-Fi code copied to clipboard.")
        return "exit"
    elif choice == "4":
        return "decode"
    elif choice == "5":
        return "exit"


def handle_location(data):
    """Handles GPS location QR codes (geo: format)."""

    coordinates = data.split(":", 1)[1]
    latitude, longitude = coordinates.split(",")[:2]
    maps_url = f"https://www.google.com/maps?q={latitude},{longitude}"

    choice = show_menu("LOCATION")

    if choice == "1":
        webbrowser.open(maps_url)
        return "exit"
    elif choice == "2":
        pyperclip.copy(coordinates)
        print(f"📋 Coordinates copied: {coordinates}")
        return "exit"
    elif choice == "3":
        return "decode"
    elif choice == "4":
        return "exit"


def handle_contact(data):
    """Handles vCard (contact) QR codes."""

    contact = parse_contact(data)

    choice = show_menu("CONTACT")

    if choice == "1":
        print("\n👤 Contact Details\n")
        print(f"Name:        {contact['name']}")
        print(f"Phone:       {contact['phone']}")
        print(f"Email:       {contact['email']}")
        print(f"Organization:   {contact['organization']}")
        return "exit"
    elif choice == "2":
        os.makedirs("contacts", exist_ok=True)
        filename = os.path.join("contacts", f"{contact['name'] or 'contact'}.vcf")
        with open(filename, "w", encoding="utf-8") as file:
            file.write(data)
        print(f"💾 Contact saved: {filename}")
        return "exit"
    elif choice == "3":
        pyperclip.copy(data)
        print("📋 vCard copied to clipboard.")
        return "exit"
    elif choice == "4":
        return "decode"
    elif choice == "5":
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
        return handle_url(data)

    elif content_type == "TEXT":
        return handle_text(data)

    elif content_type == "EMAIL":
        return handle_email(data)

    elif content_type == "PHONE":
        return handle_phone(data)

    elif content_type == "SMS":
        return handle_sms(data)

    elif content_type == "WIFI":
        return handle_wifi(data)

    elif content_type == "LOCATION":
        return handle_location(data)

    elif content_type == "CONTACT":
        return handle_contact(data)

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