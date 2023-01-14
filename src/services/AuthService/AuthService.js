import axios from "axios"
import { commonHeaders, SERVER_API_URL } from "../../util/config/constants"

export const authService = {
    login: (userLogin) => {
        const response = axios({
            url: `${SERVER_API_URL}/user/login`,
            method: 'POST',
            data: userLogin,
        })

        return response;
    },

    register: (userRegister) => {
        return axios.post(`${SERVER_API_URL}/user/register`,
            JSON.stringify(userRegister),
            commonHeaders
        )
    }
}