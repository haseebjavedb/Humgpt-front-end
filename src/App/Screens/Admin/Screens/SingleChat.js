import { useEffect, useRef, useState } from "react";
import PageLoader from "../../../Components/Loader/PageLoader";
import Helpers from "../../../Config/Helpers";
import { useParams } from "react-router-dom";
import axios from "axios";
import APIResponse from "../../../Components/APIResponse";

const SingleChat = () => {
    const { chatid } = useParams();
    const messagesEndRef = useRef(null)
    const [pageLoading, setPageLoading] = useState(false);
    const [chat, setChat] = useState({});
    const [isDone, setIsDone] = useState(true);
    const [messages, setMessages] = useState([]);

    const scrollToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }

    const getChat = () => {
        if(isDone){
            setIsDone(false);
            setPageLoading(true);
            axios.get(`${Helpers.apiUrl}chat/get/${chatid}`, Helpers.authHeaders).then(response => {
                setChat(response.data);
                console.log('data', response.data);
                setPageLoading(false);
                setMessages(response.data.messages);
                setTimeout(() => {
                    scrollToBottom();
                }, 500);
            });
        }
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
                                    if(msg.is_hidden === 0){
                                        return (
                                            <div key={index} className={`container chat-box ${msg.is_bot === 0 ? 'bg-white' : ''}`}>
                                                <div className="row">
                                                    <div className="col-1 text-center">
                                                        {msg.is_bot === 0 && <div class="media media-sm media-middle media-circle text-bg-primary"><img src={Helpers.serverImage(Helpers.authUser.profile_pic)} alt="" /></div>}
                                                        {msg.is_bot === 1 && <div class="media media-sm media-middle media-circle text-bg-white"><img src="/favicon.png" alt="" /></div>}
                                                    </div>
                                                    <div className="col-11">
                                                        <p className="message">
                                                            <APIResponse response={msg.message} />
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
        </>
    );
}

export default SingleChat;