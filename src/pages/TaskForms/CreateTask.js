import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

export default function CreateTask(props) {
    const isTestingRef = useRef();
    const suitRef = useRef();
    const caseRef = useRef();
    const runRef = useRef();

    const [projectUsers, setProjectUsers] = useState([]);
    const [suits, setSuits] = useState([]);
    const [cases, setCases] = useState([]);
    const [runs, setRuns] = useState([]);
    const [link, setLink] = useState();

    //Updating Users onLoad:
    useEffect(()=>{getProjectUsers()},[]);

    const getProjectUsers = () => {
        //Если задача на тестирование, подгружаем только тестировщиков
        const isTesting = isTestingRef.current.value;
        axios.post(
            `${props.serverUrl}/projects/${isTesting ? "testers" : "users"}`,
            {"projectId":props.projectId})
            .then((res)=>{
                const users = res.data?.users ?? [];
                setProjectUsers(users);})
            .catch((e)=>console.log(e));
        //setProjectUsers(["User1", "User2"])
    };

    const getSuits = () => {
        const isTesting = isTestingRef.current.value;
        if(!isTesting){
            setSuits([]);
            setCases([]);
            setRuns([]);
            return;
        }

        axios.post(`${props.serverUrl}/projects/test/suites`,{"projectId":props.projectId})
            .then((res)=>{
                const suits = res.data?.suits ?? [];
                setSuits(suits);})
            .catch((e)=>console.log(e));
        //setSuits(["1", "2"])
    };

    const getCases = ()=>{
        const suit = suitRef.current.value;
        const isTesting = isTestingRef.current.value;

        if(!isTesting || !suit){
            setCases([]);
            setRuns([]);
            return;
        }

        axios.post(`${props.serverUrl}/projects/test/cases`,{
            projectId: props.projectId,
            testSuit: suit
        }).then((res)=>{
            const cases = res.data?.cases ?? [];
            setCases(cases);
        }).catch((e)=>console.log(e));
        //setCases(["1", "2"]);
    };

    const getRuns = ()=>{
        const suit = suitRef.current.value;
        const Case = caseRef.current.value;
        const isTesting = isTestingRef.current.value;

        if(!isTesting || !suit || !Case){
            setRuns([]);
            return;
        }

        axios.post(`${props.serverUrl}/projects/test/runs`,{
            projectId :props.projectId,
            testSuit: suit,
            testCase: Case
        }).then((res)=>{
            const runs = res.data?.runs ?? [];
            setRuns(runs);
        }).catch((e)=>console.log(e));
        //setRuns(["1", "2"]);
    };

    const getTestLink = () => {
        const suit = suitRef.current.value;
        const Case = caseRef.current.value;
        const run = runRef.current.value;
        const isTesting = isTestingRef.current.value;

        if(!isTesting || !suit || !Case || !run){
            setLink(undefined);
            return;
        }

        axios.post(`${props.serverUrl}/projects/test/generate`,{
            projectId: props.projectId,
            testSuit: suit,
            testRun: run,
            testCase: Case
        }).then((res)=>{
            const url = res.data?.url ?? "";
            setLink(url);
        }).catch((e) => console.log(e));
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-auto">
                    <form method="POST" action={`${props.serverUrl}/task/create`}>
                        <input type="text" className="form-control d-none" value={props.projectId} readOnly={true} name="projectId"/>
                        <input type="text" className="form-control d-none" value={props.author} readOnly={true} name="author"/>
                        <div className="mb-3">
                            <label htmlFor="taskName" className="form-label">Название задачи</label>
                            <input type="text" className="form-control" placeholder="Введите название" name="name"/>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isTesting"
                                name="isTesting"
                                data-bs-toggle="collapse"
                                data-bs-target="#suits"
                                aria-expanded="false"
                                aria-controls="suits"
                                ref={isTestingRef}
                                onChange={()=>{
                                    getProjectUsers();
                                    getSuits();
                                }}
                            />
                            <label className="form-check-label" htmlFor="isTesting">Задача на тестирование</label>
                        </div>
                        <p/>
                        <div className="mb-3">
                            <label htmlFor="asignee" className="form-label">
                                Выбор исполнителя
                            </label>
                            <select className="form-select" aria-label="Default select example" name="asignee">
                                {projectUsers.map((user)=>
                                    <option value={user} key={user}>{user}</option>
                                )}
                            </select>
                        </div>
                        <div className="collapse" id="suits">
                            <label>Параметры для тестирования</label>
                            <div className="mb-3">
                                <select className="form-select" aria-label="Suits" ref={suitRef} onChange={()=>{getCases();}}>
                                    <option value="">Выберите suit</option>
                                    { suits.map((suit)=>
                                        <option value={suit} key={suit}>{suit}</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" aria-label="Cases" ref={caseRef} onChange={()=>{getRuns();}}>
                                    <option value="">Выберите case</option>
                                    { cases.map((Case)=>
                                        <option value={Case} key={Case}>{Case}</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" aria-label="Runs" ref={runRef} onChange={()=>{getTestLink();}}>
                                    <option value="">Выберите run</option>
                                    { runs.map((run)=>
                                        <option value={run} key={run}>{run}</option>
                                    )}
                                </select>
                            </div>
                            <input type="text" className="form-control d-none" readOnly={true} value={link} name="link"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="taskDescription" className="form-label">
                                Описание задачи
                            </label>
                            <textarea
                                className="form-control"
                                id="taskDescription"
                                rows={3}
                                name="description"
                                defaultValue={""}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="attachments" className="form-label">Прикреплённые файлы</label>
                            <input
                                className="form-control"
                                type="file"
                                name="attachments"
                                id="attachments"
                                multiple
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mb-3">Создать задачу</button>
                    </form>
                </div>
            </div>
        </div>

    )
}


