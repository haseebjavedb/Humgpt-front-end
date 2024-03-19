import TextInput from "../../../../Components/Input";

const PromptEditor = ({ questions, pickQuestion, promptInput, setPromptInput, promptInputRef, savePrompt, isSaving, saveMessage, setSaveMessage }) => {
    return (
        <div class="card-body">
            <div className="row">
                <div className="col-md-12">
                    <p><strong>Pick the questions to settle in the prompt</strong></p>
                    {questions.map(que => {
                        return <button onClick={() => pickQuestion(que)} title={ que.question } className="btn btn-outline-primary btn-sm mt-1 ml5">{ que.key }</button>
                    })}
                    {/* <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map(que => {
                                return (
                                    <tr>
                                        <td>{ que.question }</td>
                                        <td>{ que.key }</td>
                                        <td className="tb-col-end">
                                            <button onClick={() => pickQuestion(que)} className="btn btn-outline-primary btn-sm">Pick Question</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table> */}
                </div>
            </div>
            <div class="row g-3 gx-gs mt-3">
                <div className="col-md-12">
                    <label class="form-label">Prompt for { prompt.name }</label>
                    <div class="form-control-wrap">
                        <textarea value={promptInput.prompt} ref={promptInputRef} onChange={e => setPromptInput({...promptInput, prompt: e.target.value})} className="form-control" rows={10} />
                    </div>
                </div>
                <TextInput value={saveMessage} onChange={e => setSaveMessage(e.target.value)} label={"Message"} />
                <div className="col-md-6 pt-32">
                    <button className="btn btn-primary" onClick={savePrompt} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Prompt'}</button>
                    {/* <button className="btn btn-outline-danger ml10">Cancel</button> */}
                </div>
            </div>
        </div>
    )
}

export default PromptEditor;