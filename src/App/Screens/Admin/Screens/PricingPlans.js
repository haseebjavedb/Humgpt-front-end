import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import TextInput from "../../../Components/Input";
import useTitle from "../../../Hooks/useTitle";
import Select from "react-select";
import PageLoader from "../../../Components/Loader/PageLoader";
import Wrapper from "../../../Components/Wrapper";

const AdminPricingPlans = () => {
    useTitle("Pricing Plans");

    const defaultPlan = {
        plan_name:"",
        monthly_price:"",
        yearly_price:"",
        monthly_sale_per:0,
        yearly_sale_per:0,
        description:""
    };

    const defaultFeature = {
        feature:"",
        pricing_plan_id:"",
    }

    const [plan, setPlan] = useState(defaultPlan);
    const [plans, setPlans] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAddPlan, setShowAddPlan] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);
    const [feature, setFeature] = useState(defaultFeature);
    const [viewPlan, setViewPlan] = useState(false);
    const [activePlan, setActivePlan] = useState('monthly');

    const getPlans = () => {
        setPageLoading(true);
        axios.get(`${Helpers.apiUrl}plans/all`, Helpers.authHeaders).then(response => {
            setPlans(response.data.plans);
            setPageLoading(false);
        });
    }

    const savePlan = () => {
        setIsLoading(true);
        setErrors({});
        axios.post(`${Helpers.apiUrl}plans/save`, plan, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            setPlan(defaultPlan);
            setPlans(response.data.plans);
            setIsLoading(false);
            setShowAddPlan(false);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            setErrors(error.response.data.errors);
            setIsLoading(false);
        });
    }

    const saveFeature = () => {
        if(feature.feature){
            setIsLoading(true);
            let data = feature;
            data.pricing_plan_id = selectedPlan;
            axios.post(`${Helpers.apiUrl}plans/feature/save`, data, Helpers.authHeaders).then(response => {
                setPlans(response.data.plans);
                setPlan(response.data.plan);
                setFeature(defaultFeature);
                Helpers.toast("success", response.data.message);
                setIsLoading(false);
            }).catch(error => {
                Helpers.toast("error", error.response.data.message);
                setIsLoading(false);
            });
        }else{
            Helpers.toast("error", "Please add feature to save");
        }
    }

    const deleteFeature = (featureId) => {
        axios.get(`${Helpers.apiUrl}plans/feature/delete/${featureId}`, Helpers.authHeaders).then(response => {
            setPlan(response.data.plan);
            setPlans(response.data.plans);
            Helpers.toast("success", response.data.message);
        });
    }

    const editFeature = fearureToEdit => {
        setFeature(fearureToEdit);
    }

    const editPlan = (planToEdit) => {
        setPlan(planToEdit);
        setViewPlan(false);
        setShowAddPlan(true);
    }

    const initDelete = (id) => {
        setSelectedPlan(id);
    }

    const deleteRole = id => {
        setIsDeleting(true);
        axios.get(`${Helpers.apiUrl}plans/delete/${id}`, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            setPlans(response.data.plans);
            setViewPlan(false);
            setSelectedPlan(0);
            setPlan(defaultPlan);
            setIsDeleting(false);
        });
    }

    const cancelDelete = () => {
        setSelectedPlan(0);
    }

    const handleCancel = () => {
        setPlan(defaultPlan);
        setShowAddPlan(false);
    }

    const addFeature = planId => {
        setSelectedPlan(planId);
        let p = plans.find(p => p.id === planId);
        setPlan(p);
        setShowFeatures(true);
    }

    const handleFeatureCancel = () => {
        setPlan(defaultPlan);
        setSelectedPlan(0);
        setFeature(defaultFeature);
        setShowFeatures(false);
    }

    const showPlan = p => {
        setPlan(p);
        setViewPlan(true);
    }

    const showAllPlans = () => {
        setSelectedPlan(0);
        setPlan(defaultPlan);
        setViewPlan(false);
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
                                    <p>Manage Pricing Plans</p>
                                </div>
                                <div>
                                    {!showAddPlan && <button className="btn btn-primary" onClick={() => setShowAddPlan(true)}><em class="icon ni ni-plus"></em> Add New Plan</button>}
                                    {viewPlan && <button className="btn btn-outline-danger ml10" onClick={showAllPlans}><em class="icon ni ni-arrow-left"></em> All Plans</button>}
                                </div>
                            </div>
                        </div>
                        {(!showAddPlan && !showFeatures && !viewPlan) && <div class="nk-block">
                            <div class="pricing-toggle-wrap mb-4">
                                <button class={`pricing-toggle-button ${ activePlan === 'monthly' ? 'active' : '' }`} onClick={() => setActivePlan('monthly')} data-target="monthly">Monthly</button><button class={`pricing-toggle-button ${ activePlan === 'yearly' ? 'active' : '' }`} onClick={() => setActivePlan('yearly')} data-target="yearly">Yearly</button>
                            </div>
                            <div class="mt-xl-5">
                                <div class="row g-0">
                                    {plans.map((pln, index) => {
                                        return (
                                            <div key={index} class="col-xl-4">
                                                <div class="card pricing bg-white rounded-start">
                                                    <div class="pricing-content">
                                                        <div class="w-sm-70 w-md-50 w-xl-100 text-center text-xl-start mx-auto">
                                                            <h2 class="mb-3">{ pln.plan_name }</h2>
                                                            <div class="pricing-price-wrap">
                                                                <div class={`pricing-price pricing-toggle-content monthly ${ activePlan === 'monthly' ? 'active' : '' }`}>
                                                                    <h3 class="display-1 mb-3 fw-semibold">{pln.monthly_sale_per > 0 && <del className="cut-price">${ pln.monthly_price } </del>}${ parseFloat(pln.final_monthly).toFixed(2) } <span class="caption-text text-light fw-normal"> / month</span></h3>
                                                                </div>
                                                                <div class={`pricing-price pricing-toggle-content yearly ${ activePlan === 'yearly' ? 'active' : '' }`}>
                                                                    <h3 class="display-1 mb-3 fw-semibold"><del className="cut-price">${ pln.yearly_price } </del>${ parseFloat(pln.final_yearly).toFixed(2) } <span class="caption-text text-light fw-normal"> / year</span></h3>
                                                                </div>
                                                            </div>
                                                            <div class="mb-2">
                                                                <button onClick={() => editPlan(pln)} class="btn btn-outline-light w-50">Edit Plan</button>
                                                                <button onClick={() => addFeature(pln.id)} class="btn btn-outline-light w-50">Edit Features</button>
                                                            </div>
                                                            <ul class="pricing-features">
                                                                {pln.plan_features.map(p_feature => <li><em class="icon text-primary ni ni-check-circle"></em><span>{ p_feature.feature }</span></li>)}
                                                            </ul>
                                                            <div class="mt-3">
                                                                {(selectedPlan == pln.id) ? <>
                                                                    <button onClick={() => deleteRole(pln.id)} class="btn btn-outline-danger w-50">Yes, Delete</button>
                                                                    <button onClick={cancelDelete} class="btn btn-outline-primary w-50">Cancel</button>
                                                                </> : 
                                                                <button onClick={() => initDelete(pln.id)} class="btn btn-outline-danger w-100">Delete Plan</button>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>}
                        {(!showAddPlan && !showFeatures && viewPlan) && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Add New Feature</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <TextInput label={"Feature"} cols={12} value={feature.feature} onChange={e => setFeature({...feature, feature: e.target.value})} />
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" disabled={isLoading} onClick={saveFeature}>{isLoading ? 'Saving...' : 'Save Feature'}</button>
                                            <button className="btn btn-outline-danger ml10" onClick={handleFeatureCancel}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="nk-block-head nk-block-head-sm mt-3">
                                <div className="row">
                                    <div class="col-md-6 nk-block-head-content"><h3 class="nk-block-title">{ plan.plan_name }</h3></div>
                                    {(selectedPlan == plan.id) ? <div className="col-md-6 text-right">
                                        <button onClick={() => deleteRole(plan.id)} disabled={isDeleting} className="btn btn-outline-danger btn-sm ml5">
                                            <em class="icon ni ni-check"></em><span className="ml5">{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
                                        </button>
                                        <button onClick={cancelDelete} className="btn btn-outline-primary btn-sm ml5">
                                            <em className="icon ni ni-cross"></em><span className="ml5">Cancel</span>
                                        </button>
                                    </div> : <div className="col-md-6 text-right">
                                        <button onClick={() => editPlan(plan)} className="btn btn-primary btn-sm"><em class="icon ni ni-edit"></em> <span className="ml5">Edit</span></button>
                                        <button onClick={() => initDelete(plan.id)} className="btn btn-outline-danger btn-sm ml10"><em class="icon ni ni-trash"></em> <span className="ml5">Delete</span></button>
                                    </div>}
                                </div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. #</th>
                                                    <th>Feature</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {plan.plan_features.map((plan_feature, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{ index + 1 }</td>
                                                            <td>
                                                                {plan_feature.feature}
                                                            </td>
                                                            <td>
                                                                <button onClick={() => editFeature(plan_feature)} className="btn btn-outline-primary btn-sm ml5">
                                                                    <em class="icon ni ni-edit"></em>
                                                                </button>
                                                                <button onClick={() => deleteFeature(plan_feature.id)} className="btn btn-outline-danger btn-sm ml5">
                                                                    <em className="icon ni ni-trash"></em>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {(showAddPlan && !showFeatures && !viewPlan) && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Add New Pricing Plan</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <TextInput error={errors.plan_name} label={"Plan Name"} cols={12} value={plan.plan_name} onChange={e => setPlan({...plan, plan_name: e.target.value})} />
                                        <TextInput error={errors.monthly_price} label={"Basic Monthly"} value={plan.monthly_price} onChange={e => setPlan({...plan, monthly_price: e.target.value})} />
                                        <TextInput error={errors.yearly_price} label={"Basic Yearly"} value={plan.yearly_price} onChange={e => setPlan({...plan, yearly_price: e.target.value})} />
                                        <TextInput error={errors.monthly_sale_per} label={"Sale on Monthly"} value={plan.monthly_sale_per} onChange={e => setPlan({...plan, monthly_sale_per: e.target.value})} />
                                        <TextInput error={errors.yearly_sale_per} label={"Sale on Yearly"} value={plan.yearly_sale_per} onChange={e => setPlan({...plan, yearly_sale_per: e.target.value})} />
                                        <TextInput isTextArea={true} error={errors.description} label={"Description"} cols={12} value={plan.description} onChange={e => setPlan({...plan, description: e.target.value})} />
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" disabled={isLoading} onClick={savePlan}>{isLoading ? 'Saving...' : 'Save Pricing Plan'}</button>
                                            <button className="btn btn-outline-danger ml10" onClick={handleCancel}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {(showFeatures && !showAddPlan && !viewPlan) && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Add New Feature</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <TextInput label={"Feature"} cols={12} value={feature.feature} onChange={e => setFeature({...feature, feature: e.target.value})} />
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" disabled={isLoading} onClick={saveFeature}>{isLoading ? 'Saving...' : 'Save Feature'}</button>
                                            <button className="btn btn-outline-danger ml10" onClick={handleFeatureCancel}>Cancel</button>
                                        </div>
                                    </div>
                                    <div class="row g-3 gx-gs mt-3">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. #</th>
                                                    <th>Feature</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {plan.plan_features.map((plan_feature, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{ index + 1 }</td>
                                                            <td>
                                                                {plan_feature.feature}
                                                            </td>
                                                            <td>
                                                                <button onClick={() => editFeature(plan_feature)} className="btn btn-outline-primary btn-sm ml5">
                                                                    <em class="icon ni ni-edit"></em>
                                                                </button>
                                                                <button onClick={() => deleteFeature(plan_feature.id)} className="btn btn-outline-danger btn-sm ml5">
                                                                    <em className="icon ni ni-trash"></em>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default AdminPricingPlans;