import { useEffect, useState } from "react";
import useTitle from "../../../Hooks/useTitle";
import PageLoader from "../../../Components/Loader/PageLoader";
import axios from "axios";
import Helpers from "../../../Config/Helpers";
import Wrapper from "../../../Components/Wrapper";

const AdminStripeDashboard = () => {
    useTitle("Categories")
    const [pageLoading, setPageLoading] = useState(false);
    const [products, setProducts] = useState([]);
    
    const getProducts = () => {
        setPageLoading(true);
        axios.get(`${Helpers.apiUrl}stripe/products`, Helpers.authHeaders).then(response => {
            setProducts(response.data.data);
            setPageLoading(false);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            setPageLoading(false);
        });
    }

    useEffect(() => {
        getProducts()
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">Stripe Products</h2>
                                    <p>Manage your products from Stripe Dashboard</p>
                                </div>
                            </div>
                        </div>
                        <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">All Products</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <div className="col-md-12">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr. #</th>
                                                        <th>Product Name</th>
                                                        <th>Type</th>
                                                        <th>Description</th>
                                                        <th>Price</th>
                                                        <th>Interval</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products.length === 0 && <tr><td colSpan={4}>No records found...</td></tr>}
                                                    {products.map((product, index) => {
                                                        return (
                                                            <tr key={product.id}>
                                                                <td>{ index + 1 }</td>
                                                                <td>{ product.name }</td>
                                                                <td>{ product.type }</td>
                                                                <td><Wrapper content={ product.description } /></td>
                                                                <td>{ product.unit_amount } { product.currency }</td>
                                                                <td>{ product.interval }</td>
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
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default AdminStripeDashboard;