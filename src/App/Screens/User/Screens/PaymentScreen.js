import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PageLoader from "../../../Components/Loader/PageLoader";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Helpers from "../../../Config/Helpers";

const PaymentScreen = () => {
    const defaultUser = Helpers.authUser;

    const stripe = useStripe();
    const elements = useElements();

    const [user, setUser] = useState(defaultUser);
    const [pageLoading, setPageLoading] = useState(false);
    const [plan, setPlan] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const {plan_id} = useParams();

    const getPlan = () => {
        setPageLoading(true);
        axios.get(`${Helpers.apiUrl}plans/single/${ plan_id }`, Helpers.authHeaders).then(response => {
            setPlan(response.data.plan);
            setPageLoading(false);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            navigate(-1);
            setPageLoading(false);
        })
    }

    const processPayment = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { token } = await stripe.createToken(elements.getElement(CardElement));
        if(token){
            let data = {
                plan_id: plan.id,
                token:token.id,
            }
            axios.post(`${Helpers.apiUrl}stripe/process-payment`, data, Helpers.authHeaders).then(response => {
                Helpers.toast("success", response.data.message);
                Helpers.setItem('user', response.data.user, true);
                setTimeout(() => {
                    window.location.href = '/user/dashboard';
                }, 1000);
            }).catch(error => {
                if(error.response){
                    Helpers.toast("error", error.response.data.message);
                }else{
                    Helpers.toast("error", "Unexpected error occured");
                }
                setIsLoading(false);
            });
        }else{
            Helpers.toast("error", "Unexpected error occured");
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getPlan();
    }, []);


    return (
        <div class="nk-content ">
            <div class="container-xl p0">
                <div class="nk-content-inner">
                    {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="d-flex flex-wrap flex-grow-1">
                            <div class="bg-lighter w-100 w-lg-50 d-flex align-items-center justify-content-center justify-content-lg-end p-4 p-sm-5">
                                <div class="wide-xs w-100">
                                    <div class="d-flex">
                                        <Link class="pe-2 d-flex align-items-center" to="/user/pricing-plans"><em class="icon ni ni-arrow-left text-light"></em></Link>
                                        <a href="#!" class="logo-link">
                                            <div class="logo-wrap">
                                                <img class="logo-img logo-light" src="/logo-dashboard.png" srcset="/logo-dashboard.png 2x" alt="" />
                                                <img class="logo-img logo-dark" src="/logo-dashboard.png" srcset="/logo-dashboard.png 2x" alt="" />
                                                <img class="logo-img logo-icon" src="/logo-dashboard.png" srcset="/logo-dashboard.png 2x" alt="" />
                                            </div>
                                        </a>
                                    </div>
                                    <div class="pt-4">
                                        <div class="fs-4 fw-normal">Subscribe to { plan.plan_name } ({ 'Monthly' })</div>
                                        <h3 class="display-1 fw-semibold">${ parseFloat(plan.monthly_price).toFixed(2) }<span class="caption-text text-light fw-normal"> per month</span></h3>
                                        <div class="fs-5 fw-normal mt-2">{ plan.description }</div>
                                    </div>
                                    <ul class="pricing-features">
                                        {plan.plan_features && plan.plan_features.map(feature => <li><em class="icon text-primary ni ni-check-circle"></em><span>{ feature.feature }</span></li>)}
                                    </ul>
                                    <div class="pt-lg-5"></div>
                                </div>
                            </div>
                            <div class="bg-white w-100 w-lg-50 d-flex align-items-center justify-content-center justify-content-lg-start p-4 p-sm-5">
                                <div class="wide-xs w-100">
                                    <h2 class="mb-3 fw-normal">Pay with card</h2>
                                    <div class="row g-3">
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label class="form-label" for="email">Email</label>
                                                <div class="form-control-wrap"><input class="form-control" value={user.email} placeholder="Enter email address" /></div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div className="form-group">
                                                <label class="form-label" for="email">Card Details</label>
                                                <div className="form-group-wrapper card-element">
                                                    <CardElement />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group">
                                                <label class="form-label" for="name">Name on card</label>
                                                <div class="form-control-wrap"><input class="form-control" type="text" value={user.name} placeholder="Full Name" /></div>
                                            </div>
                                        </div>
                                        {/* <div class="col-12">
                                            <div class="form-check flex-nowrap p-2 border border-light rounded my-1">
                                                <input class="form-check-input mt-0 flex-shrink-0" type="checkbox" value="" id="savecard" />
                                                <label class="form-check-label" for="savecard">
                                                    <h6 class="mb-1">Securely save my information for 1-click checkout</h6>
                                                    <p class="fs-12px lh-sm">Pay faster on Genious.AI and everywhere Link is accepted.</p>
                                                </label>
                                            </div>
                                        </div> */}
                                        <div class="col-12">
                                            <div class="form-group"><button onClick={processPayment} disabled={isLoading} class="btn btn-primary w-100">{isLoading ? 'Processing...' : 'Subscribe'}</button></div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-note">
                                                By confirming your subscription, you allow eComEmail.AI to charge your card for this payment and future payments in accordance with their terms. You can always cancel your subscription.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default PaymentScreen;