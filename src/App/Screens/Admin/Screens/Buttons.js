import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import useTitle from "../../../Hooks/useTitle";
import SearchHeader from "../../../Components/SearchHeader";
import Wrapper from "../../../Components/Wrapper";
import Moment from "react-moment";

const AdminButtons = () => {
    useTitle("Automation Buttons")
    const defaultButton = {
        name: "",
        prompt: "",
        prompt_question_id: "",
    }
    const [button, setButton] = useState(defaultButton);
    const [prompts, setPrompts] = useState([]);
    const [buttons, setButtons] = useState([]);
    const [orgData, setOrgData] = useState([]);
    const [selectedButton, setSelectedButton] = useState(0);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [IsDeleting, setIsDeleting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const getButtons = () => {
        axios.get(`${Helpers.apiUrl}button/all`, Helpers.authHeaders).then(response => {
            setButtons(response.data.buttons);
            setOrgData(response.data.buttons);
        });
    }

    const getPrompts = () => {
        axios.get(`${Helpers.apiUrl}prompt/system-prompts`, Helpers.authHeaders).then(response => {
            setPrompts(response.data);
        });
    }

    const saveButton = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios.post(`${Helpers.apiUrl}button/save`, button, Helpers.authHeaders).then(response => {
            getButtons();
            Helpers.toast("success", response.data.message);
            hideShowForm();
            setIsLoading(false);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
            setIsLoading(false);
        })
    }

    const handelEdit = selected_button => {
        setButton(selected_button);
        setShowForm(true);
    }

    const initiateDelete = id => {
        setSelectedButton(id);
    }

    const handleDelete = () => {
        setIsDeleting(true);
        axios.get(`${Helpers.apiUrl}button/delete/${selectedButton}`, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            getButtons();
            setSelectedButton(0);
            setIsDeleting(false);
        });
    }

    const hideShowForm = () => {
        setButton(defaultButton);
        setErrors({});
        setShowForm(false);
    }

    useEffect(() => {
        getButtons();
        getPrompts();
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">Automation Buttons</h2>
                                    <p>Manage all the automation buttons</p>
                                </div>
                                <button className="btn btn-primary" onClick={() => setShowForm(true)}><em class="icon ni ni-plus"></em> Add Button</button>
                            </div>
                        </div>
                        {showForm && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Create New Button</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <form onSubmit={saveButton}>
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label class="form-label">Choose Prompt Template</label>
                                                    <div class="form-control-wrap">
                                                        <select className="form-control" value={button.prompt_question_id} onChange={e => setButton({...button, prompt_question_id: e.target.value})}>
                                                            <option selected disabled value={''}>Choose Prompt Template</option>
                                                            {prompts.map(prompt => <option key={prompt.id} value={prompt.id}>{ prompt.name }</option>)}
                                                        </select>
                                                        <small className="text-danger">{ errors.prompt_question_id ? errors.prompt_question_id[0] : '' }</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label class="form-label">Button Name</label>
                                                    <div class="form-control-wrap">
                                                        <input type="text" value={button.name} onChange={e => setButton({...button, name: e.target.value})} class="form-control" placeholder="Enter button name" />
                                                        <small className="text-danger">{ errors.name ? errors.name[0] : '' }</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-12 mt-2">
                                                <div class="form-group">
                                                    <label class="form-label">Button Prompt</label>
                                                    <div class="form-control-wrap">
                                                        <textarea type="text" value={button.prompt} onChange={e => setButton({...button, prompt: e.target.value})} class="form-control" placeholder="Write button prompt"></textarea>
                                                        <small className="text-danger">{ errors.prompt ? errors.prompt[0] : '' }</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div class="col-md-12">
                                            <button className="btn btn-primary" onClick={saveButton} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Button'}</button>
                                            <button className="btn btn-outline-danger ml10" onClick={hideShowForm} disabled={isLoading}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {!showForm && <div class="nk-block">
                            <SearchHeader title={"All Buttons"} orgData={orgData} setData={setButtons} columns={['name']} />
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <div className="col-md-12">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr. #</th>
                                                        <th>Name</th>
                                                        <th>Prompt</th>
                                                        <th>Template</th>
                                                        <th>Created By</th>
                                                        <th>Created On</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {buttons.length === 0 && <tr>
                                                        <td colSpan={3}>No records found...</td>
                                                    </tr>}
                                                    {buttons.map((btn, index) => {
                                                        return (
                                                            <tr>
                                                                <td>{ index + 1 }</td>
                                                                <td>{ btn.name }</td>
                                                                <td>{ btn.prompt_question.name }</td>
                                                                <td><Wrapper content={btn.prompt} /></td>
                                                                <td>{ btn.user_id !== 0 ? btn.user.name : 'ADMIN' }</td>
                                                                <td><Moment date={btn.created_at} format="ddd, MMM D, YY" /></td>
                                                                <td>
                                                                   {(selectedButton && selectedButton === btn.id) ? <div>
                                                                        <button className="btn btn-outline-danger btn-sm" disabled={IsDeleting} onClick={() => handleDelete(btn)}>
                                                                            <em class="icon ni ni-check"></em><span className="ml5">{IsDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
                                                                        </button>
                                                                        <button className="btn btn-outline-primary btn-sm ml10" disabled={IsDeleting} onClick={() => setSelectedButton(0)}>
                                                                            <em class="icon ni ni-cross"></em><span className="ml5">Cancel</span>
                                                                        </button>
                                                                   </div> : <div>
                                                                        <button className="btn btn-outline-primary btn-sm" onClick={() => handelEdit(btn)}>
                                                                            <em class="icon ni ni-edit"></em><span className="ml5">Edit</span>
                                                                        </button>
                                                                        <button className="btn btn-outline-danger btn-sm ml10" onClick={() => initiateDelete(btn.id)}>
                                                                            <em class="icon ni ni-trash"></em><span className="ml5">Delete</span>
                                                                        </button>
                                                                   </div>}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminButtons;