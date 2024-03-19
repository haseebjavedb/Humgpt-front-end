import { Link, useNavigate } from "react-router-dom";
import useTitle from "../../Hooks/useTitle";
import { useState } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";

const ForgotPassword = () => {
    useTitle("Forgot Password");

    const defaultUser = {
        email: "",
    }

    const navigate = useNavigate();

    const [user, setUser] = useState(defaultUser);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios.post(`${Helpers.apiUrl}auth/forgot-password`, user).then(response => {
            Helpers.toast("success", response.data.message);
            Helpers.setItem("user_id", response.data.user_id);
            navigate('/verify-email-password');
            setIsLoading(false);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
            setIsLoading(false);
        })
    }
    
    return (
        <main class="nk-pages">
            <section class="section section-bottom-0 pb-5 has-mask">
                <div class="nk-shape bg-shape-blur-k end-50 top-0"></div>
                <div class="nk-shape bg-shape-blur-l start-50 top-75"></div>
                <div class="container">
                    <div class="section-head">
                        <div class="row justify-content-center text-center">
                            <div class="col-lg-11 col-xl-10 col-xxl-9">
                                <h6 class="overline-title text-primary">Forgot Your Password?</h6>
                                <h2 class="title">Don't worry enter your email address to create a new password</h2>
                            </div>
                        </div>
                    </div>
                    <div class="section-content mb-100">
                        <div class="row g-gs justify-content-center">
                            <div class="col-md-7 col-lg-6 col-xl-5">
                                <div class="card border-0 shadow-sm rounded-4">
                                    <div class="card-body">
                                        <form onSubmit={handleForgotPassword}>
                                            <div class="row g-2">
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <label class="form-label">Email</label>
                                                        <div class="form-control-wrap">
                                                            <input type="email" value={user.email} onChange={e => setUser({...user, email:e.target.value})} class="form-control form-control-lg" placeholder="Enter Email Address" />
                                                            <small className="text-danger">{ errors.email ? errors.email[0] : '' }</small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="form-group"><button class="btn btn-primary btn-block" type="submit" disabled={isLoading} onClick={handleForgotPassword}>{isLoading ? 'Please wait...' : 'Verify Email Address'}</button></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <p class="text-center mt-4">Back to account login? <Link to="/login">Sign In</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default ForgotPassword;