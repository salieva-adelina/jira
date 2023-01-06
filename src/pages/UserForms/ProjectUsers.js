import React, {useEffect, useState, useRef} from 'react'
import axios from "axios";
import AddUser from "./AddUser";

const availableRoles = ['Тестировщик', "Руководитель тестирования"];

/**
 * Компонент принимает:
 * projectId,
 * serverUrl
 * */

const ProjectUsers = (props) => {
    const [projectUsers, setProjectUsers] = useState([]);
    const [selectedUser, selectUser] = useState(undefined);
    const [userRoles, setUserRoles] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    const getProjectUsers = () => {
        if(!props.projectId || !props.serverUrl) return;

        axios.post(
            `${props.serverUrl}/projects/users`,
            {projectId: props.projectId})
            .then((res)=>{
                const users = res.data?.users ?? [];
                setProjectUsers(users);})
            .catch((e)=>console.log(e));
        setProjectUsers(["User1", "User2"])
    };

    const getUserRoles = () => {
        if(!props.projectId || !props.serverUrl || !selectedUser) return;
        axios.post(
            `${props.serverUrl}/user/roles/get`,
            {
                projectId: props.projectId,
                userLogin: selectedUser,
            }).then((res)=>{
                const roles = res.data?.roles ?? [];
                setUserRoles(roles);
            }).catch((e)=>console.log(e));
        setUserRoles(availableRoles);
    };

    const changeUserRoles = () => {
        if(!props.projectId || !props.serverUrl || !selectedUser) return;
        axios.post(
            `${props.serverUrl}/user/roles/change`,
            {
                projectId: props.projectId,
                userLogin: selectedUser,
                roles: userRoles ?? [],
            }).then((res)=>{

            const status = res.data?.status;
            if(!status){
                throw new Error(`Ошибка изменения ролей пользователя:${res.data.message}`);
            }
        }).catch((e)=>console.log(e));
    };

    const deleteUser = () => {
        if(!props.projectId || !props.serverUrl || !selectedUser) return;
        axios.post(
            `${props.serverUrl}/user/dettach`,
            {
                projectId: props.projectId,
                userLogin: selectedUser,
            }).then((res)=>{
                const status = res.data?.status;
                if(status) {
                    setProjectUsers(projectUsers.filter((user)=>user!==selectedUser));
                    selectUser(undefined);
                } else {
                    throw new Error(`Ошибка удаления пользователя с проекта:${res.data.message}`);
                }
            }).catch((e)=>console.log(e));
    };

    //Updating Users onLoad:
    useEffect(()=>{
        getProjectUsers();
    },[]);

    //Update roles on user choose
    useEffect(()=>{
        getUserRoles();
    },[selectedUser]);

    return (
        <div className="container">
            {isAdding ? <AddUser projectId={props.projectId} serverUrl={props.serverUrl} setIsAdding={setIsAdding} /> :
                <div>
                    <div className="row">
                        <div className="col-auto">
                            <h2>Управление пользователями проекта</h2>
                        </div>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={()=>setIsAdding(true)}
                            >
                                Добавить пользователя
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="card" id="selectedUser">
                                <div className="card-body">
                                    {
                                        projectUsers.map((user)=>
                                            <div className="form-check" key={user} onClick={()=>{selectUser(user)}}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="users"
                                                    id={user}
                                                    value={user}
                                                />
                                                <label className="form-check-label" htmlFor={user}>{user}</label>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card" id="roles">
                                <div className="card-body">
                                    {availableRoles.map((role)=>
                                        <div
                                            className="form-check"
                                            key={role}
                                            onClick={()=>{
                                                if(userRoles.includes(role)){
                                                    setUserRoles(userRoles.filter((item)=>role!==item))
                                                } else {
                                                    setUserRoles([...userRoles,role])
                                                }
                                            }}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={userRoles?.includes(role)}
                                                disabled={!selectedUser}
                                            />
                                            <label className="form-check-label" htmlFor="flexCheckDefault">{role}</label>
                                        </div>)
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card" id="controls">
                                <div className="card-body">
                                    <div className="container overflow-hidden">
                                        <div className="row gy-5">
                                            <div className="col-6">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    disabled={!selectedUser}
                                                    onClick={changeUserRoles}
                                                >
                                                    Сохранить изменения
                                                </button>
                                            </div>
                                            <div className="col-6">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    disabled={!selectedUser}
                                                    onClick={deleteUser}
                                                >
                                                    Удалить с проекта
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default ProjectUsers;