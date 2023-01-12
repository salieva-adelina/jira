import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Space, Tag, Avatar, Popconfirm, Popover, AutoComplete } from 'antd';
import { NavLink } from 'react-router-dom';
import { FormOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_MEMBER_TO_PROJECT_SAGA, DELETE_MEMBER_FROM_PROJECT_SAGA, DELETE_PORJECT_SAGA, GET_ALL_PROJECTS_SAGA, GET_PROJECT_DETAIL_SAGA } from '../../../redux/constants/ProjectConst';
import { SEARCH_USER_SAGA } from '../../../redux/constants/UserConst';
import dateFormat, { masks } from "dateformat";
import { getCookie } from '../../../util/libs/cookie';

export default function ProjectList(props) {
    const isRoot = getCookie('isRoot');
    const projectExample =[{
        id: "31231241",
        manager: "user1",
        name: 'Название1',
        description : 'Описание1',
        createdDate: '2020-02-02',
        isArchive: false
    },
    {
        id: "31231242",
        manager: "user2",
        name: 'Название2',
        description : 'Описание2',
        createdDate: '2020-02-03',
        isArchive: false
    }];
    let projects = projectExample;// useSelector(state => state.ProjectReducer.projects);
    const usersSearched = useSelector(state => state.UserReducer.usersSearched);
    const [usernameSearch, setUsernameSearch] = useState('');

    let dataConvert = projects.map((item, index) => {
        return {
            ...item,
            createdDate: dateFormat(new Date(item.createdDate), "mmm d, yyyy"),
        }
    })

    const dispatch = useDispatch();

    useEffect(() => {
        //dispatch({            type: GET_ALL_PROJECTS_SAGA,        })
        return () => {
        }
    }, [])

    const searchRef = useRef(null);

    const [state, setState] = useState({
        filteredInfo: null,
        sortedInfo: null,
    })

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    const clearFilters = () => {
        setState({ filteredInfo: null });
    };

    const clearAll = () => {
        setState({
            filteredInfo: null,
            sortedInfo: null,
        });
    };

    const setNameSort = () => {
        setState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'name',
            },
        });
    };

    let { sortedInfo, filteredInfo } = state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <NavLink to={`/project/${record.id}`} style={{ cursor: 'pointer' }}>{text}</NavLink>
            },
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Руководитель проекта',
            dataIndex: 'manager',
            key: 'manager',
            sorter: (a, b) => a.url.length - b.url.length,
            sortOrder: sortedInfo.columnKey === 'manager' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Признак архивации',
            dataIndex: 'isArchive',
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdDate',
            key: 'createdDate',
            sorter: (a, b) => a.createdDate.length - b.createdDate.length,
            sortOrder: sortedInfo.columnKey === 'createdDate' && sortedInfo.order,
            ellipsis: true,
        },
    ];

    const showModalViewProject = (id) => {
        dispatch({
            type: GET_PROJECT_DETAIL_SAGA,
            actionDispatch: 'VIEW_PROJECT',
            id,
        })
    };

    const showEditProjectDrawer = (id) => {
        dispatch({
            type: GET_PROJECT_DETAIL_SAGA,
            actionDispatch: 'EDIT_PROJECT',
            id,
        })
    };

    return (
        <div className="mt-5">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Space style={{ marginBottom: 16 }}>
                    <Button onClick={setNameSort}>Сортировать по названию</Button>
                    <Button onClick={clearFilters}>Очистить фильтры</Button>
                    <Button onClick={clearAll}>Очистить фильтры и сортировщики</Button>
                </Space>
                { isRoot ?
                <Space>
                    <NavLink to="/project-management/settings">
                        <button className="btn btn-success btn-sm" type="button">
                            <i className="fa fa-plus"></i>
                            <span style={{ marginLeft: 4 }}>Создать новый проект</span>
                        </button>
                    </NavLink>
                </Space>
                :<div></div>}
            </div>
            <Table columns={columns} rowKey={"id"} dataSource={dataConvert} onChange={handleChange} />
        </div>
    )

    
}
