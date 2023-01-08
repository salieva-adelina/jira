import React, {useEffect, useState} from 'react'
import EditTask from "../TaskForms/EditTask";
import axios from "axios";
import { SERVER_API_URL } from "../../util/config/constants"

//Пример данных задачи
const taskExample = {
    type: "Testing",
    id: "dwadwa",
    name: "Сделаем проект!",
    description: "Описание задачи какое-то",
    author : "Автор",
    asignee : "Исполнитель",
    status : "InProgress",
    availableTransitions : ["Cancelled", "Done"],
    attachments : [
        {name: "MyWork1.doc", link: "http://example.com/link-to-file1"},
        {name: "MyWork2.doc", link: "http://example.com/link-to-file2"}
    ]
};
export default function Task(props) {
    const projectId = props.match.params.id;
    const taskId = props.match.params.taskId;

    const [isEditing, setEditing] = useState(false);
    const [task, setTask] = useState({});


    //Updating Task onLoad:
    useEffect(()=>{
        getTask();
    },[isEditing]);

    const getTask = ()=>{
        if(!taskId || !projectId || isEditing) return;

        axios.post(`${SERVER_API_URL}/task`,{
            taskId: taskId,
            projectId: projectId,
        })
            .then((res)=>{
                if(res.data.status)
                    setTask(res.data);
                else
                    throw new Error(`Ошибка запроса задачи:${res.data.message}`);
            })
            .catch((e)=>console.log(e));
        // Для дебага
        setTask(taskExample);
    }
    const transitTask = (status)=>{
        if(!status || !taskId || !projectId){
            return;
        }
        axios.post(`${SERVER_API_URL}/task/transit`,{
            taskId: taskId,
            projectId: projectId,
            status : status,
        }).then((res)=>{
            if(res.data.status)
                setTask({
                    ...task,
                    status: status
                });
            else
                throw new Error(`Ошибка перевода статуса задачи:${res.data.message}`);
        }).catch((e)=>console.log(e));
    }

    return (
        <div className="container">
            {isEditing ?
                <EditTask
                    projectId={projectId}
                    task={task}
                    setEditing={setEditing}
                />
                : (
                <div>
                    <h2>{task.name}</h2>
                    <br/>
                    <div className="row">
                        <div className="col-auto">
                            <dl className="row">
                                <dt className="col-sm-3">Автор</dt>
                                <dd className="col-sm-9">{task.author}</dd>
                                <dt className="col-sm-3">Исполнитель</dt>
                                <dd className="col-sm-9">{task.asignee}</dd>
                                <dt className="col-sm-3">Статус</dt>
                                <dd className="col-sm-9">{task.status}</dd>
                            </dl>
                        </div>
                        <div className="col-auto">
                            <div
                                className="btn-group"
                                role="group"
                                aria-label="Basic mixed styles example"
                            >
                                <button type="button" className="btn btn-primary" onClick={()=>{setEditing(true)}}>Редактировать задачу</button>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-secondary dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >Перевести в статус</button>
                                    <ul className="dropdown-menu">
                                        {task.availableTransitions?.map((elem)=>
                                            <li><a className="dropdown-item" onClick={()=>{transitTask(elem)}}>{elem}</a></li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4>Описание задачи</h4>
                        <dl className="row"><p>{task.description}</p></dl>
                    </div>
                    <div className="row">
                        <div className="col-auto">
                            <h5>Прикреплённые файлы</h5>
                            <ol className="list-group list-group-numbered">
                                {task.attachments?.map((file)=>
                                    <li className="list-group-item">
                                        <a href={file.link} target="_blank" className="stretched-link text-danger">{file.name}</a>
                                    </li>
                                )}
                            </ol>
                        </div>
                    </div>
                    <br/>
                </div>
                )
            }
        </div>
    )
}


