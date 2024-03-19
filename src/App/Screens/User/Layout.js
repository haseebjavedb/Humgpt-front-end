import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Helpers from "../../Config/Helpers";
import moment from "moment";
import Moment from "react-moment";
import { X } from "react-feather";

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    Helpers.toast("success", "Logged out successfully");
    localStorage.clear();
    navigate("/");
  };
  

  const getUserIdFromLocalStorage = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser && storedUser.id;
    console.log("User ID:", userId);
    return userId;
};

useEffect(() => {
    Helpers.toggleCSS();
    setShowMobileNav(false);

    // Call the method to get user ID from localStorage
    getUserIdFromLocalStorage();
}, [location.pathname]);


  return (
    <div class="nk-app-root" data-sidebar-collapse="lg">
      <div class="nk-main">
        {showMobileNav && (
          <div
            onClick={() => setShowMobileNav(false)}
            className="sidebar-overlay"
          ></div>
        )}
        <div
          class={`nk-sidebar nk-sidebar-fixed ${isCompact && "is-compact"} ${
            showMobileNav && "sidebar-active"
          }`}
          id="sidebar"
        >
          <div class="nk-compact-toggle">
            <button
              onClick={() => setIsCompact(!isCompact)}
              class="btn btn-xs btn-outline-light btn-icon compact-toggle text-light bg-white rounded-3"
            >
              <em
                class={`icon off ni ${
                  isCompact ? "ni-chevron-right" : "ni-chevron-left"
                }`}
              ></em>
            </button>
          </div>
          <div class="nk-sidebar-element nk-sidebar-head">
            <div class="nk-sidebar-brand">
              <a href="/" class="logo-link">
                <div class="logo-wrap">
                  <img
                    class="logo-img logo-light"
                    src="/logo-white.png"
                    alt=""
                  />
                  <img
                    class="logo-img logo-dark"
                    src="/logo-white.png"
                    alt=""
                  />
                  <img
                    class="logo-img logo-icon compact-logo"
                    src="/favicon-white.png"
                    alt=""
                  />
                </div>
              </a>
              {/* <button onClick={() => setShowMobileNav(true)} class="btn btn-md btn-zoom btn-icon sidebar-toggle d-none d-sm-inline-flex"><X size={26} color="white" /></button> */}
            </div>
          </div>
          <div class="nk-sidebar-element nk-sidebar-body">
            <div class="nk-sidebar-content h-100" data-simplebar>
              <div class="nk-sidebar-menu" style={{ overflow: "auto" }}>
                <ul class="nk-menu">
                  <li class="nk-menu-item">
                    <Link to="/user/dashboard" class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-dashboard"></em>
                      </span>
                      <span class="nk-menu-text">Dashboard</span>
                    </Link>
                  </li>
                  <li class="nk-menu-item">
                    <Link to="/user/templates-library" class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-layers"></em>
                      </span>
                      <span class="nk-menu-text">Templates Library</span>
                    </Link>
                  </li>
                  <li class="nk-menu-item">
                    <Link to="/user/my-templates-library" class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-layers"></em>
                      </span>
                      <span class="nk-menu-text">My Templates Library</span>
                    </Link>
                  </li>

                  <li className="nk-menu-item">
                    <a
                      href="/user/prompt-questions/MTI=/Generate-Emails"
                      className="nk-menu-link"
                    >
                      <span className="nk-menu-icon">
                        <em className="icon ni ni-clock"></em>
                      </span>
                      <span className="nk-menu-text">Generate Email</span>
                    </a>
                  </li>

                  <li className="nk-menu-item">
                    <a
                      href="/user/prompt-questions/MTQ=/Generate-proposals"
                      className="nk-menu-link"
                    >
                      <span className="nk-menu-icon">
                        <em className="icon ni ni-file"></em>
                      </span>
                      <span className="nk-menu-text">Generate Proposal</span>
                    </a>
                  </li>
                  <li className="nk-menu-item">
                    <a
                      href="/user/prompt-questions/MTA=/Generate-plans"
                      className="nk-menu-link"
                    >
                      <span className="nk-menu-icon">
                        <em className="icon ni ni-text-rich"></em>
                      </span>
                      <span className="nk-menu-text">Generate Plans</span>
                    </a>
                  </li>
                  <li className="nk-menu-item">
                    <Link
                      to={"/user/Report-Prompt"}
                      className="nk-menu-link"
                    >
                      <span className="nk-menu-icon">
                        <em className="icon ni ni-layers"></em>
                      </span>
                      <span className="nk-menu-text">Generate Reports</span>
                    </Link>
                  </li>

                  <li class="nk-menu-item">
                    <Link to="/user/chat-history" class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-clock"></em>
                      </span>
                      <span class="nk-menu-text">History</span>
                    </Link>
                  </li>

                  <li class="nk-menu-item">
                    <Link to={"/user/categories"} class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-tag"></em>
                      </span>
                      <span class="nk-menu-text">Categories</span>
                    </Link>
                  </li>
                  <li class="nk-menu-item">
                    <Link to={"/user/Prompt"} class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-text-rich"></em>
                      </span>
                      <span class="nk-menu-text">Documents</span>
                    </Link>
                  </li>
                  <li class="nk-menu-item">
                    <Link to={"/user/prompts"} class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-file"></em>
                      </span>
                      <span class="nk-menu-text">Prompts</span>
                    </Link>
                  </li>
                  <li class="nk-menu-item">
                    <Link to={"/user/instructions"} class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-info"></em>
                      </span>
                      <span class="nk-menu-text">Instructions</span>
                    </Link>
                  </li>
                  <li class="nk-menu-item">
                    <Link to={"/user/buttons"} class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-view-grid"></em>
                      </span>
                      <span class="nk-menu-text">Automation Buttons</span>
                    </Link>
                  </li>
                  <li class="nk-menu-item">
                    <Link to={"/user/pricing-plans"} class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-sign-usdc"></em>
                      </span>
                      <span class="nk-menu-text">Pricing Plans</span>
                    </Link>
                  </li>
                  <li class="nk-menu-item">
                    <a href="#!" onClick={logout} class="nk-menu-link">
                      <span class="nk-menu-icon">
                        <em class="icon ni ni-signout"></em>
                      </span>
                      <span class="nk-menu-text">Sign Out</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="nk-sidebar-element nk-sidebar-footer">
            <div class="nk-sidebar-footer-extended pt-3">
              <div class="border border-primary rounded-3">
                <div class="px-3 py-2 border-light rounded-top-3">
                  <div class="d-flex flex-wrap align-items-center justify-content-between">
                    <h6 class="lead-text color-primary">
                      {Helpers.authUser.plan_name}
                    </h6>
                    <Link class="link color-white" to={"/user/pricing-plans"}>
                      <em class="ni ni-spark-fill icon text-warning"></em>
                      <span>Upgrade</span>
                    </Link>
                  </div>
                  <h6 class="lead-text mt-2">
                    <span className="color-white">Expire On: </span>
                    <Moment
                      className="color-primary"
                      date={Helpers.authUser.expire_date}
                      format="MMM Do YYYY"
                    />
                  </h6>
                </div>
                <Link
                  class="d-flex px-3 py-2 bg-primary bg-opacity-10 rounded-bottom-3"
                  to={`/user/profile/${getUserIdFromLocalStorage()}`}
                >
                  <div class="media-group">
                    <div class="media media-sm media-middle media-circle text-bg-primary">
                      <img
                        className="chat-avatar"
                        src={Helpers.serverImage(Helpers.authUser.profile_pic)}
                        alt=""
                      />
                    </div>
                    <div class="media-text">
                      <h6 class="fs-6 mb-0 color-white">
                        {Helpers.authUser.name}
                      </h6>
                    </div>
                    <em class="icon ni ni-chevron-right ms-auto ps-1 color-white"></em>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div class="nk-wrap">
          <div class="nk-header nk-header-fixed">
            <div class="container-fluid">
              <div class="nk-header-wrap">
                <div class="nk-header-logo ms-n1">
                  <div class="nk-sidebar-toggle me-1">
                    <button class="btn btn-sm btn-zoom btn-icon sidebar-toggle d-sm-none">
                      <em class="icon ni ni-menu"> </em>
                    </button>
                    <button
                      onClick={() => setShowMobileNav(true)}
                      class="btn btn-md btn-zoom btn-icon sidebar-toggle d-none d-sm-inline-flex"
                    >
                      <em class="icon ni ni-menu"> </em>
                    </button>
                  </div>
                  <a href="index-2.html" class="logo-link">
                    <div class="logo-wrap">
                      <img
                        class="logo-img logo-light"
                        src="/logo-dashboard.png"
                        srcset="/logo-dashboard.png 2x"
                        alt=""
                      />
                      <img
                        class="logo-img logo-dark"
                        src="/logo-dashboard.png"
                        srcset="/logo-dashboard.png 2x"
                        alt=""
                      />
                      <img
                        class="logo-img logo-icon"
                        src="/logo-dashboard.png"
                        srcset="/logo-dashboard.png 2x"
                        alt=""
                      />
                    </div>
                  </a>
                </div>
                <div class="nk-header-tools">
  <ul class="nk-quick-nav ms-2">
    <li class="dropdown d-inline-flex">
      
      <Link to={`/user/profile/${getUserIdFromLocalStorage()}`} class="nk-menu-link">
        <div class="media media-sm media-middle media-circle text-bg-primary">
          <img
            className="chat-avatar"
            src={Helpers.serverImage(
              Helpers.authUser.profile_pic
            )}
            alt=""
          />
        </div>
      </Link>
    </li>
  </ul>
</div>

              </div>
            </div>
          </div>
          <Outlet />
          {!location.pathname.includes("/chat") && (
            <div class="nk-footer">
              <div class="container-xl">
                <div class="d-flex align-items-center flex-wrap justify-content-between mx-n3">
                  <div class="nk-footer-links px-3">
                    <ul class="nav nav-sm">
                      <li class="nav-item">
                        <a class="nav-link" href="#!">
                          Home
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#!">
                          Pricing
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#!">
                          Privacy Policy
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#!">
                          FAQ
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#!">
                          Contact
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="nk-footer-copyright fs-6 px-3">
                    &copy; 2023 All Rights Reserved to <a href="#!">HumGPT</a>.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
