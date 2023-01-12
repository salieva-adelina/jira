import React from 'react'
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import Header from '../../pages/Project/Header/Header';
import Menu from '../../pages/Project/Menu/Menu';
import SideBar from '../../pages/Project/SideBar/SideBar';
import { getCookie } from '../../util/libs/cookie';

export const JiraBugsTemplate = (props) => {
    const { Component, ...restParam } = props;
    const { project } = useSelector(state => state.ProjectReducer)
    const id = props.computedMatch.params.id;
    const isRoot = getCookie('isRoot') ?? false;
    return <Route path={restParam.path} render={(propsRoute) => {
        return <>
            <div className="jira">

                <SideBar />

                <Menu projectId={id} isRoot={isRoot} />

                <div className="main">

                    <Header title={restParam.title} />

                    <h4 style={{ color: '#172B4D', fontWeight: 'bold' }} className='mt-3'>
                        {restParam.title} {(restParam.title === 'Kanban Board') ? (` - ${project?.name}`) : ''}
                    </h4>
                    <span className="text-danger font-weight-bold">{(restParam.title === 'Kanban Board' && id === '33') ? '' : ''}</span>
                    <p className="mb-4 text-primary font-weight-bold">{(restParam.title === 'Kanban Board' && id === '33') ? '' : ''}</p>

                    <Component {...propsRoute} />

                </div>

            </div>
        </>
    }} />
}