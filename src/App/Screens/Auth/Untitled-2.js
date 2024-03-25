import { Link, useNavigate } from "react-router-dom";
import useTitle from "../../Hooks/useTitle";
import { useEffect, useState } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";
import { GoogleLogin } from "react-google-login";
import { gapi } from 'gapi-script';
use

const Login = () => {
  useTitle("Login");

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${Helpers.apiUrl}auth/login`, user)
      .then((response) => {
        onLoginSuccess(response);
      })
      .catch((error) => {
        onLoginError(error);
      });
  };
  const responseGoogle = (response) => {
    if (response?.tokenId) {
      const userData = {
        name: response.profileObj.name, // Assuming you're using the Google Login library and 'profileObj' contains user's name
        email: response.profileObj.email, // Assuming you're using the Google Login library and 'profileObj' contains user's email
   
        googleId: response.profileObj.googleId // Assuming you're using the Google Login library and 'profileObj' contains user's Google ID
      };
  
      setIsLoading(true);
      axios
        .post(`${Helpers.apiUrl}auth/google-login`, userData )
        .then((response) => {
          onLoginSuccess(response);
        })
        .catch((error) => {
          onLoginError(error);
        });
    } else {
      console.error("Google login failed: ", response);
    }
  };
  

  const onLoginSuccess = (response) => {
    Helpers.toast("success", response.data.message)
    Helpers.setItem("user", response.data.user, true);
    Helpers.setItem("token", response.data.token);
    const loginTimestamp = new Date().getTime();
    Helpers.setItem("loginTimestamp", loginTimestamp);
    const userType = response.data.user.user_type === 1 ? "/admin/dashboard" : "/user/dashboard";
    navigate(userType);
    setIsLoading(false);
  };

  const onLoginError = (error) => {
    Helpers.toast("error", error.response?.data?.message || "An error occurred");
    setErrors(error.response?.data?.errors || {});
    setIsLoading(false);
  };

  useEffect(() => {
    gapi.load("auth2", () => {
      const auth2 = gapi.auth2.init({
        client_id: clientId,
        scope: "email"
      });
      auth2.then((result) => {
        // handle success if needed
      }).catch((err) => {
        console.log(err);
        Helpers.toast("error", err);
      });
    });
  }, [clientId]);

  return (
    <main className="nk-pages">
      <section className="section section-bottom-0 pb-5 has-mask">
        <div className="nk-shape bg-shape-blur-k end-50 top-0"></div>
        <div className="nk-shape bg-shape-blur-l start-50 top-75"></div>
        <div className="container">
          <div className="section-head">
            <div className="row justify-content-center text-center">
              <div className="col-lg-11 col-xl-10 col-xxl-9">
                <h6 className="overline-title text-primary">Welcome Back!</h6>
                <h2 className="title">Login to continue</h2>
              </div>
            </div>
          </div>
          <div className="section-content mb-100">
            <div className="row g-gs justify-content-center">
              <div className="col-md-7 col-lg-6 col-xl-5">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body">
                    <form onSubmit={handleLogin}>
                      <div className="row g-2">
                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="form-control-wrap">
                              <input
                                type="email"
                                value={user.email}
                                onChange={(e) =>
                                  setUser({ ...user, email: e.target.value })
                                }
                                className="form-control form-control-lg"
                                placeholder="Enter Email Address"
                              />
                              <small className="text-danger">
                                {errors.email ? errors.email[0] : ""}
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-label" htmlFor="toggle-password">
                              Password
                            </label>
                            <div className="form-control-wrap">
                              <input
                                type="password"
                                value={user.password}
                                onChange={(e) =>
                                  setUser({ ...user, password: e.target.value })
                                }
                                className="form-control form-control-lg"
                                placeholder="Enter Password"
                                required
                              />
                              <small className="text-danger">
                                {errors.password ? errors.password[0] : ""}
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex flex-wrap justify-content-between has-gap g-3">
                            <Link to={"/forgot-password"} className="small">
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <button
                              className="btn btn-primary btn-block"
                              type="submit"
                              disabled={isLoading}
                            >
                              {isLoading ? "Please wait..." : "Login"}
                            </button>
                          </div>
                          <div className="form-group">
                            <GoogleLogin
                              clientId={clientId}
                              buttonText="Login with Google"
                              onSuccess={responseGoogle}
                              onFailure={responseGoogle}
                              cookiePolicy={"single_host_origin"}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <p className="text-center mt-4">
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
