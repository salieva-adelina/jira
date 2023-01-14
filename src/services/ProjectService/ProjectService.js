import axios from "axios"
import { ACCESS_TOKEN, commonHeaders, SERVER_API_URL } from "../../util/config/constants"
const id_token = localStorage.getItem(ACCESS_TOKEN);

export const projectService = {
    createProject: (newProject) => { },

    getAllProjects: (userLogin) => {
        return axios({
            url: `${SERVER_API_URL}/projects`,
            method: 'POST',
            data: JSON.stringify({ userLogin: userLogin }),
            headers: commonHeaders
        })
    },
}