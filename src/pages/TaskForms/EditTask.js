import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import { commonHeaders, SERVER_API_URL } from "../../util/config/constants"
import Attachments from '../../components/attachments/Attachments'

export default function EditTask(props) {
    const [projectUsers, setProjectUsers] = useState([]);
    const [attachmentsOld, setAttachments] = useState([]);

    const asigneeRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const attachmentsNewRef = useRef();

    const getProjectUsers = () => {
        //Если задача на тестирование, подгружаем только тестировщиков
        const isTesting = props.task.type === "Testing";

        axios.post(`${SERVER_API_URL}/projects/${isTesting ? "testers" : "users"}`,
            JSON.stringify({
                projectId: props.projectId
            }),
            commonHeaders
        ).then((res) => {
            const users = res.data?.users ?? [];
            setProjectUsers(users);
        }).catch((e) => console.log(e));
        //setProjectUsers(["User1", "User2"])
    };

    //Updating Users onLoad:
    useEffect(() => {
        getProjectUsers();
        setAttachments(props.task.attachments);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${SERVER_API_URL}/task/change`,
            JSON.stringify({
                taskId: props.task.id,
                projectId: props.projectId,
                status: props.task.status,
                asignee: asigneeRef.current.value,
                name: nameRef.current.value,
                description: descriptionRef.current.value,
                attachmentsOld: attachmentsOld,
                attachmentsNew: attachmentsNewRef.current.value,
            }),
            commonHeaders
        ).then((res) => {
            if (res.data.status)
                props.setEditing(false);
            else
                throw new Error(`Ошибка изменения задачи:${res.data.message}`);
        }).catch((e) => console.log(e));
    }

    return (
        <div className="container" >
            <div className="row">
                <div className="col-auto">
                    <form method="POST" action={`${SERVER_API_URL}/task/change`} onSubmit={(e) => { handleSubmit(e); }}>
                        <div className="mb-3">
                            <label htmlFor="taskName" className="form-label">
                                Название задачи
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="taskName"
                                placeholder="Введите название"
                                defaultValue={props.task.name}
                                name="name"
                                ref={nameRef}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="asignee" className="form-label">
                                Выбор исполнителя
                            </label>
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                id="asignee"
                                name="asignee"
                                ref={asigneeRef}
                            >
                                <option selected key={props.task.asignee}>{props.task.asignee}</option>
                                {projectUsers.map((user) =>
                                    <option value={user} key={user}>{user}</option>
                                )}
                            </select>
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
                                defaultValue={props.task.description}
                            />
                        </div>
                        <div className="row">
                            <Attachments attachments={attachmentsOld} setAttachments={setAttachments} />
                        </div>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                type="file"
                                name="attachmentsNew"
                                ref={attachmentsNewRef}
                                id="attachments"
                                multiple
                            />
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-auto">
                                <a className="btn btn-danger" onClick={() => {
                                    props.setEditing(false)
                                }}>Отмена</a>
                            </div>
                            <div className="col-auto">
                                <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


