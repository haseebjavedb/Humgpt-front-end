import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import useTitle from "../../../Hooks/useTitle";
import SearchHeader from "../../../Components/SearchHeader";
import Moment from "react-moment";
import { Link } from "react-router-dom";

const AdminUsers = () => {
    useTitle("Users")
    const [users, setUsers] = useState([]);
    const [orgData, setOrgData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(0);
    const [IsDeleting, setIsDeleting] = useState(false);

    const getUsers = () => {
        axios.get(`${Helpers.apiUrl}user/all`, Helpers.authHeaders).then(response => {
            setUsers(response.data);
            setOrgData(response.data);
        });
    }

    const initiateDelete = id => {
        setSelectedUser(id);
    }

    const handleDelete = () => {
        setIsDeleting(true);
        axios.get(`${Helpers.apiUrl}category/delete/${selectedUser}`, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            getUsers();
            setSelectedUser(0);
            setIsDeleting(false);
        });
    }

    useEffect(() => {
        getUsers();
        return () => {
            getUsers();
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
                                    <h2 class="display-6">Users List</h2>
                                    <p>Registered users on HumGPT</p>
                                </div>
                            </div>
                        </div>
                        <div class="nk-block">
                            <SearchHeader title={"Users List"} orgData={orgData} setData={setUsers} columns={['name']} />
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <div className="col-md-12">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr. #</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Joined On</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.length === 0 && <tr>
                                                        <td colSpan={3}>No records found...</td>
                                                    </tr>}
                                                    {users.map((user, index) => {
                                                        return (
                                                            <tr>
                                                                <td>{ index + 1 }</td>
                                                                <td>{ user.name }</td>
                                                                <td>{ user.email }</td>
                                                                <td><Moment date={user.created_at} format="MMM Do YYYY" /></td>
                                                                <td>
                                                                   {(selectedUser && selectedUser === user.id) ? <div>
                                                                        <button className="btn btn-outline-danger btn-sm" disabled={IsDeleting} onClick={() => handleDelete(user)}>
                                                                            <em class="icon ni ni-check"></em><span className="ml5">{IsDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
                                                                        </button>
                                                                        <button className="btn btn-outline-primary btn-sm ml10" disabled={IsDeleting} onClick={() => setSelectedUser(0)}>
                                                                            <em class="icon ni ni-cross"></em><span className="ml5">Cancel</span>
                                                                        </button>
                                                                   </div> : <div>
                                                                        {/* <button className="btn btn-outline-danger btn-sm ml10" onClick={() => initiateDelete(user.id)}>
                                                                            <em class="icon ni ni-trash"></em><span className="ml5">Delete</span>
                                                                        </button> */}
                                                                        <Link to={`/admin/chats/user/${ user.id }`} className="btn btn-outline-primary btn-sm ml10">
                                                                            <em class="icon ni ni-eye"></em><span className="ml5">View Chats</span>
                                                                        </Link>
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

export default AdminUsers;