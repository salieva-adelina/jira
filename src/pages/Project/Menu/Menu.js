import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ReactLogo from '../../../logo.svg';

export default function Menu(props) {
    const {project} = useSelector(state => state.ProjectReducer);

    return (
        <div className="menu">
            <div className="account">
                <div className="avatar">
                    <img src={ReactLogo} alt="logo_reactjs.jpg" style={{ width: '100%' }} />
                </div>
                <div className="account-info">
                    <p style={{ color: '#42526E', fontWeight: 'bold' }}>УПиЗ</p>
                    <p style={{ color: '#5E6C84' }}>Программный проект</p>
                </div>
            </div>
            <div className="control">
                {props.projectId ? <div>
                    <NavLink to={`/project/${props.projectId}`} style={{ color: '#172B4D' }} activeClassName="active font-weight-bold text-primary">
                        <div>
                            <i className="fa fa-credit-card" />
                            <span className="ml-2">Меню задач</span>
                        </div>
                    </NavLink>
                    <NavLink to={`/project/${props.projectId}/users`} style={{ color: '#172B4D' }} activeClassName="active font-weight-bold text-primary">
                        <div>
                            <i className="fa fa-cog" />
                            <span className="ml-2">Управление пользователями проекта</span>
                        </div>
                    </NavLink>
                    <NavLink to={`/project/${props.projectId}/settings`} style={{ color: '#172B4D' }} activeClassName="active font-weight-bold text-primary">
                        <div>
                            <i className="fa fa-cog" />
                            <span className="ml-2">Настройки проекта</span>
                        </div>
                    </NavLink>
                </div> :<div></div>
                }
                <NavLink to="/project-management" style={{ color: '#172B4D' }} activeClassName="active font-weight-bold text-primary">
                    <div>
                        <i className="fa fa-cog" />
                        <span className="ml-2">Меню проектов</span>
                    </div>
                </NavLink>
            </div >
            <div className="feature">
                <div className="mt-3">
                    <i className="fa fa-truck" />
                    <span className="ml-2">Releases</span>
                </div>
                <div className="mt-3">
                    <i className="fa fa-equals" />
                    <span className="ml-2">Проблемы и фильтры</span>
                </div>
                <div className="mt-3">
                    <i className="fa fa-paste" />
                    <span className="ml-2">Страницы</span>
                </div>
                <div className="mt-3">
                    <i className="fa fa-location-arrow" />
                    <span className="ml-2">Отчеты</span>
                </div>
                <div className="mt-3">
                    <i className="fa fa-box" />
                    <span className="ml-2">Компоненты</span>
                </div>
            </div>
        </div >
    )
}
