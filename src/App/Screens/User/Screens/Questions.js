import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTitle from "../../../Hooks/useTitle";
import PageLoader from "../../../Components/Loader/PageLoader";
import axios from "axios";
import Helpers from "../../../Config/Helpers";

const UserPromptQuestions = () => {

    useTitle("Prompt Testing");
    const { prompt_id } = useParams();

    const navigate = useNavigate();

    const [pageLoading, setPageLoading] = useState(false);
    const [prompt, setPrompt] = useState({});
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const getPrompt = () => {
        setPageLoading(true);
        let id = Helpers.decryptString(prompt_id);
        if(id){
            axios.get(`${Helpers.apiUrl}prompt/single/${id}`, Helpers.authHeaders).then(response => {
                setPrompt(response.data);
                setPageLoading(false);
            });
        }else{
            navigate(-1);
        }
    }

    const getQuestions = () => {
        let id = Helpers.decryptString(prompt_id);
        axios.get(`${Helpers.apiUrl}question/all/prompt/${id}/asc`, Helpers.authHeaders).then(response => {
            setQuestions(response.data);
        });
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
            setIsLoading(true);
            let data = {"questions": questions};
            axios.post(`${Helpers.apiUrl}answer/save`, data, Helpers.authHeaders).then(response => {
                navigate(`/user/chat/${response.data.chat_id}`);
                setIsLoading(false);
            }).catch(error => {
                if(error.response){
                    Helpers.toast("error", error.response.data.message);
                }else{
                    Helpers.toast("error", "Unexpected error occured");
                }
                setIsLoading(false);
            });
        }else{
            setCurrentQuestion(currentQuestion + 1);
        }
    }

    const previousQuestion = () => {
        setCurrentQuestion(currentQuestion - 1);
    }

    useEffect(() => {
        getPrompt();
        getQuestions();
    }, []);

    return (
        <div class="nk-content">
            <div class="container-xl">
                <div class="nk-content-inner">
                    {pageLoading ? <PageLoader /> : <div class="nk-content-body">
                        <div class="nk-block-head nk-page-head">
                            <div class="nk-block-head-between">
                                <div class="nk-block-head-content">
                                    <h2 class="display-6">{ prompt.name }</h2>
                                    <p>Answer the Questions to Test the Prompt</p>
                                </div>
                            </div>
                            <div class="nk-block mt-5">
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
                                                    <strong>Question { currentQuestion + 1 }/{ questions.length }</strong>
                                                </div>
                                                <div className="col-md-12 mt-3">
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
                                                <button className="btn btn-primary" disabled={isLoading} onClick={nextQuestion}>{(currentQuestion === (questions.length - 1)) ? 'Finish Questionnaire' : 'Next Question'}</button>
                                                <button className="btn btn-outline-primary ml10" disabled={currentQuestion === 0} onClick={previousQuestion}>Previous Question</button>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default UserPromptQuestions;