import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import useTitle from "../../../Hooks/useTitle";
import SearchHeader from "../../../Components/SearchHeader";
import Moment from "react-moment";

const AdminCategories = () => {
    useTitle("Categories")
    const defaultCategory = {
        name: "",
    }
    const [category, setCategory] = useState(defaultCategory);
    const [categories, setCategories] = useState([]);
    const [orgData, setOrgData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [IsDeleting, setIsDeleting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const getCategories = () => {
        axios.get(`${Helpers.apiUrl}category/all`).then(response => {
            setCategories(response.data);
            setOrgData(response.data);
        });
    }

    const saveCategory = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios.post(`${Helpers.apiUrl}category/save`, category, Helpers.authHeaders).then(response => {
            getCategories();
            Helpers.toast("success", response.data.message);
            hideShowForm();
            setIsLoading(false);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
            setIsLoading(false);
        })
    }

    const handelEdit = selected_category => {
        setCategory(selected_category);
        setShowForm(true);
    }

    const initiateDelete = id => {
        setSelectedCategory(id);
    }

    const handleDelete = () => {
        setIsDeleting(true);
        axios.get(`${Helpers.apiUrl}category/delete/${selectedCategory}`, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            getCategories();
            setSelectedCategory(0);
            setIsDeleting(false);
        });
    }

    const hideShowForm = () => {
        setCategory(defaultCategory);
        setErrors({});
        setShowForm(false);
    }

    useEffect(() => {
        getCategories();
        return () => {
            getCategories();
        };
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">Categories</h2>
                                    <p>Manage all the prompts categories</p>
                                </div>
                                <button className="btn btn-primary" onClick={() => setShowForm(true)}><em class="icon ni ni-plus"></em> Add Category</button>
                            </div>
                        </div>
                        {showForm && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Create New Category</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <form onSubmit={saveCategory}>
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label class="form-label">Category Name</label>
                                                    <div class="form-control-wrap">
                                                        <input type="text" value={category.name} onChange={e => setCategory({...category, name: e.target.value})} class="form-control" placeholder="Enter category name" />
                                                        <small className="text-danger">{ errors.name ? errors.name[0] : '' }</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div class="col-md-12">
                                            <button className="btn btn-primary" onClick={saveCategory} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Category'}</button>
                                            <button className="btn btn-outline-danger ml10" onClick={hideShowForm} disabled={isLoading}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        <div class="nk-block">
                            <SearchHeader title={"All Categories"} orgData={orgData} setData={setCategories} columns={['name']} />
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <div className="col-md-12">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr. #</th>
                                                        <th>Category</th>
                                                        <th>Created By</th>
                                                        <th>Created On</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {categories.length === 0 && <tr>
                                                        <td colSpan={3}>No records found...</td>
                                                    </tr>}
                                                    {categories.map((category, index) => {
                                                        return (
                                                            <tr>
                                                                <td>{ index + 1 }</td>
                                                                <td>{ category.name }</td>
                                                                <td>{ category.user_id !== 0 ? category.user.name : 'ADMIN' }</td>
                                                                <td><Moment date={category.created_at} format="ddd, MMM D, YY" /></td>
                                                                <td>
                                                                   {(selectedCategory && selectedCategory === category.id) ? <div>
                                                                        <button className="btn btn-outline-danger btn-sm" disabled={IsDeleting} onClick={() => handleDelete(category)}>
                                                                            <em class="icon ni ni-check"></em><span className="ml5">{IsDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
                                                                        </button>
                                                                        <button className="btn btn-outline-primary btn-sm ml10" disabled={IsDeleting} onClick={() => setSelectedCategory(0)}>
                                                                            <em class="icon ni ni-cross"></em><span className="ml5">Cancel</span>
                                                                        </button>
                                                                   </div> : <div>
                                                                        <button className="btn btn-outline-primary btn-sm" onClick={() => handelEdit(category)}>
                                                                            <em class="icon ni ni-edit"></em><span className="ml5">Edit</span>
                                                                        </button>
                                                                        <button className="btn btn-outline-danger btn-sm ml10" onClick={() => initiateDelete(category.id)}>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminCategories;