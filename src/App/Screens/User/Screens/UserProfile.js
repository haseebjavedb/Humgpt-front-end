import axios from "axios";
import Helpers from "../../../Config/Helpers";
import { useEffect, useState } from "react";
import PageLoader from "../../../Components/Loader/PageLoader";
import useTitle from "../../../Hooks/useTitle";
import TextInput from "../../../Components/Input";
import { useParams } from "react-router-dom";


const UserProfile = () => {

    useTitle("Account Profile");

    const defaultPass = {
        password: "",
        password_confirmation: "",
    }
    const { user_id } = useParams();


    const [user, setUser] = useState({});
    const [pageLoading, setPageLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [password, setPassword] = useState(defaultPass);
    const [errors, setErrors] = useState({});

    const getProfileInfo = () => {
        setPageLoading(true);
        axios.get(`${Helpers.apiUrl}user/info/${ user_id }`, Helpers.authHeaders).then(response => {
            Helpers.setItem('user', response.data.user, true);
            setUser(response.data.user);
            // console.log(response.data.user);
            setPageLoading(false);
        });
    }

    const updateProfilePic = e => {
        setIsLoading(true);
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('profile_pic', file);
        axios.post(`${Helpers.apiUrl}user/update-picture`, formData, Helpers.authFileHeaders).then(response => {
            setIsLoading(false);
            window.location.reload();
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            setIsLoading(false);
        })
    }

    const updatePasswod = () => {
        setIsLoading(true);
        axios.post(`${Helpers.apiUrl}user/update-password`, password, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            setUpdatePassword(false);
            setPassword(defaultPass);
            setIsLoading(false);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
            setIsLoading(false);
        })
    }

    useEffect(() => {
        getProfileInfo();
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content"><h2 class="display-6">Personal Account</h2></div>
                            </div>
                        </div>
                        {!updatePassword && <div class="nk-block">
                            <ul class="nav nav-tabs mb-3 nav-tabs-s1">
                                <li class="nav-item"><button class={`nav-link ${ activeTab === 'profile' && 'active' }`} type="button" onClick={() => setActiveTab('profile')}>Profile</button></li>
                                <li class="nav-item"><button class={`nav-link ${ activeTab === 'billing' && 'active' }`} type="button" onClick={() => setActiveTab('billing')}>Payment &amp; Billing</button></li>
                            </ul>
                            <div class="tab-content">
                                <div class={`tab-pane fade ${ activeTab === 'profile' ? 'show active' : '' }`} id="profile-tab-pane">
                                    <div class="d-flex align-items-center justify-content-between border-bottom border-light mt-5 pb-1">
                                        <h5>Personal Details</h5>
                                        {/* <a class="link link-primary fw-normal" href="#!">Edit Profile</a> */}
                                    </div>
                                    <table class="table table-flush table-middle mb-0">
                                        <tbody>
                                            <tr>
                                                <td class="tb-col"><span class="fs-15px text-light">Profile Picture</span></td>
                                                <td class="tb-col">
                                                    <span class="fs-15px text-base"><img className="profile-pic" src={Helpers.serverImage(user.profile_pic)} alt="" /></span>
                                                    <label for="profile_picture_select"><span className="btn btn-primary btn-sm ml10">Update Profile Picture</span></label>
                                                    <input id="profile_picture_select" onChange={updateProfilePic} className="d-none" type="file" />
                                                </td>
                                                <td class="tb-col tb-col-end tb-col-sm"></td>
                                            </tr>
                                            <tr>
                                                <td class="tb-col"><span class="fs-15px text-light">Full Name</span></td>
                                                <td class="tb-col"><span class="fs-15px text-base">{ user.name }</span></td>
                                                <td class="tb-col tb-col-end tb-col-sm"></td>
                                            </tr>
                                            <tr>
                                                <td class="tb-col"><span class="fs-15px text-light">Email</span></td>
                                                <td class="tb-col"><span class="fs-15px text-base">{ user.email }</span></td>
                                                <td class="tb-col tb-col-end tb-col-sm"></td>
                                            </tr>
                                            <tr>
                                                <td class="tb-col"><span class="fs-15px text-light">Password</span></td>
                                                <td class="tb-col">
                                                    <span class="fs-15px text-base"><a class="link link-primary fw-normal" href="#!" onClick={() => setUpdatePassword(true)}>Change Password</a></span>
                                                </td>
                                                <td class="tb-col tb-col-end tb-col-sm"><span class="fs-13px text-light">Last changed at Feb 10, 2023</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class={`tab-pane fade ${ activeTab === 'billing' ? 'show active' : '' }`} id="payment-billing-tab-pane">
                                    <div class="d-flex flex-wrap align-items-center justify-content-between border-bottom border-light mt-5 mb-4 pb-1">
                                        <h5 class="mb-0">Your Subscription</h5>
                                        <ul class="d-flex gap gx-4">
                                            <li><a class="link link-danger fw-normal" data-bs-toggle="modal" href="#cancelSubscriptionModal">Cancel Subscription</a></li>
                                            <li><a class="link link-primary fw-normal" data-bs-toggle="modal" href="#changePlanModal">Change Plan</a></li>
                                        </ul>
                                    </div>
                                    <div class="alert alert-warning alert-dismissible fade show mb-4 rounded-6" role="alert">
                                        <p class="small mb-0">
                                            Save big up to 75% on your upgrade to our <strong><a class="alert-link" href="#">Enterprise plan</a></strong> and enjoy premium features at a fraction of the cost!
                                        </p>
                                        <div class="d-inline-flex position-absolute end-0 top-50 translate-middle-y me-2">
                                            <button type="button" class="btn btn-xs btn-icon btn-warning rounded-pill" data-bs-dismiss="alert"><em class="icon ni ni-cross"></em></button>
                                        </div>
                                    </div>
                                    <div class="row g-gs">
                                        <div class="col-xl-3 col-sm-6">
                                            <div class="card shadow-none">
                                                <div class="card-body">
                                                    <div class="text-light mb-2">Plan</div>
                                                    <h3 class="fw-normal">Professional Plan</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xl-3 col-sm-6">
                                            <div class="card shadow-none">
                                                <div class="card-body">
                                                    <div class="text-light mb-2">Recurring Payment</div>
                                                    <h3 class="fw-normal">$23/Month</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xl-3 col-sm-6">
                                            <div class="card shadow-none">
                                                <div class="card-body">
                                                    <div class="text-light mb-2">Next Due Date</div>
                                                    <h3 class="fw-normal">Mar 15, 2023</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xl-3 col-sm-6">
                                            <div class="card shadow-none">
                                                <div class="card-body">
                                                    <div class="text-light mb-2">Payment Method</div>
                                                    <div class="d-flex align-items-center">
                                                        <img src="https://copygen.themenio.com/dashboard/images//icons/paypal.png" alt="" class="icon" />
                                                        <h3 class="fw-normal ms-2">PayPal</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-between border-bottom border-light mt-5 mb-4 pb-2"><h5>Billing History</h5></div>
                                    <div class="card">
                                        <table class="table table-middle mb-0">
                                            <thead class="table-light">
                                                <tr>
                                                    <th class="tb-col"><div class="fs-13px text-base">Subscription</div></th>
                                                    <th class="tb-col tb-col-md"><div class="fs-13px text-base">Payment Date</div></th>
                                                    <th class="tb-col tb-col-sm"><div class="fs-13px text-base">Total</div></th>
                                                    <th class="tb-col tb-col-sm"><div class="fs-13px text-base">Status</div></th>
                                                    <th class="tb-col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="tb-col">
                                                        <div class="caption-text">
                                                            Starter - 12 Months
                                                            <div class="d-sm-none dot bg-success"></div>
                                                        </div>
                                                    </td>
                                                    <td class="tb-col tb-col-md">
                                                        <div class="fs-6 text-light d-inline-flex flex-wrap gap gx-2"><span>Feb 15,2023 </span> <span>02:31 PM</span></div>
                                                    </td>
                                                    <td class="tb-col tb-col-sm"><div class="fs-6 text-light">$23.00</div></td>
                                                    <td class="tb-col tb-col-sm"><div class="badge text-bg-success-soft rounded-pill px-2 py-1 fs-6 lh-sm">Paid</div></td>
                                                    <td class="tb-col tb-col-end"><a href="#" class="link">Get Invoice</a></td>
                                                </tr>
                                                <tr>
                                                    <td class="tb-col">
                                                        <div class="caption-text">
                                                            Starter - 12 Months
                                                            <div class="d-sm-none dot bg-warning"></div>
                                                        </div>
                                                    </td>
                                                    <td class="tb-col tb-col-md">
                                                        <div class="fs-6 text-light d-inline-flex flex-wrap gap gx-2"><span>Feb 15,2023 </span> <span>02:31 PM</span></div>
                                                    </td>
                                                    <td class="tb-col tb-col-sm"><div class="fs-6 text-light">$23.00</div></td>
                                                    <td class="tb-col tb-col-sm"><div class="badge text-bg-warning-soft rounded-pill px-2 py-1 fs-6 lh-sm">Faild</div></td>
                                                    <td class="tb-col tb-col-end"><a href="#" class="link">Get Invoice</a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {updatePassword && <div class="nk-block">
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <h3>Update Your Password</h3>
                                    <div class="row g-3 gx-gs">
                                        <form onSubmit={updatePasswod}>
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label class="form-label">New Password</label>
                                                    <div class="form-control-wrap">
                                                        <input type="password" value={password.password} onChange={e => setPassword({...password, password: e.target.value})} class="form-control" placeholder="Enter New Password" />
                                                        <small className="text-danger">{ errors.password ? errors.password[0] : '' }</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-12 mt-2">
                                                <div class="form-group">
                                                    <label class="form-label">Confirm Password</label>
                                                    <div class="form-control-wrap">
                                                        <input type="password" value={password.password_confirmation} onChange={e => setPassword({...password, password_confirmation: e.target.value})} class="form-control" placeholder="Confirm Your Password" />
                                                        <small className="text-danger">{ errors.password_confirmation ? errors.password_confirmation[0] : '' }</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div class="col-md-12">
                                            <button className="btn btn-primary" onClick={updatePasswod} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save New Password'}</button>
                                            <button className="btn btn-outline-danger ml10" onClick={() => setUpdatePassword(false)} disabled={isLoading}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default UserProfile;