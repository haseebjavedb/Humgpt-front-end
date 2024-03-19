import axios from "axios";
import { useState } from "react";
import Moment from "react-moment";
import Helpers from "../../../../Config/Helpers";

const PromptVersions = ({ versions, setPromptInput, setShowVersions }) => {
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const restoreVersion = versionId => {
        setIsLoading(true);
        axios.get(`${ Helpers.apiUrl }prompt/restore-version/${versionId}`, Helpers.authHeaders).then(response => {
            setPromptInput(response.data.prompt);
            Helpers.toast("success", response.data.message);
            setIsLoading(false);
            setShowVersions(false);
        });
    }
    return (
        <div className="card-body">
            <div class="row g-3 gx-gs">
                <div className="col-md-12">
                    {selectedVersion && <div className="card mb-3">
                        <div className="card-body">
                            <p>{ selectedVersion.prompt }</p>
                            <div>
                                <button onClick={() => restoreVersion(selectedVersion.id)} className="btn btn-primary btn-sm" disabled={isLoading}>Restore Version</button>
                                <button onClick={() => setSelectedVersion(null)} disabled={isLoading} className="btn btn-outline-danger btn-sm ml10">Cancel</button>
                            </div>
                        </div>
                    </div>}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Sr. #</th>
                                <th>Version</th>
                                <th>Date & Time</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {versions.map((version, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{ index + 1 }</td>
                                        <td>{ version.message }</td>
                                        <td><Moment date={version.created_at} format="ddd, MMM Do YYYY, h:mm a" /></td>
                                        <td>
                                            <button disabled={isLoading} className="btn btn-primary btn-sm" onClick={() => setSelectedVersion(version)}>View Prompt</button>
                                            <button disabled={isLoading} onClick={() => restoreVersion(version.id)} className="btn btn-primary btn-sm ml10">Restore Version</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PromptVersions;