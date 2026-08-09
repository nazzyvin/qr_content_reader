# QR Content Reader

A QR/barcode content extractor that decodes codes from images, intelligently detects the type of content stored in them, and provides appropriate actions such as opening links, downloading files, copying text, or saving contact information.

Built as a **web application** (FastAPI backend + HTML/CSS/JS frontend) deployable to Render, with the original **CLI** still available.

## ✨ Features

- 📷 Scan QR codes and barcodes from images
- 🔤 Multi-format decoding: QR Code, Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF, and more (via pyzbar, with an OpenCV QR fallback)
- 🌐 Detect URLs and open them in your default browser
- 📄 Download supported files directly from QR codes
- 📋 Copy text to the clipboard
- 📞 Read contact information (vCard)
- 📧 Detect email QR codes
- 📱 Detect phone numbers
- 💬 Detect SMS QR codes
- 📶 Detect Wi-Fi QR codes
- 📍 Detect location coordinates
- 🧠 Automatically identifies the QR content type and returns available actions
- 🖱️ Drag-and-drop web interface (no install required for end users)

## 📂 Supported QR Content Types

- URL
- Plain Text
- Email
- Phone Number
- SMS
- Wi-Fi
- Location
- Contact (vCard)
- Image
- Audio
- Video
- PDF
- Microsoft Word
- Microsoft Excel
- Microsoft PowerPoint

## 🛠️ Technologies Used

- Python 3.14
- FastAPI
- Uvicorn
- OpenCV
- Pillow
- Pyzbar
- Requests
- HTML / CSS / JavaScript

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/nazzyvin/qr_content_reader.git
```

Move into the project directory:

```bash
cd qr_content_reader
```

Create a virtual environment:

```bash
python -m venv .venv
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## ▶️ Usage

### Web app (local)

```bash
uvicorn main:app --reload
```

Open http://127.0.0.1:8000, then drag-and-drop or choose a QR/barcode image. The app returns the detected content type, the decoded data, parsed details, and available actions.

Interactive API docs are available at http://127.0.0.1:8000/docs. The decode endpoint is:

```
POST /api/decode   (multipart form: file=<image>)
```

Returns JSON:

```json
{
  "success": true,
  "content_type": "WIFI",
  "content": "WIFI:T:WPA;S:MyNet;P:secret;;",
  "details": { "ssid": "MyNet", "security": "WPA", "password": "secret", "hidden": "" },
  "actions": ["Show Details", "Copy Password", "Copy Wi-Fi Code"]
}
```

### CLI (desktop usage)

```bash
python cli.py
```

Then enter the path to a QR/barcode image and choose an action from the menu.

## 🚀 Deploy to Render

This project is configured to deploy to Render as a Docker web service (see `render.yaml`). The Dockerfile installs `libzbar0`, the system library pyzbar requires.

1. Push the repository to GitHub.
2. In the Render Dashboard, create a **New Web Service** and connect your repo.
3. Render auto-detects the `Dockerfile` (set **Language = Docker** if prompted).
4. Deploy. Render builds the image and serves it at `https://<service-name>.onrender.com`.

Alternatively, use the Blueprint: connect your repo and Render will read `render.yaml`, which specifies the free-tier Docker service and health check.

## 📁 Project Structure

```
qr_content_reader/
│
├── main.py          # FastAPI web backend
├── cli.py           # Console interface
├── extractor.py     # Pure extraction service (shared by web + CLI)
├── actions.py       # Content-type → available actions
├── parsers.py       # Type-specific content parsers
├── decoder.py       # Barcode/QR decoding (pyzbar + OpenCV fallback)
├── detector.py      # Content type detection
├── handlers.py      # CLI action handlers
├── downloader.py    # File downloading (CLI)
├── static/          # Frontend (index.html, style.css, script.js)
├── Dockerfile       # Render deployment image
├── render.yaml      # Render Blueprint config
├── requirements.txt
└── README.md
```

## 🔮 Future Improvements

- Webcam scanning
- Batch QR image scanning
- QR code generation
- Scan history
- Export scan history

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Naz-k Vincent**

If you found this project useful, consider giving it a ⭐ on GitHub!