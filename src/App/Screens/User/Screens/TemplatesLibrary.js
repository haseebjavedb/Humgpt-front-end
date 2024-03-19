import axios from "axios";
import { useEffect, useState } from "react";
import Helpers from "../../../Config/Helpers";
import PageLoader from "../../../Components/Loader/PageLoader";
import { Link } from "react-router-dom";

const TemplatesLibrary = () => {

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [prompts, setPrompts] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);
    const [filteredPrompts, setFilteredPrompts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const getCategories = () => {
        axios.get(`${Helpers.apiUrl}category/all`, Helpers.authHeaders).then(response => {
            setCategories(response.data);
        });
    }

    const getPrompts = () => {
        setPageLoading(true);
        axios.get(`${Helpers.apiUrl}prompt/templates-library`, Helpers.authHeaders).then(response => {
            setPrompts(response.data);
            setFilteredPrompts(response.data);
            setPageLoading(false);
        });
    }

    const filterPrompts = category_id => {
        setSelectedCategory(category_id);
        if (category_id === 0) {
            setFilteredPrompts(prompts);
        } else {
            let filtered = prompts.filter(prompt => prompt.category_id === category_id);
            setFilteredPrompts(filtered);
        }
    }

    const searchTemplates = e => {
        let value = e.target.value;
        setSearchQuery(value);
        setSelectedCategory(0);
        let filtered = prompts.filter(prompt => prompt.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredPrompts(filtered);
    }

    useEffect(() => {
        getPrompts();
        getCategories();
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">Template Library</h2>
                                    <p>Choose the template which you want to use</p>
                                </div>
                                <div class="nk-block-head-content">
                                    <div class="d-flex gap gx-4">
                                        <div class="">
                                            <div class="form-control-wrap">
                                                <div class="form-control-icon start md text-light"><em class="icon ni ni-search"></em></div>
                                                <input type="text" value={searchQuery} onChange={searchTemplates} class="form-control form-control-md" placeholder="Search Template" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nk-block">
                            <ul class="filter-button-group mb-4 pb-1">
                                <li><button class={`filter-button ${selectedCategory === 0 ? 'active' : ''}`} onClick={() => filterPrompts(0)} type="button" data-filter="*">All</button></li>
                                {categories.map(category => <li><button class={`filter-button ${selectedCategory === category.id ? 'active' : ''}`} onClick={() => filterPrompts(category.id)} type="button">{category.name}</button></li>)}
                            </ul>
                            <div class="row g-gs filter-container" data-animation="true">
                                {filteredPrompts.map(prompt => {
                                    return (
                                        <div class="col-sm-6 col-xxl-3 filter-item blog-content">
                                            <Link to={`/user/prompt-questions/${Helpers.encryptString(prompt.id)}/${prompt.name.replaceAll(" ", "-")}`}>
                                                <div class="card card-full shadow-none">
                                                    <div class="card-body">
                                                        <div class="media media-rg media-middle media-circle text-primary bg-primary bg-opacity-20 mb-3">{prompt.name.charAt(0)}</div>
                                                        <h5 class="fs-4 fw-medium">{prompt.name}</h5>
                                                        <p class="small text-light line-clamp-2">{prompt.description}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default TemplatesLibrary;