import { useEffect, useRef, useState } from "react";
import TextInput from "../../../Components/Input";
import SelectInput from "../../../Components/Select";
import OptionTag from "../../../Components/OptionTag";
import { Link, useNavigate, useParams } from "react-router-dom";
import useTitle from "../../../Hooks/useTitle";
import Helpers from "../../../Config/Helpers";
import axios from "axios";
import PageLoader from "../../../Components/Loader/PageLoader";
import SearchHeader from "../../../Components/SearchHeader";
import PromptVersions from "./PromptComponents/PromptVersions";
import PromptEditor from "./PromptComponents/PromptEditor";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DraggableItem from "../../../Components/DraggableItem";

const AdminPromptQuestions = () => {
    useTitle("Prompt Questions");
    const navigate = useNavigate();
    const { prompt_id, is_adding } = useParams();
    const promptInputRef = useRef(null);
    
    const questionTypes = ['Text', 'Options'];
    
    const defaultQuestion = {
        question:'',
        question_type: 'Options',
        is_optional:0,
        options:[],
        hint:'',
        key: ''
    }

    const defaultPrompt = {
        prompt:"",
    }

    const [question, setQuestion] = useState(defaultQuestion);
    const [questions, setQuestions] = useState([]);
    const [orgData, setOrgData] = useState([]);
    const [prompt, setPrompt] = useState({});
    const [promptInput, setPromptInput] = useState(defaultPrompt);
    const [option, setOption] = useState("");
    const [options, setOptions] = useState([]);
    const [initLoading, setInitLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(is_adding ? true : false);
    const [errors, setErrors] = useState({});
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [promptResult, setPromptResult] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [showVersions, setShowVersions] = useState(false);

    const getPrompt = () => {
        let id = Helpers.decryptString(prompt_id);
        if(id){
            axios.get(`${Helpers.apiUrl}prompt/single/${id}`, Helpers.authHeaders).then(response => {
                if(response.data){
                    setPrompt(response.data);
                    getQuestions(id);
                    setInitLoading(false);
                }else{
                    navigate(-1);
                }
            });
        }else{
            navigate(-1);
        }
    }

    const getPromptInput = () => {
        let id = Helpers.decryptString(prompt_id);
        if(id){
            axios.get(`${ Helpers.apiUrl }prompt/get/${id}`, Helpers.authHeaders).then(response => {
                if(response.data.prompt){
                    setPromptInput(response.data.prompt);
                }
            });
        }else{
            navigate(-1);
        }
    }

    const addOption = e => {
        e.preventDefault();
        if(option){
            setOptions([...options, option]);
            setOption("");
        }else{
            Helpers.toast("error", "Please add option")
        }
    }

    const removeOption = index => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    }

    const getQuestions = (id) => {
        axios.get(`${Helpers.apiUrl}question/all/prompt/${id ? id : prompt.id}`, Helpers.authHeaders).then(response => {
            setQuestions(response.data);
            setOrgData(response.data);
        });
    }

    const saveQuestion = () => {
        setIsLoading(true);
        setErrors({});
        let data = question;
        data.prompt_question_id = prompt.id;
        data.options = options;
        axios.post(`${Helpers.apiUrl}question/save`, data, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            setQuestion(defaultQuestion);
            setOptions([]);
            getQuestions();
            setShowForm(false);
            setIsLoading(false);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
            setIsLoading(false);
        });
    }

    const handleEdit = (que) => {
        let opts = [];
        que.question_options.forEach(opt => opts.push(opt.option));
        setQuestion(que);
        setOptions(opts);
        setShowForm(true);
    }

    const handleCancel = () => {
        setQuestion(defaultQuestion);
        setOptions([]);
        setErrors({});
        setShowForm(false);
    }

    const initDelete = id => {
        setSelectedQuestion(id);
    }

    const confirmDelete = id => {
        setIsDeleting(true);
        axios.get(`${Helpers.apiUrl}question/delete/${id}`, Helpers.authHeaders).then(response => {
            Helpers.toast("success", response.data.message);
            getQuestions();
            setSelectedQuestion(0);
        });
    }
    
    const cancelDelete = () => {
        setSelectedQuestion(0);
    }

    const showPromptWin = () => {
        setShowPrompt(true);
        setShowForm(false);
    }

    const pickQuestion = que => {
        let p = promptInput.prompt;
        p += `{ ${ que.key } }`;
        setPromptInput({...promptInput, prompt: p});
        promptInputRef.current.focus();
    }

    const savePrompt = () => {
        if(promptInput.prompt){
            setIsSaving(true);
            let data = promptInput;
            data.prompt_question_id = prompt.id;
            data.message = saveMessage;
            axios.post(`${ Helpers.apiUrl }prompt/save`, data, Helpers.authHeaders).then(response => {
                setPromptInput(response.data.prompt);
                setSaveMessage("");
                Helpers.toast("success", response.data.message);
                setIsSaving(false);
            }).catch(error => {
                Helpers.toast("error", error.response.data.message);
                setIsSaving(false);
            });
        }
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        result.forEach((item, index) => {
            item.question_order = index + 1;
        });
        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
          return;
        }
    
        const newItems = reorder(
          questions,
          result.source.index,
          result.destination.index
        );
        setQuestions(newItems);
        axios.post(`${Helpers.apiUrl}question/update-order`, { questions }, Helpers.authHeaders).then(response => {
            setQuestions(response.data);
        }).catch(error => {
            Helpers.toast("error", error.response.data.message);
        })
      };

    useEffect(() => {
        getPrompt();
        getPromptInput();
        // return () => {
        //     getPrompt();
        // };
    }, []);
    
    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {initLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">{`${ prompt.name } - ${ prompt.category.name }`}</h2>
                                    <p>Manage all the questions related to { prompt.name }</p>
                                </div>
                                <div>
                                    {!showForm && <button className="btn btn-primary" onClick={() => setShowForm(true)}><em class="icon ni ni-plus"></em> <span className="ml5">Add New Question</span></button>}
                                    {!showPrompt && <button className="btn btn-primary ml10" onClick={showPromptWin}><em class="icon ni ni-file"></em> <span className="ml5">Prompt</span></button>}
                                    {showPrompt && <Link className="btn btn-primary ml10" to={`/admin/prompt/${ Helpers.encryptString(promptInput.id) }`}><em class="icon ni ni-check-circle"></em> <span className="ml5">Test Prompt</span></Link>}
                                    {showPrompt && <button className="btn btn-outline-danger ml10" onClick={() => setShowPrompt(false)}><em class="icon ni ni-arrow-left"></em> <span className="ml5">Back</span></button>}
                                </div>
                            </div>
                        </div>
                        {(showPrompt && !showForm) && <div class="nk-block">
                            <div className="row">
                                <div className="col-md-6">
                                    <div class="nk-block-head-content"><h3 class="nk-block-title">{ showVersions ? 'Prompt Versions' : 'Write Your Prompt' }</h3></div>
                                </div>
                                {promptInput.prompt_versions && <div className="col-md-6 text-right">
                                    {!showVersions && <button className="btn btn-primary" onClick={() => setShowVersions(true)}><em class="icon ni ni-history"></em> <span className="ml5">Previous Versions</span></button>}
                                    {showVersions && <button className="btn btn-outline-danger" onClick={() => setShowVersions(false)}><span>Back To Prompt Editor</span></button>}
                                </div>}
                            </div>
                            <div class="card shadown-none mt-3">
                                {showVersions && <PromptVersions setPromptInput={setPromptInput} setShowVersions={setShowVersions} versions={promptInput.prompt_versions} />}
                                {!showVersions && <PromptEditor
                                    questions={questions}
                                    isSaving={isSaving}
                                    pickQuestion={pickQuestion}
                                    promptInput={promptInput}
                                    promptInputRef={promptInputRef}
                                    saveMessage={saveMessage}
                                    savePrompt={savePrompt}
                                    setPromptInput={setPromptInput}
                                    setSaveMessage={setSaveMessage}
                                />}
                            </div>
                        </div>}
                        {(!showForm && !showPrompt) && <div class="nk-block">
                            <SearchHeader title={"All Questions"} orgData={orgData} setData={setQuestions} columns={['question', 'question_type']} />
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="mt-3"
                                        >
                                            {questions.map((item, index) => (
                                                <DraggableItem
                                                    key={item.id}
                                                    item={item}
                                                    index={index}
                                                    selectedQuestion={selectedQuestion}
                                                    confirmDelete={confirmDelete}
                                                    isDeleting={isDeleting}
                                                    cancelDelete={cancelDelete}
                                                    handleEdit={handleEdit}
                                                    initDelete={initDelete}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>}
                        {(showForm && !showPrompt) && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Add New Question</h3></div>
                            </div>
                            <div class="card shadown-none mt-3">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <TextInput cols={12} error={errors.question} label={"Write Your Questions"} placeholder="Enter question here..." value={question.question} onChange={e => setQuestion({...question, question: e.target.value})} />
                                        <SelectInput 
                                            label={'Question Type'} 
                                            value={question.question_type} 
                                            options={questionTypes}
                                            onChange={e => setQuestion({...question, question_type: e.target.value})} 
                                            error={errors.question_type}
                                        />
                                        <SelectInput 
                                            label={'Is Optional?'} 
                                            value={question.is_optional} 
                                            options={[{value: 1, label: 'Yes'}, {value: 0, label: 'No'}]}
                                            isObject={true}
                                            optionLabel={'label'}
                                            optionValue={'value'}
                                            onChange={e => setQuestion({...question, is_optional: e.target.value})} 
                                            error={errors.is_optional}
                                        />
                                        <TextInput label={"Hint"} error={errors.hint} value={question.hint} onChange={e => setQuestion({...question, hint: e.target.value})} />
                                        <TextInput label={"Key (Don't add any space)"} error={errors.key} value={question.key} onChange={e => setQuestion({...question, key: e.target.value})} />
                                        {question.question_type === 'Options' && <div className="col-md-12">
                                            <form onSubmit={addOption}>
                                                <div className="row">
                                                    <TextInput error={errors.options} cols={11} label={"Add Your Options"} placeholder="Enter you option here" value={option} onChange={e => setOption(e.target.value)} />
                                                    <div className="col-md-1">
                                                        <button className="btn btn-primary w-100 mt32" onClick={addOption}><em class="icon ni ni-plus"></em></button>
                                                    </div>
                                                </div>
                                            </form>
                                            <div className="row mt-3">
                                                <div className="col-md-12">
                                                    {options.map((opt, index) => {
                                                        return <OptionTag key={index} option={opt} onCancel={() => removeOption(index)} />
                                                    })}
                                                </div>
                                            </div>
                                        </div>}
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" disabled={isLoading} onClick={saveQuestion}>{isLoading ? 'Saving...' : 'Save Question'}</button>
                                            <button className="btn btn-outline-danger ml10" onClick={handleCancel}>Cancel</button>
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

export default AdminPromptQuestions;