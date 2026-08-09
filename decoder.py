import cv2
import numpy as np

from io import BytesIO
from PIL import Image


try:
    from pyzbar.pyzbar import decode as __pyzbar_decode
    HAVE_PYZBAR = True
except Exception:
    HAVE_PYZBAR = False


def decode_qr_bytes(image_bytes):
    """Decodes QR codes and many other barcode formats from image bytes."""

    # Try pyzbar first: QR + Code 128/39, EAN-13/8, UPC-A/E, ITF, etc.
    if HAVE_PYZBAR:
        try:
            result = __pyzbar_decode(Image.open(BytesIO(image_bytes)))
            if result:
                return result[0].data.decode("utf-8")
        except Exception:
            pass

    # Fall back to OpenCV QR-only detection (still works if libzbar0 is missing)
    image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    if image is not None:
        decoded, _, _ = cv2.QRCodeDetector().detectAndDecode(image)
        if decoded:
            return decoded

    return None


def decode_qr(image_path):
    """Reads a QR/barcode from an image file. Kept for the CLI."""
    try:
        with open(image_path, "rb") as file:
            return decode_qr_bytes(file.read())
    except FileNotFoundError:
        print("❌ File not found.")
        return None
    except Exception as e:
        print(f"❌ {e}")
        return None