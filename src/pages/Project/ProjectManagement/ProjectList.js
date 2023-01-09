import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Space, Tag, Avatar, Popconfirm, Popover, AutoComplete } from 'antd';
import { NavLink } from 'react-router-dom';
import { FormOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_MEMBER_TO_PROJECT_SAGA, DELETE_MEMBER_FROM_PROJECT_SAGA, DELETE_PORJECT_SAGA, GET_ALL_PROJECTS_SAGA, GET_PROJECT_DETAIL_SAGA } from '../../../redux/constants/ProjectConst';
import { SEARCH_USER_SAGA } from '../../../redux/constants/UserConst';
import dateFormat, { masks } from "dateformat";

export default function ProjectList(props) {

    const projects = useSelector(state => state.ProjectReducer.projects);
    const usersSearched = useSelector(state => state.UserReducer.usersSearched);
    const [usernameSearch, setUsernameSearch] = useState('');

    let dataConvert = projects.map((item, index) => {
        return {
            ...item,
            projectCategoryName: item.projectCategory.name,
            createdDate: dateFormat(new Date(item.createdDate), "mmm d, yyyy"),
        }
    })

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: GET_ALL_PROJECTS_SAGA,
        })
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

    // const text = <span>Title</span>;
    const content = (record, index) => {
        // console.log('record: ', record);
        return (
            <div>
                <AutoComplete
                    value={usernameSearch}
                    onChange={(value) => {
                        setUsernameSearch(value);
                    }}
                    options={
                        // usersSearched?.map((user, index) => {
                        //     return { label: user.login, value: user.id, key: index }
                        // })

                        usersSearched?.filter(user => {
                            let index = record.members.findIndex(member => member.id === user.id);
                            if (index !== -1) {
                                return false;
                            }
                            return true;
                        }).map((user, index) => {
                            return { label: user.login, value: user.id, key: index }
                        })
                    }
                    style={{ width: '100%' }}
                    onSelect={(value, option) => {
                        setUsernameSearch(option.label);
                        dispatch({
                            type: ADD_MEMBER_TO_PROJECT_SAGA,
                            project: { ...record, members: [...record.members, { id: value }] },
                        })
                    }}
                    onSearch={(value) => {
                        if (searchRef.current) {
                            clearTimeout(searchRef.current);
                        }
                        searchRef.current = setTimeout(() => {
                            dispatch({
                                type: SEARCH_USER_SAGA,
                                username: value,
                            })
                        }, 300)
                    }}
                    placeholder="Username"
                />
            </div>
        )
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
            dataIndex: 'url',
            key: 'url',
            sorter: (a, b) => a.url.length - b.url.length,
            sortOrder: sortedInfo.columnKey === 'url' && sortedInfo.order,
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
                <Space>
                    <NavLink to="/project-management/settings">
                        <button className="btn btn-success btn-sm" type="button">
                            <i className="fa fa-plus"></i>
                            <span style={{ marginLeft: 4 }}>Создать новый проект</span>
                        </button>
                    </NavLink>
                </Space>
            </div>
            <Table columns={columns} rowKey={"id"} dataSource={dataConvert} onChange={handleChange} />
        </div>
    )
}
