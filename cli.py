# Import required functions from other modules
from decoder import decode_qr          # Decodes QR code from image file
from detector import detect_content    # Identifies what type of data is in the QR code
from handlers import handle_content    # Performs action based on data type


while True:

    # Get image path from user
    image_path = input("\nEnter the QR image path: ")

    # Decode the QR code (returns the data or None if failed)
    result = decode_qr(image_path)

    # Check if QR code was successfully decoded
    if result:

        # Determine what kind of data was decoded
        content_type = detect_content(result)

        # Show success message and decoded data
        print("\n✅ QR Code Decoded Successfully!\n")
        print(f"Type: {content_type}")
        print(f"Content: {result}")

        # Execute appropriate action and store returned command
        action = handle_content(content_type, result)

        # If user chooses decode another QR, restart loop
        if action == "decode":
            continue

        # If user chooses exit, stop program
        elif action == "exit":
            print("\n👋 Goodbye!")
            break

    else:
        print("\n❌ No QR Code Found.")

        # Ask if user wants to try again
        retry = input("\nTry another QR? (y/n): ")

        if retry.lower() != "y":
            print("\n👋 Goodbye!")
            break