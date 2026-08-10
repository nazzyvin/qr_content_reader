import cv2
import numpy as np

from io import BytesIO
from PIL import Image


try:
    from pyzbar.pyzbar import decode as __pyzbar_decode
    HAVE_PYZBAR = True
except Exception:
    HAVE_PYZBAR = False


def _to_text(raw):
    """Decode bytes to text, tolerating byte-mode QR payloads."""

    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        try:
            return raw.decode("latin-1")
        except Exception:
            return raw.decode("utf-8", errors="replace")


def _load_image(image_bytes):
    """
    Decode image bytes into an OpenCV image.

    Small images are upscaled with INTER_NEAREST because OpenCV's QR
    detector returns an empty string on higher-version codes, and both
    decoders are unreliable on tiny module-sized images.
    """

    image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        return None

    height, width = image.shape[:2]
    if min(height, width) < 300:
        scale = max(300 / min(height, width), 1.0)
        image = cv2.resize(image, None, fx=scale, fy=scale,
                           interpolation=cv2.INTER_NEAREST)

    return image


def decode_all_bytes(image_bytes):
    """
    Decode every QR code or barcode found in image bytes.

    Args:
        image_bytes (bytes): The raw image data.

    Returns:
        list[str]: All decoded contents found in the image.
    """

    image = _load_image(image_bytes)
    if image is None:
        return []

    # Primary: pyzbar handles QR codes and many other barcode formats
    if HAVE_PYZBAR:
        try:
            results = __pyzbar_decode(
                Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
            )
            if results:
                return [_to_text(result.data) for result in results]
        except Exception:
            pass

    # Fallback: OpenCV QR-only decoding (works even if libzbar0 is missing)
    detector = cv2.QRCodeDetector()
    ok, decoded, _, _ = detector.detectAndDecodeMulti(image)
    if ok:
        return [text for text in decoded if text]

    single = detector.detectAndDecode(image)[0]
    return [single] if single else []


def decode_qr_bytes(image_bytes):
    """
    Decode the first QR code or barcode found in image bytes.

    Args:
        image_bytes (bytes): The raw image data.

    Returns:
        str | None: The decoded content, or None if nothing was found.
    """

    contents = decode_all_bytes(image_bytes)
    return contents[0] if contents else None


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