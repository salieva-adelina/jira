import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import { SERVER_API_URL, commonHeaders } from "../../util/config/constants"

/**
 * Страница встроена в ProjectUsers. Добавлять никуда больше не требуется.
 * */

const AddUser = (props) => {

    const [nonProjectUsers, setUsers] = useState([]);

    const userRef = useRef();

    const getAllUsers = () => {
        axios.post(`${SERVER_API_URL}/users`)
            .then((res) => {
                const users = res.data?.users ?? [];
                setUsers(
                    users.filter((user) =>
                        !props.projectUsers?.includes(user)
                    )
                )
            }).catch((e) => console.log(e));
        //setUsers(["User1", "User2"]);
    };

    const addUser = () => {
        const user = userRef.current.value;
        if (!user) return;

        axios.post(
            `${SERVER_API_URL}/user/attach`,
            JSON.stringify({
                projectId: Number(props.projectId),
                userLogin: user,
            }),
            commonHeaders
        ).then((res) => {
            const status = res.data?.status ?? [];
            if (status) {
                setUsers(nonProjectUsers.filter((item) => item !== user));
            } else {
                throw new Error(`Ошибка добавления пользователя на проект:${res.data.message}`);
            }
        }).catch((e) => console.log(e));
        //setUsers(["User1", "User2"]);
    };

    //Updating Users onLoad:
    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="row">
            <div className="col-sm-5">
                <h4>Добавление пользователя</h4>
                <div className="card">
                    <div className="card-body">
                        <label htmlFor="user" className="form-label">
                            Выберите пользователя из списка
                        </label>
                        <select className="form-select" ref={userRef} aria-label="Adding user to project" name="user">
                            {nonProjectUsers.map((user) =>
                                <option value={user} key={user}>{user}</option>
                            )}
                        </select>
                    </div>
                    <div className="card-footer">
                        <div className="row">
                            <div className="col d-flex align-items-center justify-content-center">
                                <a className="btn btn-outline-danger" onClick={() => props.setIsAdding(false)}>Вернуться</a>
                            </div>
                            <div className="col d-flex align-items-center justify-content-center">
                                <a className="btn btn-outline-success" onClick={addUser}>Добавить</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUser;