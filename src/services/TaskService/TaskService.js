import axios from "axios"
import { ACCESS_TOKEN, commonHeaders, SERVER_API_URL } from "../../util/config/constants"
const id_token = localStorage.getItem(ACCESS_TOKEN);

export const taskService = {
    createTask: (newTask) => {
        return axios({
            url: `${SERVER_API_URL}/task/create`,
            method: 'POST',
            data: { ...newTask},
            headers: commonHeaders
        })
    },

    updateTask: (taskUpdate) => {
        return axios({
            url: `${SERVER_API_URL}/task/update`,
            method: 'POST',
            data: taskUpdate,
            headers: commonHeaders
        })
    },
}