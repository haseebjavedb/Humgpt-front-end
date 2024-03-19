import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import PageLoader from "../../../Components/Loader/PageLoader";
import { Link } from "react-router-dom";

const CustomPricingPlans = () => {
    const [plans, setPlans] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);
    
    const getPlans = () => {
        setPageLoading(true);
        axios.get(`${Helpers.apiUrl}plans/all`, Helpers.authHeaders).then(response => {
            setPlans(response.data.plans);
            setPageLoading(false);
        });
    }

    useEffect(() => {
        getPlans();
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">Pricing Plans</h2>
                                    <p>Generate unlimited copy 10X faster with our cost effective plan to write blog posts, social media ads and many more.</p>
                                </div>
                            </div>
                        </div>
                        <div class="nk-block">
                            <div class="mt-xl-5">
                                <div class="row g-0">
                                    {plans.map((plan, index) => {
                                        return (
                                            <div key={index} class="col-xl-4">
                                                <div class="card pricing bg-white rounded-start">
                                                    <div class="pricing-content">
                                                        <div class="w-sm-70 w-md-50 w-xl-100 text-center text-xl-start mx-auto">
                                                            <h5 class="fw-normal text-light">Basic</h5>
                                                            <h2 class="mb-3">{ plan.plan_name }</h2>
                                                            <div class="pricing-price-wrap">
                                                                <div class="pricing-price">
                                                                <h3 class="display-1 mb-3 fw-semibold">${ parseFloat(plan.monthly_price).toFixed(2) } <span class="caption-text text-light fw-normal"> / month</span></h3>
                                                                </div>
                                                            </div>
                                                            <div class="mb-2">
                                                                <Link to={`/user/subscribe-product/${ plan.id }`} class="btn btn-outline-light w-100">Upgrade Now</Link>
                                                                <div class="d-flex align-items-center justify-content-center text-center text-light fs-12px lh-lg fst-italic mt-1">
                                                                    <svg width="13" height="13" viewBox="0 0 13 13" class="text-danger" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M6.5 2.375V10.625" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                        <path d="M2.9281 4.4375L10.0719 8.5625" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                        <path d="M2.9281 8.5625L10.0719 4.4375" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path>
                                                                    </svg>
                                                                    <span class="ms-1">Cancel Anytime</span>
                                                                </div>
                                                            </div>
                                                            <ul class="pricing-features">
                                                                {plan.plan_features.map(feature => {
                                                                    return <li><em class="icon text-primary ni ni-check-circle"></em><span>{ feature.feature }</span></li>
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div class="mt-5">
                                <h5>Want to learn more about our pricing &amp; plans?</h5>
                                <p>Read our <a href="#">Plans</a>, <a href="!#">Billing &amp; Payment</a>, <a href="!#">FAQs</a> to learn more about our service.</p>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default CustomPricingPlans;