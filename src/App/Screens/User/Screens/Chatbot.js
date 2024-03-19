import { useEffect, useRef, useState } from "react";
import PageLoader from "../../../Components/Loader/PageLoader";
import { Clipboard, Send, ThumbsDown, ThumbsUp } from "react-feather";
import Helpers from "../../../Config/Helpers";
import { useParams } from "react-router-dom";
import axios from "axios";
import APIResponse from "../../../Components/APIResponse";
import ChatLoader from "../../../Components/Loader/chatLoader";
import ChatGPTFormatter from "../../../Components/ChatgptFormatter";

const Chatbot = () => {
    const { chatid } = useParams();
    const messagesEndRef = useRef(null)
    const [pageLoading, setPageLoading] = useState(false);
    const [chat, setChat] = useState({});
    const [isDone, setIsDone] = useState(true);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [buttons, setButtons] = useState([]);

    const scrollToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight);
        // messagesEndRef.current?.scrollIntoView({ behavior: "smooth", top: messagesEndRef.current.scrollHeight + 200, block:"end" })
    }

    const getButtons = (prompt_id) => {
        axios.get(`${Helpers.apiUrl}button/prompt/${prompt_id}`, Helpers.authHeaders).then(response => {
            setButtons(response.data.buttons);
        });
    }

    const getChat = () => {
        if (isDone) {
            setIsDone(false);
            setPageLoading(true);
            axios.get(`${Helpers.apiUrl}chat/get/${chatid}`, Helpers.authHeaders).then(response => {
                setChat(response.data);
                if (response.data.prompt_question_id) {
                    getButtons(response.data.prompt_question_id);
                }
                setPageLoading(false);
                if (response.data.messages.length === 0 || response.data.chat_message === "") {
                    getFirstResponse();
                } else {
                    setMessages(response.data.messages);
                    setTimeout(() => {
                        scrollToBottom();
                    }, 500);
                }
            });
        }
    }

    const getFirstResponse = () => {
        setIsLoading(true);
        let msg = {
            message: "",
            user_id: Helpers.authUser.id,
            chat_id: chat.id,
            is_bot: 1,
            is_hidden: 0,
            is_included: 1,
        }
        let msgs = messages;
        msgs.push(msg);
        setMessages(msgs);
        setTimeout(() => {
            scrollToBottom();
        }, 500);
        const data = {
            chatid: chatid,
        };
        const controller = new AbortController();
        const signal = controller.signal;
        fetch(`${Helpers.apiUrl}bot/init-response`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data),
            signal
        }).then(response => {
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
                let withLines = text.replace(/\\n/g, '\n');
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[0].message += withLines;
                    return updatedMessages;
                });
                setTimeout(() => {
                    scrollToBottom();
                }, 500);
                reader.read().then(processText);
            }
            reader.read().then(processText);
        }).catch(error => {
            console.log("ERROR::", error);
            setIsLoading(false);
        });
    }

    const getResponse = (btnPrompt = "") => {
        if (btnPrompt || userInput) {
            setIsLoading(true);
            let msg = {
                message: btnPrompt ? btnPrompt : userInput,
                user_id: Helpers.authUser.id,
                chat_id: chat.id,
                is_bot: 0,
                is_hidden: 0,
                is_included: 1,
            }
            let msgs = messages;
            msgs.push(msg);
            setMessages(msgs);
            setTimeout(() => {
                scrollToBottom();
            }, 500);
            const data = {
                chatid: chatid,
                input: btnPrompt ? btnPrompt : userInput,
            };
            addMessage();
            setUserInput("");
            const controller = new AbortController();
            const signal = controller.signal;
            fetch(`${Helpers.apiUrl}bot/response`, {
                method: 'POST',

                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data),
                signal
            }).then(response => {
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
                    let withLines = text.replace(/\\n/g, '\n');
                    setMessages(prevMessages => {
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
            }).catch(error => {
                console.log("ERROR::", error);
                setIsLoading(false);
            });
        } else {
            Helpers.toast("error", "Can't send without input");
        }
    }

    const addMessage = () => {
        let msg = {
            message: "",
            user_id: Helpers.authUser.id,
            chat_id: chat.id,
            is_bot: 1,
            is_hidden: 0,
            is_included: 1,
        }
        let msgs = messages;
        msgs.push(msg);
        setMessages(msgs);
    }

    useEffect(() => {
        getChat();
    }, []);

    return (
        <>
            <div class="nk-content chatbot-mb">
                <div class="container-xl">
                    <div class="nk-content-inner">
                        {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                            <div class="nk-block">
                                {messages.map((msg, index) => {
                                    if (msg.is_hidden === 0) {
                                        return (
                                            <div key={index} className={`container chat-box ${msg.is_bot === 0 ? 'bg-white' : 'bot-bubble'}`}>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row align-center">
                                                            <div className="col-6">
                                                                <div className="chat-header">
                                                                    {msg.is_bot === 0 && <div><img className="chat-avatar" src={Helpers.serverImage(Helpers.authUser.profile_pic)} alt="" /></div>}
                                                                    {msg.is_bot === 1 && <div class="media media-middle media-circle text-bg-primary"><img src="/favicon-white.png" alt="" /></div>}
                                                                    <span className="chat-user"><strong>{msg.is_bot === 1 ? 'HumGPT' : 'You'}</strong></span>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 text-right">
                                                                <div className="chat-actions">
                                                                    <Clipboard className="pointer" size={20} />
                                                                    <ThumbsUp className="pointer ml20" size={20} />
                                                                    <ThumbsDown className="pointer ml20" size={20} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="chat-divider"></div>
                                                    </div>
                                                    <div className="col-12">
                                                        <p className="message">
                                                            <ChatGPTFormatter response={msg.message} writing={messages.length - 1 === index && isLoading} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>}
                    </div>
                </div>
                <div id="something" ref={messagesEndRef} />
            </div>
            <div className="nk-footer chat-bottom">

                <div className="container-xl">
                    <div className="row">
                        <div className="col-12 p0">
                            <div className="form-group">
                                <div className="form-control-wrap">
                                    <textarea className="chatbot-input" value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Write your message..."></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 p0">
                            <div className="row">
                                <div className="col-6">
                                    {buttons.map((btn, index) => <button onClick={() => getResponse(btn.prompt)} disabled={isLoading} className={`btn btn-primary btn-sm ${index > 0 && 'ml10'}`}>{btn.name}</button>)}
                                </div>
                                <div className="col-6 text-right">
                                    <small>{userInput.length} / 2000</small>
                                    <button className="btn btn-primary btn-sm ml20" disabled={isLoading} onClick={() => getResponse("")}><Send size={14} /> <span className="ml10">Send</span></button>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-1">
                            
                        </div> */}
                    </div>

                    {/* <div className="row">
                        <div className="col-md-6 p0">
                            {buttons.map(btn => <button onClick={() => getResponse(btn.prompt)} disabled={isLoading} className="btn btn-primary btn-sm ml10">{ btn.name }</button>)}
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default Chatbot;