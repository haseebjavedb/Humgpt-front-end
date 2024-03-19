import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Helpers from "../../Config/Helpers";

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const logout = (e) => {
        e.preventDefault();
        Helpers.toast("success", "Logged out successfully");
        localStorage.clear();
        navigate('/');
    }

    useEffect(() => {
        Helpers.toggleCSS();
    }, [location.pathname]);


    return (
        <div class="nk-app-root" data-sidebar-collapse="lg">
            <div class="nk-main">
                <div class="nk-sidebar nk-sidebar-fixed" id="sidebar">
                    <div class="nk-compact-toggle">
                        <button class="btn btn-xs btn-outline-light btn-icon compact-toggle text-light bg-white rounded-3"><em class="icon off ni ni-chevron-left"></em><em class="icon on ni ni-chevron-right"></em></button>
                    </div>
                    <div class="nk-sidebar-element nk-sidebar-head">
                        <div class="nk-sidebar-brand">
                            <a href="/" class="logo-link">
                                <div class="logo-wrap">
                                    <img class="logo-img logo-light" src="/logo-white.png" alt="" />
                                    <img class="logo-img logo-dark" src="/logo-white.png" alt="" />
                                    <img class="logo-img logo-icon" src="/logo-white.png" alt="" />
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="nk-sidebar-element nk-sidebar-body">
                        <div class="nk-sidebar-content h-100" data-simplebar>
                            <div class="nk-sidebar-menu">
                                <ul class="nk-menu">
                                    <li class="nk-menu-item">
                                        <Link to={'/admin/dashboard'} class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-dashboard"></em></span><span class="nk-menu-text">Dashboard</span>
                                        </Link>
                                    </li>
                                    <li class="nk-menu-item">
                                        <Link to={'/admin/users'} class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-users"></em></span><span class="nk-menu-text">Users</span>
                                        </Link>
                                    </li>
                                    <li class="nk-menu-item">
                                        <Link to={'/admin/chat-history'} class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-clock"></em></span><span class="nk-menu-text">Chat History</span>
                                        </Link>
                                    </li>
                                    <li class="nk-menu-item">
                                        <Link to={'/admin/categories'} class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-tag"></em></span><span class="nk-menu-text">Categories</span>
                                        </Link>
                                    </li>
                                    <li class="nk-menu-item">
                                        <Link to={'/admin/prompts'} class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-file"></em></span><span class="nk-menu-text">Prompts</span>
                                        </Link>
                                    </li>
                                    <li class="nk-menu-item">
                                        <Link to={'/admin/instructions'} class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-info"></em></span><span class="nk-menu-text">Instructions</span>
                                        </Link>
                                    </li>
                                    <li class="nk-menu-item">
                                        <Link to={'/admin/buttons'} class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-view-grid"></em></span><span class="nk-menu-text">Automation Buttons</span>
                                        </Link>
                                    </li>
                                    <li class="nk-menu-item">
                                        <Link to={'/admin/stripe-products'} class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-sign-usdc"></em></span><span class="nk-menu-text">Stripe Products</span>
                                        </Link>
                                    </li>
                                    <li class="nk-menu-item">
                                        <a href="#!" onClick={logout} class="nk-menu-link">
                                            <span class="nk-menu-icon"><em class="icon ni ni-signout"></em></span><span class="nk-menu-text">Sign Out</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="nk-sidebar-element nk-sidebar-footer">
                        <div class="nk-sidebar-footer-extended pt-3">
                            <div class="border border-light rounded-3">
                                <a class="d-flex px-3 py-2 bg-primary bg-opacity-10 rounded-bottom-3" href="#!">
                                    <div class="media-group">
                                        <div class="media media-sm media-middle media-circle text-bg-primary"><img src={Helpers.serverImage(Helpers.authUser.profile_pic)} alt="" /></div>
                                        <div class="media-text">
                                            <h6 class="fs-6 mb-0">{Helpers.authUser.name}</h6>
                                        </div>
                                        <em class="icon ni ni-chevron-right ms-auto ps-1"></em>
                                    </div>
                                </a>
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
                                        <button class="btn btn-sm btn-zoom btn-icon sidebar-toggle d-sm-none"><em class="icon ni ni-menu"> </em></button>
                                        <button class="btn btn-md btn-zoom btn-icon sidebar-toggle d-none d-sm-inline-flex"><em class="icon ni ni-menu"> </em></button>
                                    </div>
                                    <a href="index-2.html" class="logo-link">
                                        <div class="logo-wrap">
                                            <img class="logo-img logo-light" src="images/logo.png" srcset="https://copygen.themenio.com/dashboard/images/logo2x.png 2x" alt="" />
                                            <img class="logo-img logo-dark" src="images/logo-dark.png" srcset="https://copygen.themenio.com/dashboard/images/logo-dark2x.png 2x" alt="" />
                                            <img class="logo-img logo-icon" src="images/logo-icon.png" srcset="https://copygen.themenio.com/dashboard/images/logo-icon2x.png 2x" alt="" />
                                        </div>
                                    </a>
                                </div>
                                <div class="nk-header-tools">
                                    <ul class="nk-quick-nav ms-2">
                                        <li class="dropdown d-inline-flex">
                                            <a data-bs-toggle="dropdown" class="d-inline-flex" href="#">
                                                <div class="media media-md media-circle media-middle text-bg-primary"><img src="images/avatar/a.png" /></div>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-md rounded-3">
                                                <div class="dropdown-content py-3">
                                                    <div class="border border-light rounded-3">
                                                        <div class="px-3 py-2 bg-white border-bottom border-light rounded-top-3">
                                                            <div class="d-flex flex-wrap align-items-center justify-content-between">
                                                                <h6 class="lead-text">Free Plan</h6>
                                                                <a class="link link-primary" href="#"><em class="ni ni-spark-fill icon text-warning"></em><span>Upgrade</span></a>
                                                            </div>
                                                            <div class="progress progress-md"><div class="progress-bar" data-progress="25%"></div></div>
                                                            <h6 class="lead-text mt-2">1,360 <span class="text-light">words left</span></h6>
                                                        </div>
                                                        <a class="d-flex px-3 py-2 bg-primary bg-opacity-10 rounded-bottom-3" href="profile.html">
                                                            <div class="media-group">
                                                                <div class="media media-sm media-middle media-circle text-bg-primary"><img src="images/avatar/a.png" /></div>
                                                                <div class="media-text">
                                                                    <h6 class="fs-6 mb-0">Shawn Mahbub</h6>
                                                                    <span class="text-light fs-7">shawn@websbd.com</span>
                                                                </div>
                                                                <em class="icon ni ni-chevron-right ms-auto ps-1"></em>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Outlet />
                    <div class="nk-footer">
                        <div class="container-xl">
                            <div class="d-flex align-items-center flex-wrap justify-content-between mx-n3">
                                <div class="nk-footer-links px-3">
                                    <ul class="nav nav-sm">
                                        <li class="nav-item"><a class="nav-link" href="../index-2.html#">Home</a></li>
                                        <li class="nav-item"><a class="nav-link" href="../index-2.html#">Pricing</a></li>
                                        <li class="nav-item"><a class="nav-link" href="../index-2.html#">Privacy Policy</a></li>
                                        <li class="nav-item"><a class="nav-link" href="../index-2.html#">FAQ</a></li>
                                        <li class="nav-item"><a class="nav-link" href="../index-2.html#">Contact</a></li>
                                    </ul>
                                </div>
                                <div class="nk-footer-copyright fs-6 px-3">&copy; 2023 All Rights Reserved to <a href="#!">HumGPT</a>.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;