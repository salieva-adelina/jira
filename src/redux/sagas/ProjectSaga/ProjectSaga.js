import { call, delay, put, takeLatest } from "redux-saga/effects";
import { projectService } from "../../../services/ProjectService/ProjectService";
import { STATUS_CODE } from "../../../util/config/constants";
import { ADD_MEMBER_TO_PROJECT_SAGA, CREATE_PROJECT_SAGA, DELETE_MEMBER_FROM_PROJECT_SAGA, DELETE_PORJECT_SAGA, DUPPLICATE_PROJECT_NAME, GET_ALL_PROJECTS_DISPATCH, GET_ALL_PROJECTS_SAGA, GET_LIST_MEMBERS_SAGA, GET_PROJECT_BOARD_SAGA, GET_PROJECT_DETAIL_SAGA, UPDATE_PORJECT_SAGA } from "../../constants/ProjectConst";
import { history } from "../../../util/libs/history";
import { DISPLAY_LOADING, HIDE_LOADING, LOADING_DELAY } from "../../constants/LoadingConst";
import { openNotification } from "../../../util/notification/notification";

function* createProjectSaga(action) {
    try {
        const { newProject } = action;
        const { data, status } = yield call(() => projectService.createProject(newProject));
        // check authorized (status = 401)
        // if (status === STATUS_CODE.UN_AUTHORIZED) {
        //     history.push('/login');
        // }

        // if project name already exist (status = 400)
        if (data.status === 400) {
            yield put({
                type: DUPPLICATE_PROJECT_NAME,
                value: 'true',
                message: 'Project name already exist!',
            });
        } else if (status === STATUS_CODE.CREATED) {
            yield put({
                type: DUPPLICATE_PROJECT_NAME,
                value: 'false',
                message: 'Create Project Successfully!',
            });
        }
    } catch (error) {
        console.log('Error Create Project Saga: ', error);
    }
}

function* getAllProjectsSaga(action) {
    yield put({
        type: DISPLAY_LOADING,
    });

    try {
        const { data, status } = yield call(() => projectService.getAllProjects());
        if (status === STATUS_CODE.SUCCESS) {
            yield put({
                type: GET_ALL_PROJECTS_DISPATCH,
                projects: data,
            })
        }
    } catch (error) {
        console.log('Error Get All Projects Saga: ', error)
    }

    yield delay(LOADING_DELAY);

    yield put({
        type: HIDE_LOADING,
    });
}

export function* projectEventListener() {
    yield takeLatest(CREATE_PROJECT_SAGA, createProjectSaga);
    yield takeLatest(GET_ALL_PROJECTS_SAGA, getAllProjectsSaga);
}
