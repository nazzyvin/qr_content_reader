# Content types that support downloading
DOWNLOADABLE_TYPES = [
    "IMAGE",
    "AUDIO",
    "VIDEO",
    "PDF",
    "WORD",
    "EXCEL",
    "ZIP",
    "RAR",
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
    "ZIP": DOWNLOAD_ACTIONS,
    "RAR": DOWNLOAD_ACTIONS,
    "POWERPOINT": DOWNLOAD_ACTIONS,

    "URL": [
        "Open Website",
        "Copy Link",
        "Save Link"
    ],

    "TEXT": [
        "Copy Text",
        "Save as TXT"
    ],

    "EMAIL": [
        "Send Email",
        "Copy Address"
    ],

    "PHONE": [
        "Call Number",
        "Copy Number"
    ],

    "SMS": [
        "Send SMS",
        "Copy Number"
    ],

    "WIFI": [
        "Show Details",
        "Copy Password",
        "Copy Wi-Fi Code"
    ],

    "LOCATION": [
        "Open in Maps",
        "Copy Coordinates"
    ],

    "CONTACT": [
        "Show Details",
        "Save as .vcf",
        "Copy vCard"
    ]
}