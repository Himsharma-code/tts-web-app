# 🔊 Text-to-Speech Web App

A fully functional Text-to-Speech (TTS) application built with Next.js, allowing users to convert custom text into spoken audio using the browser's native Web Speech API. This app provides a clean, responsive interface for a seamless user experience.

## ✨ Features

- **Real-time Speech Playback**: Converts typed text to speech instantly using the Web Speech API.
- **Voice Selection**: Dynamically loads and allows selection from available voices (different languages, genders) provided by the user's browser.
- **Customizable Speech Settings**: Users can adjust:
  - **Speech Rate**: Control how fast the voice speaks (0.1x to 3.0x).
  - **Pitch**: Adjust the voice's highness or lowness (0.0 to 2.0).
  - **Volume**: Set the loudness of the speech (0% to 100%).
- **Test Voice Settings**: A dedicated button to quickly preview how current settings sound.
- **Text Download**: Download the input text content as a `.txt` file.
- **Dark/Light Theme**: Toggle between dark and light modes for better user preference and accessibility.
- **Responsive UI**: Clean and accessible design built with Tailwind CSS and shadcn/ui components, ensuring a great experience on desktop and mobile devices.
- **Cross-Browser Compatibility**: Includes a fallback message for browsers that do not support the Web Speech API.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/icons/)
- **Speech API**: [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (Browser Native)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)

## 🛠️ Installation & Setup

To run this project locally, follow these steps:

1.  **Clone the repository (if applicable):**

    ```bash
    git clone <repository-url>
    cd text-to-speech-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 💡 Usage

1.  **Enter Text**: Type or paste your desired text into the large text area.
2.  **Adjust Settings**: Use the sliders to customize the speech rate, pitch, and volume.
3.  **Select Voice**: Choose from the available voices in the dropdown menu.
4.  **Test Settings**: Click "Test Voice Settings" to hear a sample with your current configurations.
5.  **Play Speech**: Click the "Play" button to hear your entered text spoken aloud.
6.  **Stop Speech**: Click the "Stop" button to immediately halt the speech.
7.  **Download Text**: Click "Download Text" to save your input text as a `.txt` file.
8.  **Toggle Theme**: Use the sun/moon icon in the top-right corner to switch between light and dark modes.

## ⚠️ Limitations

- **Audio Recording**: Due to browser security limitations, direct audio recording of the speech synthesis output is generally **not supported** by the Web Speech API. If you need to record the audio, please use your system's audio recording software.
- **Pause/Resume**: The `pause` and `resume` functionalities of the Web Speech API are known to be unreliable and inconsistently supported across different browsers. For a more stable experience, this application focuses on reliable "Play" and "Stop" controls.
- **Voice Availability**: The available voices depend entirely on the user's operating system and browser.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or find any bugs, please open an issue or submit a pull request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

```

```
