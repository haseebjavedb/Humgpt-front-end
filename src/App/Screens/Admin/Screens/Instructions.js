import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import TextInput from "../../../Components/Input";
import useTitle from "../../../Hooks/useTitle";
import Select from "react-select";
import PageLoader from "../../../Components/Loader/PageLoader";
import Wrapper from "../../../Components/Wrapper";

const AdminInstructions = () => {
    useTitle("Prompts");

    const defaultRole = {
        role:"",
        prompt:"",
    };

    const defaultIns = {
        instruction:"",
        gpt_role_id:"",
    }

    const [prompts, setPrompts] = useState([]);
    const [promptOptions, setPromptOptions] = useState([]);
    const [role, setRole] = useState(defaultRole);
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAddRole, setShowAddRole] = useState(false);
    const [showIns, setShowIns] = useState(false);
    const [ins, setIns] = useState(defaultIns);
    const [viewRole, setViewRole] = useState(false);

    const getPrompts = () => {
        axios.get(`${Helpers.apiUrl}prompt/all-prompts`, Helpers.authHeaders).then(response => {
            let data = response.data;
            let options = [];
            setPrompts(data);
            for(let i = 0; i < data.length; i++){
                let option = {
                    label: data[i].name,
                    value: data[i].id,
                };
                options.push(option);
            }
            setPromptOptions(options);
        });
    }

    const getRoles = () => {
        setPageLoading(true);
        axios.get(`${Helpers.apiUrl}gpt-role/all`, Helpers.authHeaders).then(response => {
            setRoles(response.data.roles);
            setPageLoading(false);
        });
    }

    const saveRole = () => {
        setIsLoading(true);
        setErrors({});
        axios.post(`${Helpers.apiUrl}gpt-role/save`, role, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            setRole(defaultRole);
            setRoles(response.data.roles);
            setSelectedOption(null);
            setIsLoading(false);
            setShowAddRole(false);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            setErrors(error.response.data.errors);
            setIsLoading(false);
        });
    }

    const saveInstruction = (addMore = false) => {
        if(ins.instruction){
            setIsLoading(true);
            let data = ins;
            data.gpt_role_id = selectedRole;
            axios.post(`${Helpers.apiUrl}gpt-instructions/save`, data, Helpers.authHeaders).then(response => {
                setRoles(response.data.roles);
                setIns(defaultIns);   
                // if(addMore === false){
                // }
                setSelectedRole(0);
                setShowIns(false);
                Helpers.toast("success", response.data.message);
                setIsLoading(false);
            }).catch(error => {
                Helpers.toast("error", error.response.data.message);
                setIsLoading(false);
            });
        }else{
            Helpers.toast("error", "Please add instruction to save");
        }
    }

    const deleteIns = (insId) => {
        axios.get(`${Helpers.apiUrl}gpt-instructions/delete/${insId}`, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            let r = response.data.role;
            let insts = r.gpt_instructions.filter(ins => ins.id !== insId);
            r.gpt_instructions = insts;
            setRole(r);
        });
    }

    const editIns = inst => {
        setSelectedRole(role.id);
        setRole(defaultRole);
        setIns(inst);
        setShowIns(true);
        setViewRole(false);
    }

    const editRole = (role) => {
        role.prompt = role.prompt_question_id;
        let selected_option = promptOptions.find(opt => opt.value === role.prompt);
        setSelectedOption(selected_option);
        setRole(role);
        setViewRole(false);
        setShowAddRole(true);
    }

    const initDelete = (id) => {
        setSelectedRole(id);
    }

    const deleteRole = id => {
        setIsDeleting(true);
        axios.get(`${Helpers.apiUrl}gpt-role/delete/${id}`, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            setRoles(response.data.roles);
            setViewRole(false);
            setSelectedRole(0);
            setRole(defaultRole);
            setIsDeleting(false);
        });
    }

    const cancelDelete = () => {
        setSelectedRole(0);
    }

    const handleCancel = () => {
        setRole(defaultRole);
        setSelectedOption(null);
        setShowAddRole(false);
    }

    const addIns = roleId => {
        setSelectedRole(roleId);
        setShowIns(true);
    }

    const handleInsCancel = () => {
        setSelectedRole(0);
        setIns(defaultIns);
        setShowIns(false);
    }

    const showRole = r => {
        setRole(r);
        setViewRole(true);
    }

    const showAllRoles = () => {
        setSelectedRole(0);
        setRole(defaultRole);
        setViewRole(false);
    }
    
    useEffect(() => {
        getRoles();
        getPrompts();
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">Roles & Instructions</h2>
                                    <p>Manage Role and Instructions for Prompt</p>
                                </div>
                                <div>
                                    {!showAddRole && <button className="btn btn-primary" onClick={() => setShowAddRole(true)}><em class="icon ni ni-plus"></em> Add New Role</button>}
                                    {viewRole && <button className="btn btn-outline-danger ml10" onClick={showAllRoles}><em class="icon ni ni-arrow-left"></em> All Roles</button>}
                                </div>
                            </div>
                        </div>
                        {(!showAddRole && !showIns && viewRole) && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div className="row">
                                    <div class="col-md-6 nk-block-head-content"><h3 class="nk-block-title">{ role.prompt_question.name }</h3></div>
                                    {(selectedRole == role.id) ? <div className="col-md-6 text-right">
                                        <button onClick={() => deleteRole(role.id)} disabled={isDeleting} className="btn btn-outline-danger btn-sm ml5">
                                            <em class="icon ni ni-check"></em><span className="ml5">{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
                                        </button>
                                        <button onClick={cancelDelete} className="btn btn-outline-primary btn-sm ml5">
                                            <em className="icon ni ni-cross"></em><span className="ml5">Cancel</span>
                                        </button>
                                    </div> : <div className="col-md-6 text-right">
                                        <button onClick={() => editRole(role)} className="btn btn-primary btn-sm"><em class="icon ni ni-edit"></em> <span className="ml5">Edit</span></button>
                                        <button onClick={() => initDelete(role.id)} className="btn btn-outline-danger btn-sm ml10"><em class="icon ni ni-trash"></em> <span className="ml5">Delete</span></button>
                                    </div>}
                                </div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <p>{ role.role }</p>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Instruction</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {role.gpt_instructions.map((gpt_ins, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{ index + 1 }</td>
                                                            <td>
                                                                <Wrapper content={gpt_ins.instruction} />
                                                            </td>
                                                            <td>
                                                                <button onClick={() => editIns(gpt_ins)} className="btn btn-outline-primary btn-sm ml5">
                                                                    <em class="icon ni ni-edit"></em>
                                                                </button>
                                                                <button onClick={() => deleteIns(gpt_ins.id)} className="btn btn-outline-danger btn-sm ml5">
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
                        {(!showAddRole && !showIns && !viewRole) && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">All Roles</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Prompt</th>
                                                    <th>Role</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {roles.length === 0 && <tr><td colSpan={4}>No records found...</td></tr>}
                                                {roles.map((r, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{ index + 1 }</td>
                                                            <td>{ r.prompt_question.name }</td>
                                                            <td>
                                                                <Wrapper content={r.role} />
                                                            </td>
                                                            <td>
                                                                {selectedRole === r.id ? <div>
                                                                    <button onClick={() => deleteRole(r.id)} disabled={isDeleting} className="btn btn-outline-danger btn-sm ml5">
                                                                        <em class="icon ni ni-check"></em><span className="ml5">{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
                                                                    </button>
                                                                    <button onClick={cancelDelete} className="btn btn-outline-primary btn-sm ml5">
                                                                        <em className="icon ni ni-cross"></em><span className="ml5">Cancel</span>
                                                                    </button>
                                                                </div> :
                                                                <div>
                                                                    <button onClick={() => addIns(r.id)} className="btn btn-outline-primary btn-sm ml5">
                                                                        Add Instructions
                                                                    </button>
                                                                    <button onClick={() => showRole(r)} className="btn btn-outline-primary btn-sm ml5">
                                                                        <em class="icon ni ni-eye"></em>
                                                                    </button>
                                                                    <button onClick={() => editRole(r)} className="btn btn-outline-primary btn-sm ml5">
                                                                        <em class="icon ni ni-edit"></em>
                                                                    </button>
                                                                    <button onClick={() => initDelete(r.id)} className="btn btn-outline-danger btn-sm ml5">
                                                                        <em className="icon ni ni-trash"></em>
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
                        </div>}
                        {(showAddRole && !showIns && !viewRole) && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Add New Role</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <div className="col-md-12 form-group">
                                            <label className="form-label">Choose Prompt</label>
                                            <div className="form-group-wrapper">
                                                <Select options={promptOptions} placeholder="Select Prompt" value={selectedOption} onChange={selectedValue => {
                                                    setSelectedOption(selectedValue);
                                                    setRole({...role, prompt: selectedValue.value});
                                                }} />
                                                <small className="text-danger">{ errors.prompt ? errors.prompt[0] : '' }</small>
                                            </div>
                                        </div>
                                        <TextInput isTextArea={true} error={errors.role} label={"Role"} cols={12} value={role.role} onChange={e => setRole({...role, role: e.target.value})} />
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" disabled={isLoading} onClick={saveRole}>{isLoading ? 'Saving...' : 'Save Role'}</button>
                                            <button className="btn btn-outline-danger ml10" onClick={handleCancel}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {(showIns && !showAddRole && !viewRole) && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Add New Instruction</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <TextInput isTextArea={true} label={"Instruction"} cols={12} value={ins.instruction} onChange={e => setIns({...ins, instruction: e.target.value})} />
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" disabled={isLoading} onClick={saveInstruction}>{isLoading ? 'Saving...' : 'Save Instruction'}</button>
                                            <button className="btn btn-primary ml10" disabled={isLoading} onClick={() => saveInstruction(true)}>{isLoading ? 'Saving...' : 'Save & Add New'}</button>
                                            <button className="btn btn-outline-danger ml10" onClick={handleInsCancel}>Cancel</button>
                                        </div>
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

export default AdminInstructions;