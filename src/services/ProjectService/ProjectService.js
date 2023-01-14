import axios from "axios"
import { ACCESS_TOKEN, SERVER_API_URL } from "../../util/config/constants"
const id_token = localStorage.getItem(ACCESS_TOKEN);

export const projectService = {
    createProject: (newProject) => {
        return axios({
            url: `${SERVER_API_URL}/projects/create`,
            method: 'POST',
            data: { ...newProject },
            headers: { 'authorization': 'Bearer ' + id_token }
        })
    },

    getAllProjects: (userLogin) => {
        return axios({
            url: `${SERVER_API_URL}/projects`,
            method: 'POST',
            data: {userLogin: userLogin}, 
            headers: { 'authorization': 'Bearer ' + id_token }
        })
    },
}