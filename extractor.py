from decoder import decode_qr_bytes
from detector import detect_content
from parsers import parse_for_type
from actions import ACTIONS


def extract_from_bytes(image_bytes):
    """
    Decodes and analyzes QR content from raw image bytes.

    This is the pure extraction service shared by every interface
    (web backend, CLI, etc.). It has no console or GUI dependencies.

    Args:
        image_bytes (bytes): The raw image data.

    Returns:
        dict: A structured result:
            - success, content_type, content, details, actions
              on success
            - success=False with an error message on failure
    """

    content = decode_qr_bytes(image_bytes)

    if content is None:
        return {"success": False, "error": "No QR codes found in the image."}

    content_type = detect_content(content)
    details = parse_for_type(content_type, content)
    actions = ACTIONS.get(content_type, [])

    return {
        "success": True,
        "content_type": content_type,
        "content": content,
        "details": details,
        "actions": actions
    }