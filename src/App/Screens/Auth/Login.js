import { Link } from "react-router-dom";
import useTitle from "../../Hooks/useTitle";
import { useState } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";

const Login = () => {
    useTitle("Login");

    const defaultUser = {
        email: "",
        password: "",
    }

    const [user, setUser] = useState(defaultUser);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios.post(`${Helpers.apiUrl}auth/login`, user).then(response => {
            Helpers.toast("success", response.data.message);
            Helpers.setItem("user", response.data.user, true);
            Helpers.setItem("token", response.data.token);
            const loginTimestamp = new Date().getTime();
            Helpers.setItem("loginTimestamp", loginTimestamp);
            if(response.data.user.user_type == 1){
                window.location.href = "/admin/dashboard";
            }else{
                window.location.href = "/user/dashboard";
            }
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
                                <h6 class="overline-title text-primary">Welcome Back!</h6>
                                <h2 class="title">Login to countinue</h2>
                            </div>
                        </div>
                    </div>
                    <div class="section-content mb-100">
                        <div class="row g-gs justify-content-center">
                            <div class="col-md-7 col-lg-6 col-xl-5">
                                <div class="card border-0 shadow-sm rounded-4">
                                    <div class="card-body">
                                        <form onSubmit={handleLogin}>
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
                                                    <div class="form-group">
                                                        <label class="form-label" for="toggle-password">Password</label>
                                                        <div class="form-control-wrap">
                                                            <input type="password" value={user.password} onChange={e => setUser({...user, password:e.target.value})} class="form-control form-control-lg" placeholder="Enter Password" required />
                                                            <small className="text-danger">{ errors.password ? errors.password[0] : '' }</small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="d-flex flex-wrap justify-content-between has-gap g-3">
                                                        <Link to={'/forgot-password'} class="small">Forgot Password?</Link>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="form-group"><button class="btn btn-primary btn-block" type="submit" disabled={isLoading} onClick={handleLogin}>{isLoading ? 'Please wait...' : 'Login'}</button></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <p class="text-center mt-4">Don't have an account? <Link to="/register">Register</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login;