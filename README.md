# QR Code Reader

A Python-based QR code reader that intelligently detects the type of content stored in a QR code and provides appropriate actions such as opening links, downloading files, copying text, or saving contact information.

## ✨ Features

- 📷 Scan QR codes from images
- 🌐 Detect URLs and open them in your default browser
- 📄 Download supported files directly from QR codes
- 📋 Copy text to the clipboard
- 📞 Read contact information (vCard)
- 📧 Detect email QR codes
- 📱 Detect phone numbers
- 💬 Detect SMS QR codes
- 📶 Detect Wi-Fi QR codes
- 📍 Detect location coordinates
- 🧠 Automatically identifies the QR content type before presenting available actions

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
- OpenCV
- Pillow
- Pyzbar
- Pyperclip
- Webbrowser
- Requests

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
``` bash
python -m venv .venv
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## ▶️ Usage

Run the application:

```bash
python main.py
```

Follow the prompts:

1. Provide a QR code image.
2. The application detects the QR content.
3. Choose an available action from the menu.

Example:

```
Detected Type: URL

1. Open in browser
2. Copy URL
3. Scan another QR
4. Exit

Enter choice:
```

## 📁 Project Structure

```
qr_content_reader/
│
├── main.py
├── handlers.py
├── downloader.py
├── detector.py
├── decoder.py
├── requirements.txt
└── README.md
```

*(Update the structure above if your filenames differ.)*

## 🚀 Future Improvements

- Webcam scanning
- Batch QR image scanning
- QR code generation
- QR history
- GUI version
- Drag-and-drop support
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