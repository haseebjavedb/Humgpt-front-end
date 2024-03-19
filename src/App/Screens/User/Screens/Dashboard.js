import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import useTitle from "../../../Hooks/useTitle";
import axios from "axios";
import { Link } from "react-router-dom";
import PageLoader from "../../../Components/Loader/PageLoader";

const UserDashboard = () => {
    useTitle("Dashboard");

    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const getStats = () => {
        setIsLoading(true);
        axios.get(`${Helpers.apiUrl}user/stats`, Helpers.authHeaders).then(response => {
            setStats(response.data);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getStats();
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {isLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content"><h2 class="display-6">Welcome { Helpers.authUser.name }!</h2></div>
                            </div>
                        </div>
                        <div class="nk-block">
                            <div class="row g-gs">
                                <div class="col-sm-6 col-xxl-3">
                                    <div class="card card-full bg-purple bg-opacity-10 border-0">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-1">
                                                <div class="fs-6 text-light mb-0">Words Generated</div>
                                            </div>
                                            <h5 class="fs-1">{ stats.totalWords } <small class="fs-3">words</small></h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-xxl-3">
                                    <div class="card card-full bg-blue bg-opacity-10 border-0">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-1">
                                                <div class="fs-6 text-light mb-0">Characters Generated</div>
                                            </div>
                                            <h5 class="fs-1">{ stats.totalCharacters } <small class="fs-3">Characters</small></h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-xxl-3">
                                    <div class="card card-full bg-indigo bg-opacity-10 border-0">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-1">
                                                <div class="fs-6 text-light mb-0">Total Chats</div>
                                                <Link to={'/user/chat-history'} class="link link-indigo">See All</Link>
                                            </div>
                                            <h5 class="fs-1">{ stats.chats ? stats.chats.length : 0 } <small class="fs-3">Chats</small></h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-xxl-3">
                                    <div class="card card-full bg-cyan bg-opacity-10 border-0">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-1">
                                                <div class="fs-6 text-light mb-0">Templates Used</div>
                                                <Link to={'/user/templates-library'} class="link link-cyan">All Templates</Link>
                                            </div>
                                            <h5 class="fs-1">{ stats.allTemplates ? stats.allTemplates.length : 0 } <small class="fs-3">Used</small></h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nk-block-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content"><h2 class="display-6">Recently Used Templates</h2></div>
                                <div class="nk-block-head-content"><Link to={'/user/templates-library'} class="link">Explore All</Link></div>
                            </div>
                        </div>
                        <div class="nk-block">
                            <div class="row g-gs">
                                {stats.templates && stats.templates.map((template, index) => {
                                    if(index < 4){
                                        return (
                                            <div class="col-sm-6 col-xxl-3">
                                                <Link to={`/user/prompt-questions/${ Helpers.encryptString(template.id) }/${ template.name.replaceAll(" ", "-") }`}>
                                                    <div class="card card-full">
                                                        <div class="card-body">
                                                            <div class="media media-rg media-middle media-circle text-primary bg-primary bg-opacity-20 mb-3">{ template.name.charAt(0) }</div>
                                                            <h5 class="fs-4 fw-medium">{ template.name }</h5>
                                                            <p class="small text-light">{ template.description }</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default UserDashboard;