import { Link, useNavigate } from "react-router-dom";
import useTitle from "../../Hooks/useTitle";
import { useEffect, useState } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";

const Verify = () => {
    useTitle("Verify Email");

    const navigate = useNavigate();

    const defaultUser = {
        code: "",
        user_id: "",
    }

    const [user, setUser] = useState(defaultUser);
    const [isLoading, setIsLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [errors, setErrors] = useState({});

    const handleVerification = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios.post(`${Helpers.apiUrl}auth/verify-email`, user).then(response => {
            Helpers.toast("success", response.data.message);
            Helpers.setItem("user", response.data.user, true);
            Helpers.setItem("token", response.data.token);
            window.location.href = "/user/dashboard";
            setIsLoading(false);
        }).catch(error => {
            setErrors(error.response.data.errors || {});
            Helpers.toast("error", error.response.data.message);
            setIsLoading(false);
        });
    }

    const resendEmail = (e) => {
        e.preventDefault();
        setSendingEmail(true);
        axios.post(`${Helpers.apiUrl}auth/resend-email`, {user_id: user.user_id}).then(response => {
            Helpers.toast("success", response.data.message);
            setSendingEmail(false);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            setSendingEmail(false);
        });
    }

    useEffect(() => {
        const checkUserId = localStorage.getItem("user_id");
        if(checkUserId){
            setUser({...user, user_id: checkUserId});
        }else{
            navigate("/register");
        }
    }, []);

    return (
        <main class="nk-pages">
            <section class="section section-bottom-0 pb-5 has-mask">
                <div class="nk-shape bg-shape-blur-k end-50 top-0"></div>
                <div class="nk-shape bg-shape-blur-l start-50 top-75"></div>
                <div class="container">
                    <div class="section-head">
                        <div class="row justify-content-center text-center">
                            <div class="col-lg-11 col-xl-10 col-xxl-9">
                                <h6 class="overline-title text-primary">We've sent you an OTP to your provided email address. Check your inbox!</h6>
                                <h2 class="title">Verify Your Email Address</h2>
                            </div>
                        </div>
                    </div>
                    <div class="section-content mb-100">
                        <div class="row g-gs justify-content-center">
                            <div class="col-md-7 col-lg-6 col-xl-5">
                                <div class="card border-0 shadow-sm rounded-4">
                                    <div class="card-body">
                                        <form onSubmit={handleVerification}>
                                            <div class="row g-1">
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <label class="form-label" for="emailorusername">Verification Code</label>
                                                        <div class="form-control-wrap">
                                                            <input type="text" class="form-control form-control-lg" value={user.code} maxLength={6} onChange={e => setUser({...user, code: e.target.value})} placeholder="Enter Verification Code" />
                                                            <small className="text-danger">{ errors.code ? errors.code[0] : '' }</small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="form-group"><button class="btn btn-primary btn-block" type="submit" disabled={isLoading} onClick={handleVerification}>{isLoading ? 'Verifying...' : 'Verify Email'}</button></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <p class="text-center mt-4">Didn't received code? <Link onClick={resendEmail}>{sendingEmail ? 'Resending....' : 'Resend'}</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Verify;