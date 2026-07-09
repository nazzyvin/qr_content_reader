from pyzbar.pyzbar import decode
from PIL import Image


def decode_qr(image_path):
    """
    Reads a QR code from an image and returns its decoded content.

    Args:
        image_path (str): Path to the image containing the QR code.

    Returns:
        str | None:
            - The decoded QR code data as a string if successful.
            - None if no QR code is found or an error occurs.
    """
    try:
        # Open the image from the specified file path
        image = Image.open(image_path)

        # Detect and decode any QR codes in the image
        decoded = decode(image)

        # Return None if no QR code was found
        if not decoded:
            return None

        # Return the data from the first detected QR code as a UTF-8 string
        return decoded[0].data.decode("utf-8")

    except FileNotFoundError:
        # Handle the case where the image file doesn't exist
        print("❌ File not found.")
        return None

    except Exception as e:
        # Handle any other unexpected errors
        print(f"❌ {e}")
        return None