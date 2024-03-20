import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import useTitle from "../../../Hooks/useTitle";
import axios from "axios";
import PageLoader from "../../../Components/Loader/PageLoader";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    useTitle("Dashboard");

    const [data, setData] = useState({});
    const [pageLoading, setPageLoading] = useState(true);

    const getInfo = () => {
        setPageLoading(true);
        axios.get(`${Helpers.apiUrl}admin/get`, Helpers.authHeaders).then(response => {
            setData(response.data);
            setPageLoading(false);
        });
    }

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content"><h2 class="display-6"> { Helpers.authUser.name }!</h2></div>
                            </div>
                        </div>
                        <div class="nk-block">
                            <div class="row g-gs">
                                <div class="col-sm-6 col-xxl-3">
                                    <div class="card card-full bg-purple bg-opacity-10 border-0">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-1">
                                                <div class="fs-6 text-light mb-0">Registered Users</div>
                                                <Link to={'/admin/users'} class="link link-purple">See All</Link>
                                            </div>
                                            <h5 class="fs-1">{ data.users.length } <small class="fs-3">Users</small></h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-xxl-3">
                                    <div class="card card-full bg-blue bg-opacity-10 border-0">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-1">
                                                <div class="fs-6 text-light mb-0">Prompt Templates</div>
                                                <Link to={'/admin/prompts'} class="link link-blue">See All</Link>
                                            </div>
                                            <h5 class="fs-1">{ data.templates.length } <small class="fs-3">Templates</small></h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-xxl-3">
                                    <div class="card card-full bg-indigo bg-opacity-10 border-0">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-1">
                                                <div class="fs-6 text-light mb-0">Automation Buttons</div>
                                                <Link to={'/admin/buttons'} class="link link-indigo">See All</Link>
                                            </div>
                                            <h5 class="fs-1">{ data.buttons.length } <small class="fs-3">Buttons</small></h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-xxl-3">
                                    <div class="card card-full bg-cyan bg-opacity-10 border-0">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-1">
                                                <div class="fs-6 text-light mb-0">Chat History</div>
                                                {/* <Link to={'/admin/chats-history'} class="link link-cyan">See All</Link> */}
                                            </div>
                                            <h5 class="fs-1">{ data.chats.length } <small class="fs-3">Chats</small></h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nk-block-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content"><h2 class="display-6">Popular Templates</h2></div>
                                <div class="nk-block-head-content"><Link to={'/admin/prompts'} class="link">Explore All</Link></div>
                            </div>
                        </div>
                        <div class="nk-block">
                            <div class="row g-gs">
                                {data.templates.map((template, index) => {
                                    if(index < 4){
                                        return (
                                            <div class="col-sm-6 col-xxl-3">
                                                <Link to={`/admin/prompt/questions/${ Helpers.encryptString(template.id) }`}>
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

export default AdminDashboard;