import axios from "axios"
import { ACCESS_TOKEN, SERVER_API_URL } from "../../util/config/constants"
const id_token = localStorage.getItem(ACCESS_TOKEN);

export const taskService = {
    createTask: (newTask) => {
        return axios({
            url: `${SERVER_API_URL}/task/create`,
            method: 'POST',
            data: { ...newTask},
            headers: { 'authorization': 'Bearer ' + id_token }
        })
    },

    updateTask: (taskUpdate) => {
        return axios({
            url: `${SERVER_API_URL}/task/update`,
            method: 'POST',
            data: taskUpdate,
            headers: { 'authorization': 'Bearer ' + id_token }
        })
    },
}