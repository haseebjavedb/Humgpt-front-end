import React, { useState, useEffect } from "react";
import axios from "axios";
import Helpers from "../../../Config/Helpers";
import { useParams } from "react-router-dom";

const EditUser = () => {
  const { user_id } = useParams(); // Access the user_id parameter using useParams

  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    product_id: "",
    plan_name: "",
  });
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false); // Validation state

  useEffect(() => {
    axios
      .get(`${Helpers.apiUrl}user/getplans/${user_id}`, Helpers.authHeaders)
      .then((response) => {
        if (response.data.user) {
         
          setUserData(response.data.user);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [user_id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFields = () => {
    // Add your validation logic here
    // For example, checking if product_id and plan_name are not empty
    const { product_id, plan_name } = userData;
    if (product_id.trim() !== "" && plan_name.trim() !== "") {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    validateFields();
  }, [userData]); // Trigger validation whenever userData changes

 const updateUser = () => {
    if (!isValid) {
      // Prevent form submission if validation fails
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    axios
      .post(
        `${Helpers.apiUrl}user/Plans/${user_id}`,
        {
          product_id: userData.product_id,
          plan_name: userData.plan_name,
        },
        Helpers.authHeaders
      )
      .then((response) => {
        setMessage(response.data.message);
        setIsLoading(false);
        Helpers.toast("success", response.data.message); // Show success toast
      })
      .catch((error) => {
        setError(error.response.data.message);
        setIsLoading(false);
        Helpers.toast("error", error.response.data.message); // Show error toast
      });
};


  return (
    <div className="nk-content chatbot-mb">
    <div className="container-xl">
      <div className="nk-content-inner">
        <div className="nk-content-body">
          <div className="d-flex flex-wrap justify-content-center"> {/* Center the content */}
            <div className="bg-white w-100 w-lg-50 d-flex align-items-center justify-content-center justify-content-lg-start p-4 p-sm-5 shadow-lg rounded"> {/* Add shadow and rounded corners */}
              <div className="wide-xs w-100">
                <h2 className="mb-3 fw-normal">Update User Information</h2>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <div className="form-control-wrap">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      value={userData.name || ""}
                      placeholder="Full Name"
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <div className="form-control-wrap">
                    <input
                      className="form-control"
                      type="text"
                      name="email"
                      value={userData.email || ""}
                      placeholder="Email Address"
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="product_id">
                    Product ID
                  </label>
                  <div className="form-control-wrap">
                    <input
                      className="form-control"
                      type="text"
                      name="product_id"
                      value={userData.product_id}
                      onChange={handleInputChange}
                      placeholder="Product ID"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="plan_name">
                    Plan Name
                  </label>
                  <div className="form-control-wrap">
                    <input
                      className="form-control"
                      type="text"
                      name="plan_name"
                      value={userData.plan_name}
                      onChange={handleInputChange}
                      placeholder="Plan Name"
                    />
                  </div>
                </div>
                <div className="form-group mt-2">
                  <button
                    onClick={updateUser}
                    disabled={isLoading || !isValid}
                    className="btn btn-primary w-100"
                  >
                    {isLoading ? "Updating..." : "Update User"}
                  </button>
                </div>
                {error && <p className="text-danger">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default EditUser;