import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import useTitle from "../../../Hooks/useTitle";
import SearchHeader from "../../../Components/SearchHeader";
import Moment from "react-moment";
import { Link } from "react-router-dom";

const AdminUsers = () => {
    useTitle("Users");

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

   const handleDelete = (userId) => {
    setIsDeleting(true);
    axios.post(`${Helpers.apiUrl}user/Delete/${userId}`, null, Helpers.authHeaders)
        .then(response => {
            Helpers.toast("success", response.data.message);
            getUsers();
            setSelectedUser(0);
            setIsDeleting(false);
        })
        .catch(error => {
            Helpers.toast("error", error.response.data.message);
            setIsDeleting(false);
        });
}


    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="nk-content">
            <div className="container-xl">
                <div className="nk-content-inner">
                    <div className="nk-content-body">
                        <div className="nk-block-head nk-page-head">
                            <div className="nk-block-head-between">
                                <div className="nk-block-head-content">
                                    <h2 className="display-6">Users List</h2>
                                    <p>Registered users on HumGPT</p>
                                </div>
                            </div>
                        </div>
                        <div className="nk-block">
                            <SearchHeader title={"Users List"} orgData={orgData} setData={setUsers} columns={['name']} />
                            <div className="card shadow-none">
                                <div className="card-body">
                                    <div className="row g-3 gx-gs">
                                        <div className="col-md-12">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr. #</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Joined On</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.length === 0 && <tr>
                                                        <td colSpan={3}>No records found...</td>
                                                    </tr>}
                                                    {users.map((user, index) => {
                                                        return (
                                                            <tr key={user.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{user.name}</td>
                                                                <td>{user.email}</td>
                                                                <td><Moment date={user.created_at} format="MMM Do YYYY" /></td>
                                                                <td>
                                                                    {(selectedUser && selectedUser === user.id) ? (
                                                                        <div>
                                                                            <button className="btn btn-outline-danger btn-sm" disabled={IsDeleting} onClick={() => handleDelete(user.id)}>
                                                                                <em className="icon ni ni-check"></em><span className="ml5">{IsDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
                                                                            </button>
                                                                            <button className="btn btn-outline-primary btn-sm ml10" disabled={IsDeleting} onClick={() => setSelectedUser(0)}>
                                                                                <em className="icon ni ni-cross"></em><span className="ml5">Cancel</span>
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <Link to={`/admin/chats/user/${user.id}`} className="btn btn-outline-primary btn-sm ml10">
                                                                                <em className="icon ni ni-eye"></em><span className="ml5">View Chats</span>
                                                                            </Link>
                                                                            <Link to={`/admin/user/Edit-User/${user.id}`} className="btn btn-outline-success btn-sm ms-2">
                                                                                <em className="icon ni ni-edit"></em><span className="ml5">Edit</span>
                                                                            </Link>
                                                                            <button className="btn btn-outline-danger btn-sm ml10" onClick={() => initiateDelete(user.id)}>
                                                                                <em className="icon ni ni-trash"></em><span className="ml5">Delete</span>
                                                                            </button>
                                                                        </div>
                                                                    )}
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
    );
}

export default AdminUsers;
