import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import PageLoader from "../../../Components/Loader/PageLoader";
import { Link } from "react-router-dom";
import useTitle from "../../../Hooks/useTitle";
import APIResponse from "../../../Components/APIResponse";
import Moment from "react-moment";

const ChatHistory = () => {
  useTitle("Chat History");
  const [pageLoading, setPageLoading] = useState(false);
  const [chats, setChats] = useState([]);

  const getChats = () => {
    setPageLoading(true);
    axios
      .get(`${Helpers.apiUrl}chat/all`, Helpers.authHeaders)
      .then((response) => {
        setChats(response.data);
        setPageLoading(false);
      });
  };

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div className="nk-content">
      <div className="container-xl">
        <div className="nk-content-inner">
          {pageLoading ? (
            <PageLoader />
          ) : (
            <div className="nk-content-body">
              <div className="nk-block-head nk-page-head">
                <div className="nk-block-head-between">
                  <div className="nk-block-head-content">
                    <h2 className="display-6">Generation History</h2>
                  </div>
                </div>
              </div>
              <div className="nk-block">
                <div className="nk-timeline">
                  {chats.map((chat, index) => (
                    <div className="nk-timeline-item" key={index}>
                      <div className="nk-timeline-symbol">
                        <div className="nk-timeline-symbol-dot"></div>
                      </div>
                      <div className="nk-timeline-content">
                        <Link to={`/user/chat-history/${chat.chatid}`}>
                          <div className="card">
                            <div className="card-body">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                  <div className="media media-xs media-middle media-circle text-primary bg-primary bg-opacity-20">
                                    {chat.prompt_question?.name?.charAt(0) ||
                                      "N/A"}
                                  </div>
                                  <h5 className="fs-14px fw-normal ms-2">
    {chat.chat_message}
</h5>

                                </div>
                                <button
                                  className="js-copy"
                                  data-clipboard-target="#SocialMediaPost04"
                                ></button>
                              </div>
                              <p
                                className="lead text-base"
                                style={{ fontSize: 12 }}
                                id="SocialMediaPost04"
                              >
                                {chat.chat_message && (
                                  <APIResponse
                                    response={chat.chat_message}
                                    onlyFirstPara={true}
                                  />
                                )}
                              </p>
                              <ul className="nk-timeline-meta">
                                <li>
                                  <Moment
                                    date={chat.created_at}
                                    format="ddd, MMM Do YYYY, h:mm A"
                                  />
                                </li>
                                <li>
                                  {chat.chat_message
                                    ? `${Helpers.countWords(
                                        chat.chat_message
                                      )} Words / ${
                                        chat.chat_message.length
                                      } Characters`
                                    : "No Message Available"}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
