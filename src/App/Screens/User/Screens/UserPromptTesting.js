import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Helpers from "../../../Config/Helpers";
import useTitle from "../../../Hooks/useTitle";
import axios from "axios";
import PageLoader from "../../../Components/Loader/PageLoader";

const UserPromptTesting = () => {

    useTitle("Prompt Testing");
    const { prompt_id } = useParams();

    const navigate = useNavigate();

    const [prompt, setPrompt] = useState({});
    const [pageLoading, setPageLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [promptScreen, setPromptScreen] = useState(false);
    const [promptOutput, setPromptOutput] = useState("");
    const [responseOutput, setResponseOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const writePrompt = (value = "") => {
        let p = value ? value : prompt.prompt;
        
        questions.forEach(question => {
            let keyWithSpace = `{ ${question.key} }`;
            let keyWithoutSpace = `{${question.key}}`;
    
            if (p.includes(keyWithSpace) || p.includes(keyWithoutSpace)) {
                p = p.replace(new RegExp(keyWithSpace, 'g'), question.answer)
                     .replace(new RegExp(keyWithoutSpace, 'g'), question.answer);
            }
        });
    
        setPromptOutput(p);
    }

    const getPrompt = () => {
        let id = Helpers.decryptString(prompt_id);
        if(id){
            setPageLoading(true);
            axios.get(`${Helpers.apiUrl}prompt/find/${id}`, Helpers.authHeaders).then(response => {
                console.log(response.data);
                let data = response.data.prompt;
                setPrompt(data);
                setQuestions(data.prompt_question.questions);
                setPageLoading(false);
            });
        }else{
            navigate(-1);
        }
    }

    const nextQuestion = e => {
        e.preventDefault();
        let question = questions[currentQuestion];
        if(parseInt(question.is_optional) === 0){
            if(!question.answer){
                Helpers.toast("error", `question is required.`);
                return;
            }
        }
        if(currentQuestion === (questions.length - 1)){
            writePrompt();
            setPromptScreen(true);
        }else{
            setCurrentQuestion(currentQuestion + 1);
        }
    }

    const updatePrompt = e => {
        let value = e.target.value;
        setPrompt({...prompt, prompt: value});
        writePrompt(value);
    }

    const previousQuestion = () => {
        setCurrentQuestion(currentQuestion - 1);
    }

    const getResponse = () => {
        setResponseOutput("");
        setIsLoading(true);
        const data = {
            input: promptOutput,
            prompt_id: prompt.prompt_question_id
        };
        const controller = new AbortController();
        const signal = controller.signal;
        fetch(`${ Helpers.apiUrl }gpt/test`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data),
            signal
        }).then(response => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            function processText({done, value}){
                if(done){
                    setIsLoading(false);
                    return;
                }
                let text = decoder.decode(value);
                console.log(text);
                if(text.endsWith("[DONE]")){
                    text = text.slice(0, -6);
                }
                let withLines = text.replace(/\\n/g, '\n');
                setResponseOutput(prev => prev + withLines);
                reader.read().then(processText);
            }
            reader.read().then(processText);
        }).catch(error => {
            console.log("ERROR::", error);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getPrompt();
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">{ prompt.prompt_question && prompt.prompt_question.name } Test</h2>
                                    <p>{ prompt.prompt_question && prompt.prompt_question.description }</p>
                                </div>
                            </div>
                        </div>
                        {promptScreen && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Edit Your Prompt</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    <div class="row g-3 gx-gs">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label className="form-label">Prompt { prompt.prompt_question.name }</label>
                                                <div class="form-control-wrap">
                                                    <textarea className="form-control" value={prompt.prompt} onChange={updatePrompt}></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <h4>Prompt Output</h4>
                                            <p>{ promptOutput }</p>
                                        </div>
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" disabled={isLoading} onClick={getResponse}>{isLoading ? 'Generating Response...' : 'Generate Results'}</button>
                                        </div>
                                        <div className="col-md-12 mt-3">
                                            <p style={{ whiteSpace: 'pre-wrap' }}>{ responseOutput }</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {!promptScreen && <div class="nk-block">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-head-content"><h3 class="nk-block-title">Answer the Questions to Test the Prompt</h3></div>
                            </div>
                            <div class="card shadown-none">
                                <div class="card-body">
                                    {questions.length === 0 && <div class="row g-3 gx-gs">
                                        <div className="col-md-12">
                                            <p>No questions found...</p>
                                        </div>
                                    </div>}
                                    {questions.length > 0 && <div class="row g-3 gx-gs">
                                        <form onSubmit={nextQuestion}>
                                            <div className="col-md-12">
                                                {questions[currentQuestion].question_type === "Text" && <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label class="form-label">{ questions[currentQuestion].question }</label>
                                                        <div class="form-control-wrap">
                                                            <input className="form-control" type="text" value={questions[currentQuestion].answer || ''} placeholder={`Example: ${questions[currentQuestion].hint}`} onChange={e => setQuestions(prevState => {
                                                                let newQuestions = [...prevState];
                                                                newQuestions[currentQuestion].answer = e.target.value;
                                                                return newQuestions;
                                                            })} />
                                                        </div>
                                                    </div>
                                                </div>}
                                                {questions[currentQuestion].question_type === "Options" && <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label class="form-label">{ questions[currentQuestion].question }</label>
                                                        <div class="form-control-wrap">
                                                            <select className="form-control" value={questions[currentQuestion].answer} onChange={e => setQuestions(prevState => {
                                                                let newQuestions = [...prevState];
                                                                newQuestions[currentQuestion].answer = e.target.value;
                                                                return newQuestions;
                                                            })}>
                                                                <option disabled selected>Choose from options</option>
                                                                {questions[currentQuestion].question_options.map((opt, index) => <option key={index} value={opt.option}>{ opt.option }</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>}
                                            </div>
                                        </form>
                                        <div className="col-md-12">
                                            <button className="btn btn-primary" onClick={nextQuestion}>{(currentQuestion === (questions.length - 1)) ? 'Finish Questionnaire' : 'Next Question'}</button>
                                            <button className="btn btn-outline-primary ml10" disabled={currentQuestion === 0} onClick={previousQuestion}>Previous Question</button>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>}
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default UserPromptTesting;