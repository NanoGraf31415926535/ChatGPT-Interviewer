import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import globalContext from "../context.jsx";
import Container from "bmt-template-components-container";
import Title from "bmt-template-components-title";
import Text from "bmt-template-components-text";
import typingGif from "/src/components/typing-text.gif";

const ChatWithInterviewer = () => {
  const { t } = useTranslation();
  const { parameter, c } = useContext(globalContext);

  const [userInput, setUserInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [debugLog, setDebugLog] = useState([]);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const addDebugLog = (message) => setDebugLog((prev) => [...prev, message]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) {
      setError(t("chat_error_empty"));
      return;
    }

    if (!startTime) {
      setStartTime(new Date().toLocaleString());
    }

    setChatLog((prev) => [...prev, { role: "user", content: userInput }]);
    setIsTyping(true);
    setUserInput("");
    addDebugLog(`User input sent: ${userInput}`);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      addDebugLog("Response received from API");

      if (data.error) {
        setError(data.error);
      } else {
        setTimeout(() => {
          setChatLog((prev) => [...prev, { role: "bot", content: data.response }]);
          setIsTyping(false);
          setEndTime(new Date().toLocaleString());
          addDebugLog(`Bot response: ${data.response}`);
        }, 2000);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(t("chat_error_fetch"));
      setIsTyping(false);
      addDebugLog("Error encountered while fetching response");
    }
  };

  const handleSaveChat = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      const now = new Date();
      const formattedNow = now.toLocaleString("en-GB");
      const formattedStart = startTime || "N/A";
      const formattedEnd = endTime || "N/A";

      const chatLogText = chatLog
        .map((entry) => `${entry.role === "user" ? t("chat_user_label") : t("chat_ai_label")}: ${entry.content}`)
        .join("\n");

      const summaryText = `Chat Log Created: ${formattedNow}\n` +
        `Conversation Start Time: ${formattedStart}\n` +
        `Conversation End Time: ${formattedEnd}\n\n` +
        `Chat Log:\n${chatLogText}\n\n` +
        `Summary:\n${data.summary}`;

      const blob = new Blob([summaryText], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `Chat_Log_${formattedNow.replace(/\//g, "-").replace(/,|:/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      addDebugLog(t("chat_save_success"));
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError(t("chat_error_save"));
      addDebugLog("Error encountered while saving chat log");
    }
  };

  const handleDownloadAgentsWork = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/api/download_agents_work");
      if (!response.ok) throw new Error("Failed to fetch agents work log");
  
      const text = await response.text();
      const now = new Date();
      const formattedNow = now.toLocaleString("en-GB").replace(/\//g, "-").replace(/,|:/g, "_");
  
      const logText = `Agents Work Log - Created: ${formattedNow}\n\n${text}`;
      const blob = new Blob([logText], { type: "text/plain" });
  
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `Agents_Work_Log_${formattedNow}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      addDebugLog(t("chat_download_agents_work_success"));
    } catch (err) {
      console.error("Error downloading agents work log:", err);
      setError(t("chat_download_agents_work_error"));
      addDebugLog("Error encountered while downloading agents work log");
    }
  };
  

  return (
    <Container className="p-6 max-w-lg mx-auto">
      <Title size="h1" className="text-2xl font-bold text-center mb-6">
        {t("chat_title")}
      </Title>

      {/* Chat Messages */}
      <div className="border border-gray-300 p-4 mb-6 h-96 overflow-y-scroll rounded-lg bg-white shadow-lg">
        {chatLog.map((entry, index) => (
          <div key={index} className={`mb-4 flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-lg max-w-[80%] ${entry.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
              <span className="block font-semibold">{entry.role === "user" ? t("chat_user_label") : t("chat_ai_label")}</span>
              {entry.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <img src={typingGif} alt={t("chat_typing_label")} className="w-16" />
          </div>
        )}
      </div>

      {error && <Text className="text-red-500 mb-4">{error}</Text>}

      {/* Input and Send Button */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={t("chat_placeholder")}
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-300"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {t("chat_send_button")}
        </button>
      </form>

      {/* Save Chat Button */}
      <button
        onClick={handleSaveChat}
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mb-6"
      >
        {t("chat_save_button")}
      </button>
      <button
        onClick={handleDownloadAgentsWork}
        className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition mb-6"
      >
        {t("chat_download_agents_work_button")}
      </button>

      {/* Debug Log */}
      <div className="border border-gray-300 p-3 mt-6 h-40 overflow-y-scroll bg-gray-50 rounded-lg shadow-sm">
        <strong>Debug Log:</strong>
        {debugLog.map((log, index) => (
          <div key={index} className="text-sm text-gray-600">{log}</div>
        ))}
      </div>
    </Container>
  );
};

export default ChatWithInterviewer;