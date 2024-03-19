import { useState } from "react";
import TextInput from "./Input";
import Helpers from "../Config/Helpers";

const SearchHeader = ({ orgData, setData, columns, title, isPaginated = false }) => {
    const [query, setQuery] = useState("");

    const initSearch = e => {
        let value = e.target.value;
        setQuery(value);
        let filtered = orgData.filter(row => {
            for(let i = 0; i < columns.length; i++){
                if(columns[i].includes(".")){
                    let cols = columns[i].split(".");
                    if(row[cols[0]][cols[1]].toLowerCase().includes(value)){
                        return true;
                    }
                }else{
                    if(row[columns[i]].toLowerCase().includes(value)){
                        return true;
                    }
                }
            }
        });
        if(isPaginated){
            setData(Helpers.paginate(filtered));
        }else{
            setData(filtered);
        }
    }

    return (
        <div class="nk-block-head nk-block-head-sm">
            <div className="row">
                <div className="col-md-8">
                    <div class="nk-block-head-content"><h3 class="nk-block-title">{ title }</h3></div>
                </div>
                <TextInput value={query} onChange={initSearch} cols={4} placeholder="Search here..." isSmall={true} />
            </div>
        </div>
    )
}

export default SearchHeader;