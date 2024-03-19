import { Link, useNavigate } from "react-router-dom";
import useTitle from "../../Hooks/useTitle";
import { useEffect, useState } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";

const RecoverPassword = () => {
    useTitle("Recover Password");

    const navigate = useNavigate();

    const defaultUser = {
        user_id: "",
        password: "",
        password_confirmation: "",
    }

    const [user, setUser] = useState(defaultUser);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleRecoverPassword = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios.post(`${Helpers.apiUrl}auth/recover-password`, user, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            localStorage.clear();
            navigate("/login");
            setIsLoading(false);
        }).catch(error => {
            setErrors(error.response.data.errors || {});
            Helpers.toast("error", error.response.data.message);
            setIsLoading(false);
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
                                <h6 class="overline-title text-primary">Recover Password</h6>
                                <h2 class="title">Create a new password for your account</h2>
                            </div>
                        </div>
                    </div>
                    <div class="section-content mb-100">
                        <div class="row g-gs justify-content-center">
                            <div class="col-md-7 col-lg-6 col-xl-5">
                                <div class="card border-0 shadow-sm rounded-4">
                                    <div class="card-body">
                                        <form onSubmit={handleRecoverPassword}>
                                            <div class="row g-1">
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <label class="form-label" for="toggle-password">Password</label>
                                                        <div class="form-control-wrap">
                                                            <input type="password" value={user.password} onChange={e => setUser({...user, password: e.target.value})} class="form-control form-control-lg" placeholder="Enter Password" />
                                                            <small className="text-danger">{ errors.password ? errors.password[0] : '' }</small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="form-group">
                                                        <label class="form-label" for="toggle-password">Confirm Password</label>
                                                        <div class="form-control-wrap">
                                                            <input type="password" value={user.password_confirmation} onChange={e => setUser({...user, password_confirmation: e.target.value})} class="form-control form-control-lg" placeholder="Confirm Password"  />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="form-group"><button class="btn btn-primary btn-block" type="submit" disabled={isLoading} onClick={handleRecoverPassword}>{isLoading ? 'Please wait...' : 'Update Password'}</button></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default RecoverPassword;