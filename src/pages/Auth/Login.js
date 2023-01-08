import React from 'react';
import { Button, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { loginAction } from '../../redux/actions/AuthAction/LoginAction';


function Login(props) {

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
                    <Input style={{ width: '100%' }} name="username" size="large" placeholder="Имя пользователя" prefix={<UserOutlined />}
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
                <div className="mt-3">
                    <a href="forgot-password">Забыли пароль?</a>
                </div>
                <Button htmlType="submit" size="large" style={{ width: '100%', backgroundColor: 'rgb(102,117,223)', color: '#fff', fontWeight: 'bold' }} className="mt-3">
                    Войти
                </Button>
                <div className="mt-3">Создать аккаунт? <NavLink to="register" className="mt-3">Зарегистрироваться</NavLink></div>
            </div>
        </form>
    )
}

const LoginWithFormik = withFormik({
    mapPropsToValues: () => ({
        username: '',
        password: '',
    }),
    validationSchema: Yup.object().shape({
        username: Yup.string().required('Имя пользователя обязательно!'),
        password: Yup.string().min(4, 'Пароль должен состоять не менее чем из 4 символов!'),
    }),

    handleSubmit: (values, { setSubmitting, props }) => {
        let { username, password } = values;
        setSubmitting(true);
        props.dispatch(loginAction(username, password));
    },

    displayName: 'УПиЗ',
})(Login);

export default connect()(LoginWithFormik);
