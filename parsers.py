
def parse_email(data):
    """Parses mailto: or MATMSG: content into address, subject, and body."""

    address = ""
    subject = ""
    body = ""

    if data.lower().startswith("mailto:"):
        raw = data[7:]
        address = raw.split("?")[0]
        query = raw.split("?", 1)[1] if "?" in raw else ""
        for part in query.split("&"):
            if part.lower().startswith("subject="):
                subject = part[8:]
            elif part.lower().startswith("body="):
                body = part[5:]

    elif data.upper().startswith("MATMSG:"):
        for field in data.split(";"):
            if field.upper().startswith("TO:"):
                address = field[3:]
            elif field.upper().startswith("SUB:"):
                subject = field[4:]
            elif field.upper().startswith("BODY:"):
                body = field[5:]

    return {"address": address, "subject": subject, "body": body}


def parse_phone(data):
    """Parses tel: content into a phone number."""

    return {"number": data[4:] if data.lower().startswith("tel:") else data}


def parse_sms(data):
    """Parses SMSTO:/sms:/smsto: content into a number and message."""

    number = ""
    message = ""

    rest = data.split(":", 1)[1] if ":" in data else ""
    parts = rest.split(":", 1)
    number = parts[0]
    if len(parts) > 1:
        message = parts[1]

    return {"number": number, "message": message}


def parse_wifi(data):
    """Parses WIFI: content into ssid, security, password, and hidden."""

    fields = {"ssid": "", "security": "", "password": "", "hidden": ""}

    data = data[5:] if data.upper().startswith("WIFI:") else data

    for segment in data.split(";"):
        if segment.startswith("T:"):
            fields["security"] = segment[2:]
        elif segment.startswith("S:"):
            fields["ssid"] = segment[2:]
        elif segment.startswith("P:"):
            fields["password"] = segment[2:]
        elif segment.startswith("H:"):
            fields["hidden"] = segment[2:]

    return fields


def parse_location(data):
    """Parses geo: content into latitude, longitude, and a maps URL."""

    coordinates = data.split(":", 1)[1] if ":" in data else data
    parts = coordinates.split(",")

    latitude = parts[0].strip() if parts else ""
    longitude = parts[1].strip() if len(parts) > 1 else ""

    maps_url = f"https://www.google.com/maps?q={latitude},{longitude}"

    return {"latitude": latitude, "longitude": longitude, "maps_url": maps_url}


def parse_contact(data):
    """Parses a vCard string into name, phone, email, and organization."""

    fields = {
        "name": "",
        "phone": "",
        "email": "",
        "organization": "",
        "raw_vcard": data
    }

    for line in data.splitlines():
        if line.upper().startswith("FN:"):
            fields["name"] = line[3:]
        elif line.upper().startswith("N:"):
            parts = line[2:].split(";")
            if len(parts) >= 2:
                fields["name"] = " ".join(p for p in parts if p)
        elif line.upper().startswith("TEL"):
            fields["phone"] = line.split(":", 1)[-1]
        elif line.upper().startswith("EMAIL"):
            fields["email"] = line.split(":", 1)[-1]
        elif line.upper().startswith("ORG:"):
            fields["organization"] = line[4:]

    return fields


def parse_for_type(content_type, content):
    """Dispatches parsing based on the detected content type."""

    if content_type == "EMAIL":
        return parse_email(content)
    if content_type == "PHONE":
        return parse_phone(content)
    if content_type == "SMS":
        return parse_sms(content)
    if content_type == "WIFI":
        return parse_wifi(content)
    if content_type == "LOCATION":
        return parse_location(content)
    if content_type == "CONTACT":
        return parse_contact(content)
    return {"content": content}

