import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import AddUser from "./AddUser";
import { SERVER_API_URL, commonHeaders } from "../../util/config/constants"

const availableRoles = ['Тестировщик', "Руководитель тестирования"];

const ProjectUsers = (props) => {
    const projectId = Number(props.match.params.id);
    const [projectUsers, setProjectUsers] = useState([]);
    const [selectedUser, selectUser] = useState(undefined);
    const [userRoles, setUserRoles] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    const getProjectUsers = () => {
        if (!projectId) return;

        axios.post(
            `${SERVER_API_URL}/projects/users`,
            JSON.stringify({ projectId: projectId }),
            commonHeaders
        ).then((res) => {
            const users = res.data?.users ?? [];
            setProjectUsers(users);
        }).catch((e) => console.log(e));
        //setProjectUsers(["User1", "User2"])
    };

    const getUserRoles = () => {
        if (!projectId || !selectedUser) return;
        axios.post(
            `${SERVER_API_URL}/user/roles/get`,
            JSON.stringify({
                projectId: projectId,
                userLogin: selectedUser,
            }),
            commonHeaders
        ).then((res) => {
            const roles = res.data?.roles ?? [];
            setUserRoles(roles);
        }).catch((e) => console.log(e));
        //setUserRoles(availableRoles);
    };

    const changeUserRoles = () => {
        if (!projectId || !selectedUser) return;
        axios.post(
            `${SERVER_API_URL}/user/roles/change`,
            JSON.stringify({
                projectId: projectId,
                userLogin: selectedUser,
                roles: userRoles ?? [],
            }),
            commonHeaders
        ).then((res) => {
            const status = res.data?.status;
            if (!status) {
                throw new Error(`Ошибка изменения ролей пользователя:${res.data?.message}`);
            }
        }).catch((e) => console.log(e));
    };

    const deleteUser = () => {
        if (!projectId || !selectedUser) return;
        axios.post(
            `${SERVER_API_URL}/user/detach`,
            JSON.stringify({
                projectId: projectId,
                userLogin: selectedUser,
            }),
            commonHeaders
        ).then((res) => {
            const status = res.data?.status;
            if (status) {
                setProjectUsers(projectUsers.filter((user) => user !== selectedUser));
                selectUser(undefined);
            } else {
                throw new Error(`Ошибка удаления пользователя с проекта:${res.data.message}`);
            }
        }).catch((e) => console.log(e));
    };

    //Updating Users onLoad:
    useEffect(() => {
        getProjectUsers();
    }, []);

    //Update roles on user choose
    useEffect(() => {
        getUserRoles();
    }, [selectedUser]);

    return (
        <div className="container">
            {isAdding ? <AddUser projectUsers={projectUsers} projectId={projectId} setIsAdding={setIsAdding} /> :
                <div>
                    <div className="row">
                        <div className="col-auto">
                            <h2>Управление пользователями проекта</h2>
                        </div>
                        <div className="col-auto">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => setIsAdding(true)}
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
                                        projectUsers.map((user) =>
                                            <div className="form-check" key={user} onClick={() => { selectUser(user) }}>
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
                                    {availableRoles.map((role) =>
                                        <div
                                            className="form-check"
                                            key={role}
                                            onClick={() => {
                                                if (userRoles.includes(role)) {
                                                    setUserRoles(userRoles.filter((item) => role !== item))
                                                } else {
                                                    setUserRoles([...userRoles, role])
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