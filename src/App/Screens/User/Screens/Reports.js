import React, { useEffect, useRef, useState } from "react";
import PageLoader from "../../../Components/Loader/PageLoader";
import {
  Clipboard,
  Paperclip,
  ThumbsDown,
  ThumbsUp,
  Send,
  Download,
  X,
} from "react-feather";
import Helpers from "../../../Config/Helpers";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ChatGPTFormatter from "../../../Components/ChatgptFormatter";
import { jsPDF } from "jspdf";

const Report = () => {
  const { chatid } = useParams();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [chat, setChat] = useState({});
  const [isDone, setIsDone] = useState(true);
  const [messages, setMessages] = useState([]);
  const [UserInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [buttons, setButtons] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const location = useLocation();

  const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  const downloadSingleMessagePDF = (message) => {
    const pdf = new jsPDF();
    const margins = { top: 10, bottom: 10, left: 10, right: 10 };
    const pageHeight = pdf.internal.pageSize.height;
    const lineHeight = 10;
    let cursorY = margins.top;

    const splitText = pdf.splitTextToSize(
      message.message,
      pdf.internal.pageSize.width - margins.left - margins.right
    );

    splitText.forEach((line) => {
      if (cursorY + lineHeight > pageHeight - margins.bottom) {
        pdf.addPage();
        cursorY = margins.top;
      }
      pdf.text(margins.left, cursorY, line);
      cursorY += lineHeight;
    });

    pdf.save(`chat_message_${new Date().toISOString()}.pdf`);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const getChat = () => {
    if (isDone) {
      setIsDone(false);
      setPageLoading(true);
      axios
        .get(`${Helpers.apiUrl}chat/get/${chatid}`, Helpers.authHeaders)
        .then((response) => {
          setChat(response.data);
          setPageLoading(false);
          if (
            response.data.messages.length === 0 ||
            response.data.chat_message === ""
          ) {
            
          } else {
            setMessages(response.data.messages);
            setTimeout(() => {
              scrollToBottom();
            }, 500);
          }
        });
    }

    if (location.state?.prompt) {
      setUserInput(location.state.prompt);
      // Optionally, you can auto-send the prompt here
      //  getResponse(location.state.prompt);
    }

    if (location.state?.selectedFile) {
      setSelectedFile(location.state.selectedFile);
    }


    
  };

 

  const getResponse = (btnPrompt = "") => {
    if (btnPrompt || UserInput) {
      setIsLoading(true);
      let msg = {
        message: btnPrompt ? btnPrompt : UserInput,
        user_id: Helpers.authUser.id,
        chat_id: chat.id,
        is_bot: 0,
      };
      let msgs = messages;
      msgs.push(msg);
      setMessages(msgs);
      setTimeout(() => {
        scrollToBottom();
      }, 500);
      const data = new FormData();
      data.append("chatid", chatid);
      data.append("file", selectedFile);
      data.append("UserInput", btnPrompt ? btnPrompt : UserInput);
      addMessage();
      setUserInput("");
      setSelectedFile(null); // Clear the selected file after sending
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(`${Helpers.apiUrl}user/uploadDoc`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
        signal,
      })
        .then((response) => {
          if (!response.ok) {
            response.json().then((error) => {
              Helpers.toast("error", error.message);
              setIsLoading(false);
            });
          } else {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            function processText({ done, value }) {
              if (done) {
                setIsLoading(false);
                return;
              }
              let text = decoder.decode(value);
              if (text.endsWith("[DONE]")) {
                text = text.slice(0, -6);
              }
              let withLines = text.replace(/\\n/g, "\n");
              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[messages.length - 1].message += withLines;
                return updatedMessages;
              });
              setTimeout(() => {
                scrollToBottom();
              }, 500);
              reader.read().then(processText);
            }
            reader.read().then(processText);
          }
        })
        .catch((error) => {
          console.log("ERROR::", error);
          setIsLoading(false);
        });
    } else {
      Helpers.toast("error", "Can't send without input");
    }
  };

  const addMessage = () => {
    let msg = {
      message: "",
      user_id: Helpers.authUser.id,
      chat_id: chat.id,
      is_bot: 1,
    };
    let msgs = messages;
    msgs.push(msg);
    setMessages(msgs);
  };

  const cancelSelectedFile = () => {
    setSelectedFile(null);
  };

  useEffect(() => {
    getChat();

    // Reset state values when location state changes (e.g., after reloading)
    if (location.state) {
        window.history.replaceState(null, ""); // Clear location state
      }
  }, [location.state]);

  return (
    <>
      <div className="nk-content chatbot-mb">
        <div className="container-xl">
          <div className="nk-content-inner">
            {pageLoading ? (
              <PageLoader />
            ) : (
              <div className="nk-content-body">
                <div className="nk-block-head nk-page-head">
                  <div className="nk-block-head-between">
                    <div className="nk-block-head-content">
                      <h2 className="display-6">Reports Analysis</h2>
                      <p>Upload your Reports for analysis</p>
                    </div>
                  </div>
                </div>
                <div className="nk-block">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`container chat-box ${
                        msg.is_bot === 0 ? "bg-white" : "bot-bubble"
                      }`}
                    >
                      <div className="row">
                        <div className="col-12">
                          <div className="row align-center">
                            <div className="col-6">
                              <div className="chat-header">
                                {msg.is_bot === 0 && (
                                  <div>
                                    <img
                                      className="chat-avatar"
                                      src={Helpers.serverImage(
                                        Helpers.authUser.profile_pic
                                      )}
                                      alt=""
                                    />
                                  </div>
                                )}
                                {msg.is_bot === 1 && (
                                  <div className="media media-middle media-circle text-bg-primary">
                                    <img src="/favicon-white.png" alt="" />
                                  </div>
                                )}
                                <span className="chat-user">
                                  <strong>
                                    {msg.is_bot === 1 ? "HumGPT" : "You"}
                                  </strong>
                                </span>
                              </div>
                            </div>
                            <div className="col-6 text-right">
                              <div className="chat-actions">
                                <Clipboard className="pointer" size={20} />
                                <ThumbsUp className="pointer ml20" size={20} />
                                <ThumbsDown
                                  className="pointer ml20"
                                  size={20}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="chat-divider"></div>
                        </div>
                        <div className="col-12">
                          <p className="message">
                            <ChatGPTFormatter
                              response={msg.message}
                              writing={
                                messages.length - 1 === index && isLoading
                              }
                            />
                          </p>
                          {msg.is_bot === 1 && (
                            <div className="text-center">
                              <button
                                className="btn btn btn-outline-primary btn-sm ml10"
                                onClick={() => downloadSingleMessagePDF(msg)}
                              >
                                <Download size={14} />
                                <span className="ml5">Download</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div id="something" ref={messagesEndRef} />
      </div>
      <div className="nk-footer chat-document">
        <div className="container-xl">
          <div className="row">
            <div className="col-12 p0">
              <div className="form-group">
                <div className="form-control-wrap">
                  <textarea
                    className="chatbot-input"
                    value={UserInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Write your message..."
                  ></textarea>

                  {selectedFile && (
                    <div className="selected-file">
                      Selected File: {selectedFile.name}{" "}
                      <X
                        size={14}
                        onClick={cancelSelectedFile}
                        className="cancel-file"
                      />
                    </div>
                  )}

                  <label htmlFor="file-upload" className="upload-icon">
                    <Paperclip size={20} />
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="col-6">
              {buttons.map((btn, index) => (
                <button
                  key={index}
                  onClick={() => getResponse(btn.prompt)}
                  disabled={isLoading}
                  className={`btn btn-primary btn-sm ${index > 0 && "ml10"}`}
                >
                  {btn.name}
                </button>
              ))}
            </div>
            <div className="row">
              <div className="col-6">
                {buttons.map((btn, index) => (
                  <button
                    onClick={() => getResponse(btn.prompt)}
                    disabled={isLoading}
                    className={`btn btn-primary btn-sm ${index > 0 && "ml10"}`}
                  >
                    {btn.name}
                  </button>
                ))}
              </div>
              <div className="col-6 text-right">
                <small>{UserInput.length} / 2000</small>
                <button
                  className="btn btn-primary btn-sm ml20"
                  disabled={isLoading}
                  onClick={() => getResponse("")}
                >
                  <Send size={14} /> <span className="ml10">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;