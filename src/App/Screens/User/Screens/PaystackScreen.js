import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageLoader from "../../../Components/Loader/PageLoader";
import Helpers from "../../../Config/Helpers";
import { PaystackButton } from "react-paystack";

const PaystackScreen = () => {
  const defaultUser = Helpers.authUser;
  const navigate = useNavigate();
  const { plan_id } = useParams();

  const [user, setUser] = useState(defaultUser);
  const [pageLoading, setPageLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const publicKey = "pk_test_07b9ababff00a7cb7831c44831df771b1afa09a1";

  useEffect(() => {
    const getPlan = async () => {
      try {
        const response = await axios.get(
          `${Helpers.apiUrl}plans/single/${plan_id}`,
          Helpers.authHeaders
        );
        setPlan(response.data.plan);
        setPageLoading(false);
        console.log(response);
      } catch (error) {
        Helpers.toast(
          "error",
          error.response?.data?.message || "Error fetching plan"
        );
        navigate(-1);
        setPageLoading(false);
      }
    };
    getPlan();
  }, [navigate, plan_id]);

  const handlePaymentSuccess = (response) => {
    console.log("Payment successful:", response);
    if (response && response.reference) {
        const reference = response.reference;
        alert("Thanks for doing business with us! Come back soon!!");
        storeData(reference); // Pass the reference to storeData function
    } else {
        // Handle case where reference is not present in the response
        console.error("No reference found in response:", response);
        // Display an error message or take appropriate action
    }
};

const storeData = (reference) => { // Add reference parameter here
    setIsLoading(true);
    const data = {
        product_id: plan.id,
        planName: plan.plan_name,
        transaction_reference: reference,
    };
    console.log("Data being sent to the API:", data);
    axios.post(`${Helpers.apiUrl}stripe/process-payment2`, data, Helpers.authHeaders)
        .then(response => {
            Helpers.toast("success", response.data.message);
            Helpers.setItem('user', response.data.user, true);
            console.log(response);
            setTimeout(() => {
                window.location.href = '/user/dashboard';
            }, 1000);
        })
        .catch(error => {
            if (error.response) {
                Helpers.toast("error", error.response.data.message);
            } else {
                Helpers.toast("error", "Unexpected error occurred");
            }
            setIsLoading(false);
        });
};


  return (
    <div className="nk-content">
      <div className="container-xl">
        <div className="nk-content-inner">
          {pageLoading ? (
            <PageLoader />
          ) : (
            <div className="nk-content-body">
              <div className="d-flex flex-wrap flex-grow-1">
                <div className="bg-lighter w-100 w-lg-50 d-flex flex-column justify-content-center p-4 p-sm-5">
                  {plan && (
                    <div className="wide-xs">
                      <div className="d-flex align-items-center mb-4">
                        <Link
                          to="/user/pricing-plans"
                          className="pe-2 d-flex align-items-center"
                        >
                          <em className="icon ni ni-arrow-left text-light"></em>
                        </Link>
                        <a href="#!" className="logo-link">
                          
                        </a>
                      </div>
                      <div>
                        <h2 className="mb-3">
                          Subscribe to {plan.plan_name} (Monthly)
                        </h2>
                        <h3 className="display-1 fw-semibold">
                          ${parseFloat(plan.monthly_price).toFixed(2)}
                          <span className="caption-text text-light fw-normal">
                            {" "}
                            per month
                          </span>
                        </h3>
                        <p className="fs-5 fw-normal mt-3">
                          {plan.description}
                        </p>
                      </div>
                      <ul className="pricing-features mt-4">
                        {plan.plan_features.map((feature, index) => (
                          <li key={index}>
                            <em className="icon text-primary ni ni-check-circle me-2"></em>
                            <span>{feature.feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="bg-white w-100 w-lg-50 d-flex flex-column justify-content-center p-4 p-sm-5">
                  <div className="wide-xs">
                    <h2 className="mb-4 fw-normal">Pay with PayStack</h2>
                    <div className="checkout-form">
                      <div className="checkout-field mb-3">
                        <label htmlFor="name" className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="checkout-field mb-3">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="text"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="checkout-field mb-3">
                        <label htmlFor="phone" className="form-label">
                          Phone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="checkout-actions">
                        <PaystackButton
                          className="btn btn-primary w-100"
                          onSuccess={handlePaymentSuccess}
                          email={email}
                          amount={plan ? plan.monthly_price * 100 : 0} // Convert to kobo
                          metadata={{ name, phone }}
                          publicKey={publicKey}
                          text="Pay Now"
                          onClose={() =>
                            alert("Wait! You need this oil, don't go!!!!")
                          }
                        />
                      </div>
                    </div>
                    <div className="form-note mt-4">
                      By confirming your subscription, you allow humgpt to
                      charge your card for this payment and future payments in
                      accordance with their terms. You can always cancel your
                      subscription.
                    </div>
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

export default PaystackScreen;



