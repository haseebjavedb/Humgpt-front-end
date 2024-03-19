import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import PageLoader from "../../../Components/Loader/PageLoader";

const UserPricingPlans = () => {
    const [plans, setPlans] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);
    const [activePlanType, setActivePlanType] = useState('monthly');
    
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
                            <div class="pricing-toggle-wrap mb-4">
                                <button onClick={() => setActivePlanType('monthly')} class={`pricing-toggle-button ${ activePlanType === 'monthly' && 'active' }`} data-target="monthly">Monthly</button><button onClick={() => setActivePlanType('yearly')} class={`pricing-toggle-button ${ activePlanType === 'yearly' && 'active' }`} data-target="yearly">Yearly</button>
                            </div>
                            <div class="card mt-xl-5">
                                <div class="row g-0">
                                    {plans.map((plan, index) => {
                                        return (
                                            <div key={index} class="col-xl-4">
                                                <div class={index === 1 ? "pricing pricing-featured mx-n1px my-xl-n1px bg-primary mt-5" : "pricing bg-white rounded-start"}>
                                                    {index === 1 && <div class="position-absolute text-center py-1 px-4 text-bg-primary rounded-top start-0 end-0 bottom-100"><div class="fw-medium lh-sm fs-14px">Most Popular</div></div>}
                                                    <div class={`pricing-content ${ index === 1 && 'bg-primary-soft' }`}>
                                                        <div class="w-sm-70 w-md-50 w-xl-100 text-center text-xl-start mx-auto">
                                                            <h2 class={`mb-3 ${ index === 1 && 'text-primary' }`}>{ plan.plan_name }</h2>
                                                            <div class="pricing-price-wrap">
                                                                <div class={`pricing-price pricing-toggle-content monthly ${activePlanType === 'monthly' && 'active'}`}>
                                                                    <h3 class="display-1 mb-3 fw-semibold">{plan.monthly_sale_per > 0 && <del className="cut-price">${ plan.monthly_price } </del>} ${ parseInt(plan.final_monthly) } <span class="caption-text text-light fw-normal"> / month</span></h3>
                                                                </div>
                                                                <div class={`pricing-price pricing-toggle-content yearly ${activePlanType === 'yearly' && 'active'}`}>
                                                                    <h3 class="display-1 mb-3 fw-semibold">{plan.yearly_sale_per > 0 && <del className="cut-price">${ plan.yearly_price } </del>} ${ parseInt(plan.final_yearly) } <span class="caption-text text-light fw-normal"> / year</span></h3>
                                                                </div>
                                                            </div>
                                                            <div class="mb-2">
                                                                <p>{ plan.description }</p>
                                                            </div>
                                                            <div class="mb-2">
                                                                <button class={`btn ${ index === 1 ? 'btn-primary' : 'btn-outline-light' } w-100`}>Upgrade Now</button>
                                                                <div class="d-flex align-items-center justify-content-center text-center text-light fs-12px lh-lg fst-italic mt-1">
                                                                    <span class="ms-1">Cancel Anytime</span>
                                                                </div>
                                                            </div>
                                                            <ul class="pricing-features">
                                                                {plan.plan_features.map(feature => {
                                                                    return <li key={feature.id}><em class={`icon text-primary ni ${index === 1 ? 'ni-check-circle-fill' : 'ni-check-circle'}`}></em><span>{ feature.feature }</span></li>;
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
                                <p>Read our <a href="pricing-plans.html">Plans</a>, <a href="#">Billing &amp; Payment</a>, <a href="#">FAQs</a> to learn more about our service.</p>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default UserPricingPlans;