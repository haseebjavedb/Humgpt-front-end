import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import TextInput from "../../../Components/Input";
import SelectInput from "../../../Components/Select";
import useTitle from "../../../Hooks/useTitle";
import { Link, useNavigate } from "react-router-dom";
import SearchHeader from "../../../Components/SearchHeader";
import Pagination from "../../../Components/Pagination";
import Moment from "react-moment";

const AdminPromptsMain = () => {
    useTitle("Prompts");
    const defaultPrompt = {
        category:'',
        name:'',
        description:''
    }
    const navigate = useNavigate();
    const [prompts, setPrompts] = useState([]);
    const [orgData, setOrgData] = useState([]);
    
    const [categories, setCategories] = useState([]);
    const [prompt, setPrompt] = useState(defaultPrompt);
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showAddPrompt, setShowAddPrompt] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const getCategories = () => {
        axios.get(`${Helpers.apiUrl}category/all`).then(response => {
            setCategories(response.data);
        });
    }

    const savePrompt = () => {
        setIsLoading(true);
        axios.post(`${Helpers.apiUrl}prompt/save-prompt`, prompt, Helpers.authHeaders).then(response => {
            if(!isEditing){
                navigate(`/admin/prompt/questions/${ Helpers.encryptString(response.data.id) }/1`);
            }else{
                setIsEditing(false);
            }
            allPrompts();
            setShowAddPrompt(false);
            setIsLoading(false);
        }).catch(error => {
            console.log(error);
            Helpers.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
            setIsLoading(false);
        });
    }

    const allPrompts = () => {
        axios.get(`${Helpers.apiUrl}prompt/all-prompts`, Helpers.authHeaders).then(response => {
            let paginatedData = Helpers.paginate(response.data);
            setPrompts(paginatedData);
            setOrgData(response.data);
        });
    }

    const editPrompt = prmpt => {
        // console
        let editPrompt = {
            name: prmpt.name,
            category: prmpt.category_id,
            description: prmpt.description,
            id: prmpt.id,
        }
        setPrompt(editPrompt);
        setShowAddPrompt(true);
        setIsEditing(true);
    }

    const handleCancel = () => {
        setIsEditing(false);
        setPrompt(defaultPrompt);
        setShowAddPrompt(false);
    }

    const initDelete = id => {
        setSelectedPrompt(id);
    }
    
    const cancelDelete = () => {
        setSelectedPrompt(0);
    }

    const deletePrompt = id => {
        setIsDeleting(true);
        axios.get(`${Helpers.apiUrl}prompt/delete/${id}`, Helpers.authHeaders).then(response => {
            allPrompts();
            setSelectedPrompt(0);
            Helpers.toast("success", response.data.message);
            setIsDeleting(false);
        });
    }

    const updateStatus = (id, status) => {
        setIsUpdatingStatus(true);
        axios.get(`${Helpers.apiUrl}prompt/status/${id}/${status}`, Helpers.authHeaders).then(response => {
            allPrompts();
            setIsUpdatingStatus(false);
            Helpers.toast("success", response.data.message);
        });
    }

    useEffect(() => {
        allPrompts();
        getCategories();
        // return () => {
        //     allPrompts();
        //     getCategories();
        // };
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">Prompts</h2>
                                    <p>Manage the prompts for different categories</p>
                                </div>
                                {!showAddPrompt && <button className="btn btn-primary" onClick={() => setShowAddPrompt(true)}><em class="icon ni ni-plus"></em> Add New Prompt</button>}
                            </div>
                        </div>
                        {!showAddPrompt && <div class="nk-block">
                            <SearchHeader isPaginated={true} title={"All Prompts"} orgData={orgData} setData={setPrompts} columns={['name', 'category.name']} />
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. #</th>
                                                    <th>Name</th>
                                                    <th>Category</th>
                                                    <th>status</th>
                                                    <th>Created By</th>
                                                    <th>Created On</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {prompts.length === 0 && <tr>
                                                    <td colSpan={10}>No records found...</td>
                                                </tr>}
                                                {prompts.length > 0 && prompts[currentPage].map((prmpt, index) => {
                                                    return (
                                                        <tr key={prmpt.id}>
                                                            <td>{ index + 1 }</td>
                                                            <td>{ prmpt.name }</td>
                                                            <td>{ prmpt.category.name }</td>
                                                            <td>
                                                                {prmpt.status === 1 && <button onClick={() => updateStatus(prmpt.id, 0)} disabled={isUpdatingStatus} className="btn btn-sm btn-primary">Published</button>}
                                                                {prmpt.status === 0 && <button onClick={() => updateStatus(prmpt.id, 1)} disabled={isUpdatingStatus} className="btn btn-sm btn-danger">Not Published</button>}
                                                            </td>
                                                            <td>{ prmpt.user_id !== 0 ? prmpt.user.name : 'ADMIN' }</td>
                                                            <td><Moment date={prmpt.created_at} format="ddd, MMM D, YY" /></td>
                                                            <td className="tb-col-end">
                                                                {selectedPrompt === prmpt.id ? <div>
                                                                    <button onClick={() => deletePrompt(prmpt.id)} disabled={isDeleting} className="btn btn-outline-danger btn-sm ml5">
                                                                        <em class="icon ni ni-check"></em><span className="ml5">{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
                                                                    </button>
                                                                    <button onClick={cancelDelete} className="btn btn-outline-primary btn-sm ml5">
                                                                        <em className="icon ni ni-cross"></em><span className="ml5">Cancel</span>
                                                                    </button>
                                                                </div> :
                                                                <div>
                                                                    <Link to={`/admin/prompt/questions/${ Helpers.encryptString(prmpt.id) }`} className="btn btn-outline-primary btn-sm">
                                                                        <em class="icon ni ni-eye"></em><span className="ml5">View</span>
                                                                    </Link>
                                                                    <button onClick={() => editPrompt(prmpt)} className="btn btn-outline-primary btn-sm ml5">
                                                                        <em class="icon ni ni-edit"></em><span className="ml5">Edit</span>
                                                                    </button>
                                                                    <button onClick={() => initDelete(prmpt.id)} className="btn btn-outline-danger btn-sm ml5">
                                                                        <em className="icon ni ni-trash"></em><span className="ml5">Delete</span>
                                                                    </button>
                                                                </div>}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        {prompts.length > 0 && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} data={prompts} orgData={orgData} />}
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {showAddPrompt && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Add New Prompt</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <TextInput label={"Name"} error={errors.name} value={prompt.name} onChange={e => setPrompt({...prompt, name: e.target.value})} />
                                        <SelectInput
                                            label={"Choose Category"}
                                            value={prompt.category}
                                            onChange={e => setPrompt({...prompt, category: e.target.value})}
                                            options={categories}
                                            isObject={true}
                                            optionLabel={'name'}
                                            optionValue={'id'}
                                            error={errors.category}
                                        />
                                        <TextInput isTextArea={true} label={"Description"} error={errors.description} value={prompt.description} cols={12} onChange={e => setPrompt({...prompt, description: e.target.value})} />
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" disabled={isLoading} onClick={savePrompt}>{isLoading ? 'Saving...' : isEditing ? 'Save Prompt' : 'Save & Continue'}</button>
                                            <button className="btn btn-outline-danger ml10" onClick={handleCancel}>Cancel</button>
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

export default AdminPromptsMain;