import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Helpers from "../Config/Helpers";

const Layout = () => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('');

    const checkUser = () => {
        let token = Helpers.getItem("token");
        let user = Helpers.getItem("user", true);
        if (user && token) {
            setIsLoggedIn(true);
            if (user.user_type == 1) {
                setUserType("admin");
            } else {
                setUserType("user");
            }
        }
    }

    useEffect(() => {
        Helpers.toggleCSS();
        checkUser();
    }, [location.pathname]);

    return (
        <div className="nk-app-root">
            <header className="nk-header bg-darker is-dark has-mask overflow-hidden">
                <div className="nk-shape bg-shape-blur-pp ms-n30p mt-n20p start-50 translate-middle-x"></div>
                <div className="nk-shape bg-shape-blur-o ms-30p mb-n30p start-50 translate-middle-x"></div>
                <div className="nk-shape bg-shape-blur-p ms-n50p mt-40p start-50 translate-middle-y"></div>
                <div className="nk-mask bg-pattern-noise-a"></div>
                <div className="nk-mask bg-angle bg-angle-bottom bg-angle-white"></div>
                <div className="nk-header-main nk-menu-main is-transparent will-shrink on-dark ignore-mask">
                    <div className="container">
                        <div className="nk-header-wrap">
                            <div className="nk-header-logo">
                                <a href="/" className="logo-link">
                                    <div className="logo-wrap">
                                        <img className="logo-img logo-125 logo-light" src="assets/images/logo.png" srcset="/logo.png 2x" alt="" />
                                        <img className="logo-img logo-125 logo-dark" src="assets/images/logo.png" srcset="/logo.png 2x" alt="" />
                                    </div>
                                </a>
                            </div>
                            <div className="nk-header-toggle">
                                <button className="dark-mode-toggle"><em className="off icon ni ni-sun-fill"></em><em className="on icon ni ni-moon-fill"></em></button>
                                <button className="btn btn-light btn-icon header-menu-toggle"><em className="icon ni ni-menu"></em></button>
                            </div>
                            <nav className="nk-header-menu nk-menu">
                                <ul className="nk-menu-list mx-auto">
                                    <li className="nk-menu-item">
                                        <Link to="/" className="nk-menu-link"><span className="nk-menu-text">Home</span></Link>
                                    </li>
                                    <li className="nk-menu-item">
                                        <a href="/features" className="nk-menu-link"><span className="nk-menu-text">Features</span></a>
                                    </li>
                                    <li className="nk-menu-item">
                                        <a href="/pricing" className="nk-menu-link"><span className="nk-menu-text">Pricing</span></a>
                                    </li>
                                    <li className="nk-menu-item">
                                        <a href="/terms" className="nk-menu-link"><span className="nk-menu-text">Terms</span></a>
                                    </li>
                                    <li className="nk-menu-item">
                                        <a href="/privacy" className="nk-menu-link"><span className="nk-menu-text">Privacy</span></a>
                                    </li>
                                </ul>
                                <div class="mx-2 d-none d-lg-block"><button class="dark-mode-toggle"><em
                                    class="off icon ni ni-sun-fill"></em><em
                                        class="on icon ni ni-moon-fill"></em></button></div>
                                <ul class="nk-menu-buttons flex-lg-row-reverse">
                                    {isLoggedIn && <li><Link to={`/${userType}/dashboard`} className="btn btn-primary">{userType === 'admin' ? 'Dashboard' : 'Start Writing'}</Link></li>}
                                    {!isLoggedIn && <li><Link to={`/login`} className="btn btn-primary">Sign In</Link></li>}
                                    <li class="dropdown"><a class="link link-base fw-medium dropdown-toggle" href="#"
                                        data-bs-toggle="dropdown" data-bs-offset="0, 12"> En (US) </a>
                                        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-sm border-0">
                                            <li><a class="dropdown-item py-2 px-4" href="#">Albanian (SQ)</a></li>
                                            <li><a class="dropdown-item py-2 px-4" href="#">Chinese (ZS)</a></li>
                                            <li><a class="dropdown-item py-2 px-4" href="#">French (FR)</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                {/* Hero section for the homepage */}
                {location.pathname === "/" && (
                    <div className="nk-hero pt-sm-5 pt-lg-5 pb-6 pb-sm-8 pb-lg-9">
                        <div className="container">
                            <div className="row align-items-center justify-content-center justify-content-xl-between flex-lg-row-reverse g-gs">
                                <div className="col-sm-10 col-md-7 col-lg-6 col-xl-5">
                                    <div className="nk-hero-gfx mt-n5 mb-n6 my-xl-0 ms-xl-n8 me-xl-n6">
                                        <img className="w-100" src="assets/images/gfx/banner/f.png" alt="" />
                                    </div>
                                </div>
                                <div className="col-md-11 col-lg-9 col-xl-6 col-xxl-6">
                                    <div className="nk-hero-content text-center text-xl-start">
                                        <h1 className="title display-6 mb-3 mb-lg-4">Scale your content strategy <span>with AI</span></h1>
                                        <p className="lead mb-4 mb-lg-5 pe-xxl-6">AI writing assistant that helps you create high-quality content, in just a few seconds, at a fraction of the cost!</p>
                                        <div className="pt-2 pb-5">
                                            <form action="#">
                                                <div className="d-flex flex-column flex-sm-row bg-white rounded-3 p-2 mx-sm-4 mx-lg-0 me-xxl-11">
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                        <div className="text-primary me-3 ps-3 fs-4"><em className="icon ni ni-mail"></em></div>
                                                        <div className="form-group flex-grow-1">
                                                            <div className="form-control-wrap">
                                                                <input className="form-control-plaintext" type="text" placeholder="Enter your email" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group mt-2 mt-sm-0">
                                                        <button className="btn btn-lg btn-primary w-100">Sign Up Free</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div
                                            className="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-xl-start pt-2">
                                            <ul className="d-flex align-items-center has-gap g-1 text-warning">
                                                <li className="d-inline-flex"><em className="icon fs-5 ni ni-star-fill"></em></li>
                                                <li className="d-inline-flex"><em className="icon fs-5 ni ni-star-fill"></em></li>
                                                <li className="d-inline-flex"><em className="icon fs-5 ni ni-star-fill"></em></li>
                                                <li className="d-inline-flex"><em className="icon fs-5 ni ni-star-fill"></em></li>
                                                <li className="d-inline-flex"><em className="icon fs-5 ni ni-star-fill"></em></li>
                                            </ul><span className="fs-5 ms-3">Based on 10,000+ reviews on</span>
                                        </div>
                                        <ul className="d-flex flex-wrap justify-content-center justify-content-xl-start pt-3 has-gap gy-3">
                                            <li className="px-3"><img className="h-1-5rem" src="assets/images/brands/72-b-tone-white.png" alt="" /></li>
                                            <li className="px-3"><img className="h-1-5rem" src="assets/images/brands/72-c-tone-white.png" alt="" /></li>
                                            <li className="px-3"><img className="h-1-5rem" src="assets/images/brands/72-d-tone-white.png" alt="" /></li>
                                            <li className="px-3"><img className="h-1-5rem" src="assets/images/brands/72-e-tone-white.png" alt="" /></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
            <Outlet />
            <footer className="nk-footer bg-darker is-dark has-mask has-shape pt-6 overflow-hidden">
                <div className="nk-mask bg-angle bg-angle-bottom bg-angle-flip bg-angle-white"></div>
                <div className="nk-shape bg-shape-blur-n ms-n30p mt-n20p start-50 translate-middle-x"></div>
                <div className="nk-shape bg-shape-blur-o ms-30p mb-n30p start-50 translate-middle-x"></div>
                <div className="section section-sm bg-transparent">
                    <div className="container">
                        <div class="row g-5">
                            <div class="col-xl-4 col-lg-7 col-md-9 me-auto">
                                <div class="block-text pe-xxl-5">
                                    <a href="/" class="logo-link mb-4">
                                        <div class="logo-wrap"><img class="logo-img logo-light" src="assets/images/logo.png" alt="" /><img
                                            class="logo-img logo-dark" src="assets/images/logo-dark.png"
                                            alt="" />
                                        </div>
                                    </a>
                                    <h4 class="title mb-3">Save time. Get inspired.</h4>
                                    <p>CopyGen is an artificial intelligence trained to automate important tasks such as
                                        writing optimized product descriptions, high-converting ad copy, blog outlines, and
                                        more!</p>
                                </div>
                            </div>
                            <div class="col-xl">
                                <div class="row g-gs">
                                    <div class="col-lg-3 col-sm-4 col-6">
                                        <div class="wgs">
                                            <h6 class="wgs-title overline-title text-heading mb-4 mb-4">Company</h6>
                                            <ul class="list gy-2 list-link-base">
                                                <li><a class="link-base" href="/">About Us</a></li>
                                                <li><a class="link-base" href="/">Careers</a></li>
                                                <li><a class="link-base" href="/">Community</a></li>
                                                <li><a class="link-base" href="/">Creator Program</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-lg-3 col-sm-4 col-6">
                                        <div class="wgs">
                                            <h6 class="wgs-title overline-title text-heading mb-4">Use Case</h6>
                                            <ul class="list gy-2 list-link-base">
                                                <li><a class="link-base" href="/">Blog writing</a></li>
                                                <li><a class="link-base" href="/">Social media Ads</a></li>
                                                <li><a class="link-base" href="/">Creative writing</a></li>
                                                <li><a class="link-base" href="/">Magic command</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-lg-3 col-sm-4 col-6">
                                        <div class="wgs">
                                            <h6 class="wgs-title overline-title text-heading mb-4">Use Case</h6>
                                            <ul class="list gy-2 list-link-base">
                                                <li><a class="link-base" href="/">Contact Us</a></li>
                                                <li><a class="link-base" href="/">Weekly Demos</a></li>
                                                <li><a class="link-base" href="/">Report a Bug</a></li>
                                                <li><a class="link-base" href="/">Request a New Feature</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-lg-3 col-md-5 col-sm-6">
                                        <div class="wgs">
                                            <h6 class="wgs-title overline-title text-heading mb-4">Get In Touch</h6>
                                            <ul class="list gy-3">
                                                <li><em class="icon text-primary fs-5 ni ni-mail-fill"></em> <span>support@copygen.com</span></li>
                                                <li><em class="icon text-primary fs-5 ni ni-call-alt-fill"></em> <span>+(642) 342 762 44</span></li>
                                                <li><em class="icon text-primary fs-5 ni ni-map-pin-fill"></em> <span>442 Belle St Floor 7, San Francisco, AV 4206</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section section-0 bg-transparent">
                    <hr class="border-opacity-25 border-primary m-0" />
                    <div class="container">
                        <div class="py-4">
                            <div class="row">
                                <div class="col-md">
                                    <p class="mb-2 mb-md-0">Copyright &copy; 2023. <a href="/" class="fw-bold text-base">HumGPT.AI</a>.</p>
                                </div>
                                <div class="col-md">
                                    <ul class="list list-row gx-4 justify-content-start justify-content-md-end">
                                        <li><a href="/" class="link-primary">Terms</a></li>
                                        <li><a href="/" class="link-primary">Privacy Policy</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Layout;