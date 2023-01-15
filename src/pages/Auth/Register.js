import React from 'react';
import { Button, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { REGISTER_SAGA } from '../../redux/constants/AuthConst';
import axios from 'axios';
import { commonHeaders, SERVER_API_URL } from '../../util/config/constants';
function Register(props) {

    const {
        errors,
        handleChange,
        handleSubmit,
        // values,
        // touched,
        // handleBlur,
    } = props;

    return (
        <form className="text-center p-5" style={{ maxWidth: 400, margin: 'auto', marginTop: 130 }} onSubmit={handleSubmit}>
            <div>
                <h3 style={{ fontWeight: 'bold', fontSize: 35 }}>УПиЗ</h3>
                <div className="d-flex mt-4" >
                    <Input style={{ width: '100%' }} name="username" type="username" size="large" placeholder="Имя пользователя" prefix={<UserOutlined />}
                        onChange={handleChange}
                    />
                </div>
                <div className="d-flex text-danger">{errors.username}</div>
                <div className="d-flex mt-3">
                    <Input style={{ width: '100%' }} name="password" type="password" size="large" placeholder="Пароль" prefix={<LockOutlined />}
                        onChange={handleChange}
                    />
                </div>
                <div className="d-flex text-danger">{errors.password}</div>
                <div className="d-flex mt-3">
                    <Input style={{ width: '100%' }} name="rePassword" type="password" size="large" placeholder="Пароль ещё раз" prefix={<LockOutlined />}
                        onChange={handleChange} />
                </div>
                <div className="d-flex text-danger">{errors.rePassword}</div>
                <Button htmlType="submit" size="large" style={{ width: '100%', backgroundColor: 'rgb(102,117,223)', color: '#fff', fontWeight: 'bold' }} className="mt-3">
                    Зарегистрироваться
                </Button>
                <div className="mt-3">Есть аккаунт? <NavLink to="/login" className="mt-3">Войти</NavLink></div>
            </div>
        </form>
    )
}

const RegisterWithFormik = withFormik({
    mapPropsToValues: () => ({
        username: '',
        password: '',
        rePassword: '',
    }),
    validationSchema: Yup.object().shape({
        username: Yup.string().required('Username is required!'),
        password: Yup.string().min(4, 'Your password must be at least 4 characters!'),
        rePassword: Yup.string().when("password", {
            is: val => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf(
                [Yup.ref("password")],
                "Password do not match!"
            )
        })
    }),

    handleSubmit: (values, { setSubmitting, props }) => {
        let { username, password } = values;
        setSubmitting(false);
        axios.post(
            `${SERVER_API_URL}/user/register`,
            JSON.stringify({
                login: username,
                password: password,
            }),
            commonHeaders
        ).then(res=>{
            if(res.data.status){
                props.history.push('/login');
            }
        }).catch((e) => console.log(e))
    },

    displayName: 'Jira Bugs Register',
})(Register);

export default connect()(RegisterWithFormik);