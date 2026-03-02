import { useForm } from "react-hook-form";
import API from "../api/axios";
import { useEffect, useRef, useState } from "react";

export default function ChatWindow({
  current, messages, setMessages, sidebarOpen
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const bottomRef = useRef();
  const [uploadError, setUploadError] = useState("");
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear errors after 3 seconds
  useEffect(() => {
    if (uploadError || sendError) {
      const timer = setTimeout(() => {
        setUploadError("");
        setSendError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadError, sendError]);

  // 📄 DOCUMENT UPLOAD
  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File type validation
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed!");
      return;
    }

    // File size validation (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size should be less than 5MB!");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    try {
      await API.post("/documents/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploadError(""); // Clear any previous error
      // Show success message briefly
      setUploadError("Document uploaded successfully!");
    } catch (error) {
      setUploadError(error.response?.data?.message || "Failed to upload document");
    }
  };

  // SEND MESSAGE
  const sendMessage = async (data) => {
    setSendError(""); // Clear previous error

    if (!current) {
      setSendError("Please create or select a chat first");
      return;
    }

    const userMsg = {
      role: "user",
      content: data.question
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await API.post("/rag/ask", {
        question: data.question,
        conversationId: current._id
      });

      const botMsg = {
        role: "assistant",
        content: res.data.data.answer
      };

      setMessages(prev => [...prev, botMsg]);
      reset();

      await API.get("/conversations")
        .then(res => window.dispatchEvent(
          new CustomEvent("refreshConversations", {
            detail: res.data.data
          })
        ));
    } catch (error) {
      // Remove the user message if API fails
      setMessages(prev => prev.slice(0, -1));
      setSendError(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className={`flex justify-center w-full transition-all duration-300 bg-gray-900 p-4 overflow-auto ${
    sidebarOpen ? "ml-[300px]" : "ml-0"
  }`}>
      <div className="chat-area">
        {/* HEADER */}
        <div className="chat-header">
          <h3>{current?.title || "Select Chat"}</h3>

          <div className="upload-container">
            <label className="upload-btn">
              📄 Upload PDF
              <input
                type="file"
                hidden
                onChange={uploadFile}
                accept=".pdf"
              />
            </label>
            {uploadError && (
              <div className={`error-message ${uploadError.includes("success") ? "success" : ""}`}>
                {uploadError}
              </div>
            )}
          </div>
        </div>

        {/* MESSAGES */}
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i}
              className={m.role === "user" ? "user" : "bot"}>
              {m.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT SECTION WITH ERROR */}
        <div className="input-section">
          <form
            className="input-box"
            onSubmit={handleSubmit(sendMessage)}
          >
            <input
              {...register("question", {
                required: "Question is required",
                minLength: {
                  value: 2,
                  message: "Question must be at least 2 characters"
                }
              })}
              placeholder="Ask something..."
              className={errors.question || sendError ? "error" : ""}
            />
            <button type="submit">Send</button>
          </form>

          {/* Error messages below input */}
          {(errors.question || sendError) && (
            <div className="error-container">
              {errors.question && (
                <div className="error-message">{errors.question.message}</div>
              )}
              {sendError && (
                <div className="error-message">{sendError}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}