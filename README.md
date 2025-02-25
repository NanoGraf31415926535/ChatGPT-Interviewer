# Interviewer Chatbot

## Overview
The **Interviewer Chatbot** is an AI-driven tool designed to conduct structured interviews by asking questions and evaluating user responses. Built using **Flask (Python)** for the backend and **React** for the frontend, the chatbot ensures a smooth and professional conversation flow while logging all intermediate agent outputs and branching conditions.

## Features
- **AI-Powered Interviewing**: The chatbot dynamically generates questions and follows a structured interview flow.
- **Strict Moderation System**: Filters out offensive, nonsensical, or inappropriate messages before sending them to the AI.
- **Conversation Logging**: Captures all agent responses, branching decisions, and API calls for debugging and analysis.
- **Downloadable Logs**: Users can download full conversation logs, including agent outputs and API interactions.
- **Debug Panel**: Displays real-time AI responses and branching logic for easy debugging.

## Technologies Used
- **Backend:** Flask (Python)
- **Frontend:** React (JavaScript)
- **AI API:** OpenAI API
- **Storage & Logging:** JSON/Text files
- **Security:** Input validation and moderation system

## Installation

### Prerequisites
Ensure you have the following installed:
- Python 3.8+
- Node.js & npm
- Virtual environment (recommended for Python dependencies)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://gitlab.rlp.net/bmt/templates/bmt-template-interviews.git
3. Install dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```
4. Navigate to Interviewer.py with your IDE:
   ```bash
   ensure the API Key is there: openai.api_key = "" - insert the API Key
   ```
5. Start the Flask backend:
   ```bash
   cd ChatGPT-project/bmt-template-chat-gpt-interviewer/src/components
   flask run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ChatGPT-project/bmt-template-chat-gpt-interviewer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```

## Usage
1. Open the frontend in your browser (`http://localhost:3000`).
2. Begin an interview session with the chatbot.
3. View real-time logs and branching logic in the debug panel.
4. Download the chat log or agent work if needed.

## Future Enhancements
- **Improved NLP Models**: Enhance the AI’s understanding and response capabilities.
- **Cloud Integration**: Store logs and conversations in a secure cloud database.
- **Multi-language Support**: Expand the chatbot’s capabilities to support various languages.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes and push to your branch.
4. Open a Pull Request for review.

## License
This project is licensed under the BMT License




