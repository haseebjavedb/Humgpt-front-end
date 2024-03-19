import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import PageLoader from "../../../Components/Loader/PageLoader";
import { Link, useParams } from "react-router-dom";
import useTitle from "../../../Hooks/useTitle";
import APIResponse from "../../../Components/APIResponse";
import Moment from "react-moment";

const AdminChatHistoryUser = () => {
    useTitle("Chat History");
    const { user_id } = useParams();
    const [pageLoading, setPageLoading] = useState(false);
    const [chats, setChats] = useState([]);

    const getChats = () => {
        setPageLoading(true);
        axios.get(`${Helpers.apiUrl}admin/chat/user/${ user_id }`, Helpers.authHeaders).then(response => {
            setChats(response.data);
            setPageLoading(false);
        });
    }

    useEffect(() => {
        getChats();
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">Chat History</h2>
                                </div>
                            </div>
                        </div>
                        <div class="nk-block">
                            {chats.length === 0 && <p>No records found...</p>}
                            <div class="nk-timeline">
                                {chats.map(chat => {
                                    return (
                                        <div class="nk-timeline-item">
                                            <div class="nk-timeline-symbol"><div class="nk-timeline-symbol-dot"></div></div>
                                            <div class="nk-timeline-content">
                                                <Link to={`/admin/chat/${ chat.chatid }`}>
                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="d-flex align-items-center justify-content-between mb-2">
                                                                <div class="d-flex align-items-center">
                                                                    <div class="media media-xs media-middle media-circle text-primary bg-primary bg-opacity-20">{ chat.prompt_question.name.charAt(0) }</div>
                                                                    <h5 class="fs-14px fw-normal ms-2">{ chat.prompt_question.name }</h5>
                                                                </div>
                                                                <button class="js-copy" data-clipboard-target="#SocialMediaPost04"></button>
                                                            </div>
                                                            <p class="lead text-base" style={{ fontSize: 12 }} id="SocialMediaPost04">
                                                                <APIResponse response={chat.chat_message} onlyFirstPara={true} />
                                                            </p>
                                                            <ul class="nk-timeline-meta">
                                                                <li>{ chat.user.name }</li>
                                                                <li><Moment date={chat.created_at} format="ddd, MMM Do YYYY, h:mm A" /></li>
                                                                <li>{ Helpers.countWords(chat.chat_message) } Words / {chat.chat_message.length} Characters</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default AdminChatHistoryUser;