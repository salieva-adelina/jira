import { Avatar } from 'antd';
import { NavLink } from 'react-router-dom';
import React, { useEffect } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { GET_PROJECT_BOARD_SAGA } from '../../../redux/constants/ProjectConst';
import { GET_ALL_TASKS_BY_PROJECT_SAGA, GET_TASK_DETAIL_SAGA, UPDATE_TASK_SAGA, UPDATE_TASK_STATUS_SAGA } from '../../../redux/constants/TaskConst';


export default function Board(props) {
    const tasksExample = [
            {
                'id': 31231241,
                'author': 'user1',
                'asignee': 'user2',
                'name': 'Название задачи',
                'status' : 'Новая задача'
            },
            {
                'id': 123123,
                'author': 'user3',
                'asignee': 'user4',
                'name': 'Название задачи 2',
                'status' : 'Ожидает тестирования'
            }
        ];
    const projectId = props.match.params.id; 
    let { project } = useSelector(state => state.ProjectReducer);
    const tasks = tasksExample;//useSelector(state => state.TaskReducer.tasks);
    const taksList = [
        {
            status: 'Новая задача',
            items: tasks.filter((item)=>item.status==='Новая задача'),
        },
        {
            status: 'Задача назначена',
            items: tasks.filter((item)=>item.status==='Задача назначена'),
        },
        {
            status: 'Задача в работе',
            items: tasks.filter((item)=>item.status==='Задача в работе'),
        },
        {
            status: 'Ожидает тестирования',
            items: tasks.filter((item)=>item.status==='Ожидает тестирования'),
        },
        {
            status: 'Задача на тестировании',
            items: tasks.filter((item)=>item.status==='Задача на тестировании'),
        },
        {
            status: 'Задача нуждается в исправлении',
            items: tasks.filter((item)=>item.status==='Задача нуждается в исправлении'),
        },
        {
            status: 'Задача отклонена',
            items: tasks.filter((item)=>item.status==='Задача отклонена'),
        },
        {
            status: 'Задача выполнена',
            items: tasks.filter((item)=>item.status==='Задача выполнена'),
        }
    ]

    const dispatch = useDispatch();

    useEffect(() => {
        //dispatch({type: GET_PROJECT_BOARD_SAGA,id,});
        //dispatch({type: GET_ALL_TASKS_BY_PROJECT_SAGA,projectId: id,})
    }, [])

    // const renderUsersAssign = (usersAssign) => {
    //     return usersAssign.map((user, index) => {
    //         return 
    //     })

    // }

    

    // const renderAllTaskByStatus = (task) => {
    //     return (
    //         <div className="card" style={{ width: '17rem', height: 'auto', paddingBottom: 10 }}>
    //             <div className="card-header">
    //                 {task.status} <span>{task.items.length}</span>
    //             </div>
    //             <ul className="list-group list-group-flush">
    //                 {renderAllTask(task.items)}
    //             </ul>
    //         </div>
    //     )
    // }

    const handleDragEnd = (result) => {
        let {source, destination, draggableId} = result;

        if (!result.destination) {
            return ;
        }
        if(source.index === destination.index && source.droppableId === destination.droppableId) {
            return ;
        }
        
        // let taskIdUpdate = draggableId;
        // let statusUpdate = destination.droppableId;

        let taskUpdate = {
            id: Number(draggableId),
            status: destination.droppableId,
        }

        console.log(taskUpdate);

        dispatch({
            type: UPDATE_TASK_STATUS_SAGA,
            taskUpdate,
        })          
    }
   

    const renderCardTaskList = () => {
        return <DragDropContext onDragEnd={handleDragEnd}>

            {
                taksList?.map((taskListDetail, index) => {
                    return <Droppable droppableId={taskListDetail.status} key={index}>
                        {(provided) => {
                            return (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    key={index}
                                    className="card"
                                    style={{ width: '17rem', height: 'auto', paddingBottom: 10 }}>
                                    <div className="card-header">
                                        {taskListDetail.status} <span>{taskListDetail.items.length}</span>
                                    </div>
                                    <ul
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        key={index}
                                        className="list-group list-group-flush">
                                        {
                                            taskListDetail.items.map((task, index) => {
                                                return <Draggable key={task.id.toString()} index={index} draggableId={task.id.toString()}>
                                                    {(provided) => {
                                                        return (
                                                            <li
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="list-group-item"
                                                                data-toggle="modal"
                                                                data-target="#infoModal"
                                                                onClick={() => {
                                                                    dispatch({
                                                                        type: GET_TASK_DETAIL_SAGA,
                                                                        taskId: task.id,
                                                                    })
                                                                }}>
                                                                <a href={`${projectId}/task/${task.id}`}>
                                                                    {task.name}
                                                                </a>
                                                                <div className="block" style={{ display: 'flex' }}>
                                                                  
                                                                </div>
                                                            </li>
                                                        )
                                                    }}
                                                </Draggable>
                                            })
                                        }
                                    </ul>

                                    {provided.placeholder}
                                </div>
                            )
                        }}
                    </Droppable>
                })
            }
        </DragDropContext>
    }

    return (
        <div>
            <div className='button_link' style={{ display: 'flex', justifyContent: 'end'}}>
              <NavLink to={`${projectId}/task/create`}>
                 <button className="btn btn-success btn-sm" type="button">
                 <i className="fa fa-plus"> Создать задачу</i>
                 </button>
               </NavLink>   
             </div>
                   
            {/* <Infor />
            <Content /> */}
            

            <div className="content" style={{ display: 'flex' }}>
                {renderCardTaskList()}
            </div>
                    
                
        </div>

      
    )
 
    
}
