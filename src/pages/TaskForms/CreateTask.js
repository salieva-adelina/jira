import React, { useEffect, useRef, useState } from 'react'
import { commonHeaders, SERVER_API_URL } from "../../util/config/constants"
import axios from 'axios'
import { getCookie } from '../../util/libs/cookie';

export default function CreateTask(props) {
    const projectId = Number(props.match.params.id);
    const user = getCookie('login');
    const [isTesting, setTesting] = useState(false);
    const suitRef = useRef();
    const caseRef = useRef();
    const runRef = useRef();

    // form data
    const asigneeRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const attachmentsRef = useRef();

    const [projectUsers, setProjectUsers] = useState([]);
    const [suits, setSuits] = useState([]);
    const [cases, setCases] = useState([]);
    const [runs, setRuns] = useState([]);
    const [link, setLink] = useState();

    //Updating Users onLoad:
    useEffect(() => { getProjectUsers() }, []);

    const getProjectUsers = (isTesting) => {
        //Если задача на тестирование, подгружаем только тестировщиков

        axios.post(`${SERVER_API_URL}/projects/${isTesting ? "testers" : "users"}`,
            JSON.stringify({
                "projectId": projectId
            }),
            commonHeaders
        ).then((res) => {
            const users = res.data?.users ?? [];
            setProjectUsers(users);
        }).catch((e) => console.log(e));
        //setProjectUsers(["User1", "User2"])
    };

    const getSuits = (isTesting) => {
        if (!isTesting) {
            setSuits([]);
            setCases([]);
            setRuns([]);
            return;
        }

        axios.post(`${SERVER_API_URL}/projects/test/suites`,
            JSON.stringify({
                "projectId": projectId
            }),
            commonHeaders
        ).then((res) => {
            const suits = res.data?.suits ?? [];
            setSuits(suits);
        }).catch((e) => console.log(e));
        //setSuits(["1", "2"])
    };

    const getCases = () => {
        const suit = suitRef.current.value;

        if (!isTesting || !suit) {
            setCases([]);
            setRuns([]);
            return;
        }

        axios.post(`${SERVER_API_URL}/projects/test/cases`,
            JSON.stringify({
                projectId: projectId,
                testSuit: suit
            }),
            commonHeaders
        ).then((res) => {
            const cases = res.data?.cases ?? [];
            setCases(cases);
        }).catch((e) => console.log(e));
        //setCases(["1", "2"]);
    };

    const getRuns = () => {
        const suit = suitRef.current.value;
        const Case = caseRef.current.value;

        if (!isTesting || !suit || !Case) {
            setRuns([]);
            return;
        }

        axios.post(`${SERVER_API_URL}/projects/test/runs`,
            JSON.stringify({
                projectId: projectId,
                testSuit: suit,
                testCase: Case
            }),
            commonHeaders
        ).then((res) => {
            const runs = res.data?.runs ?? [];
            setRuns(runs);
        }).catch((e) => console.log(e));
        //setRuns(["1", "2"]);
    };

    const getTestLink = () => {
        const suit = suitRef.current.value;
        const Case = caseRef.current.value;
        const run = runRef.current.value;

        if (!isTesting || !suit || !Case || !run) {
            setLink(undefined);
            return;
        }

        axios.post(`${SERVER_API_URL}/projects/test/generate`,
            JSON.stringify({
                projectId: projectId,
                testSuit: suit,
                testRun: run,
                testCase: Case
            }),
            commonHeaders
        ).then((res) => {
            const url = res.url ?? "";
            setLink(url);
        }).catch((e) => console.log(e));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${SERVER_API_URL}/task/create`,
            JSON.stringify({
                isTesting: isTesting,
                projectId: projectId,
                author: user,
                asignee: asigneeRef.current.value,
                name: nameRef.current.value,
                description: descriptionRef.current.value,
                link: link,
                attachments: attachmentsRef.current.value,
            }),
            commonHeaders
        ).then((res) => {
            if (res.data?.status)
                props.setEditing(false);
            else
                throw new Error(`Ошибка изменения задачи:${res.data?.message}`);
        }).catch((e) => console.log(e));
    }

    const handleIsTestingChange = () => {
        const newTesting = !isTesting;
        setTesting(newTesting);
        getProjectUsers(newTesting);
        getSuits(newTesting);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-auto">
                    <form method="POST" action={`${SERVER_API_URL}/task/create`} onSubmit={(e) => { handleSubmit(e); }}>
                        <div className="mb-3">
                            <label htmlFor="taskName" className="form-label">Название задачи</label>
                            <input type="text" className="form-control" ref={nameRef} placeholder="Введите название" name="name" />
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
                                defaultChecked={false}
                                onChange={handleIsTestingChange}
                            />
                            <label className="form-check-label" htmlFor="isTesting">Задача на тестирование</label>
                        </div>
                        <p />
                        <div className="mb-3">
                            <label htmlFor="asignee" className="form-label">
                                Выбор исполнителя
                            </label>
                            <select className="form-select" ref={asigneeRef} aria-label="Default select example" name="asignee">
                                {projectUsers.map((user) =>
                                    <option value={user} key={user}>{user}</option>
                                )}
                            </select>
                        </div>
                        <div className="collapse" id="suits">
                            <label>Параметры для тестирования</label>
                            <div className="mb-3">
                                <select className="form-select" aria-label="Suits" ref={suitRef} onChange={() => { getCases(); }}>
                                    <option value="">Выберите suit</option>
                                    {suits.map((suit) =>
                                        <option value={suit} key={suit}>{suit}</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" aria-label="Cases" ref={caseRef} onChange={() => { getRuns(); }}>
                                    <option value="">Выберите case</option>
                                    {cases.map((Case) =>
                                        <option value={Case} key={Case}>{Case}</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" aria-label="Runs" ref={runRef} onChange={() => { getTestLink(); }}>
                                    <option value="">Выберите run</option>
                                    {runs.map((run) =>
                                        <option value={run} key={run}>{run}</option>
                                    )}
                                </select>
                            </div>
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
                                ref={descriptionRef}
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
                                ref={attachmentsRef}
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


