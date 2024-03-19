import { Link } from "react-router-dom";
import useTitle from "../../Hooks/useTitle";
import { useState, useEffect } from "react";
import axios from "axios";
import Helpers from "../../Config/Helpers";
import { GoogleLogin, GoogleLogout } from "react-google-login";

const Login = () => {
  useTitle("Login");

  const defaultUser = {
    email: "",
    password: "",
  };

  const [user, setUser] = useState(defaultUser);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(null); // State to hold the token
  const clientId =
    "9745213746-sqsnhe5o1njvvul2ouqd5qkvfbm7r16r.apps.googleusercontent.com";

  useEffect(() => {
    // Check if token exists in local storage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${Helpers.apiUrl}auth/login`, user)
      .then((response) => {
        Helpers.toast("success", response.data.message);
        Helpers.setItem("user", response.data.user, true);
        Helpers.setItem("token", response.data.token);
        setToken(response.data.token); // Set token in state
        const loginTimestamp = new Date().getTime();
        Helpers.setItem("loginTimestamp", loginTimestamp);
        if (response.data.user.user_type === 1) {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
        setIsLoading(false);
      })
      .catch((error) => {
        Helpers.toast("error", error.response.data.message);
        setErrors(error.response.data.errors || {});
        setIsLoading(false);
      });
  };

  const onSuccess = (res) => {
    console.log("Login success", res.profileObj);
    const googleId = localStorage.getItem("google_id");
    console.log("Google ID:", googleId);
  };
  
  const onFailure = () => {
    console.log("Login Failed");
  };

  const onLogoutSuccess = () => {
    console.log("Logout success");
    localStorage.removeItem("token"); // Remove token from local storage on logout
    setToken(null); // Clear token state
    // Perform any additional actions after logout (e.g., redirecting to home page)
  };

  const onLogoutFailure = (error) => {
    console.error("Logout failed:", error);
    // Handle logout failure (e.g., show an error message)
  };

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
                              onSuccess={onSuccess}
                              onFailure={onFailure}
                              cookiePolicy={"single_host_origin"}
                            />
                          </div>
                          <div className="form-group">
                            <GoogleLogout
                              clientId={clientId}
                              buttonText="Logout with Google"
                              onLogoutSuccess={onLogoutSuccess}
                              onLogoutFailure={onLogoutFailure}
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
