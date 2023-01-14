import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { CREATE_PROJECT_SAGA, DUPPLICATE_PROJECT_NAME } from '../../../redux/constants/ProjectConst';
import Swal from 'sweetalert2'
import axios from "axios";
import { SERVER_API_URL } from "../../../util/config/constants";

function EditProject(props) {
    const projectId = props.match.params.id;
    const {
        // errors,
        handleChange,
        handleSubmit,
        setFieldValue,
        // values,
        // touched,
        // handleBlur,
    } = props;

    const dispatch = useDispatch();

    const [users, setUsers] = useState([]);

    const getAllUsers = () => {
        axios.post(
            `${SERVER_API_URL}/users`)
            .then((res) => {
                const users = res.data?.users ?? [];
                setUsers(users);
            }).catch((e) => console.log(e));
        //setUsers(["User1", "User2"]);
    };

    //Updating Users onLoad:
    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (props.dupplicateProjectName === 'true') {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: props.message,
            })
        }

        if (props.dupplicateProjectName === 'false') {
            Swal.fire({
                icon: 'success',
                title: 'SUCCESS',
                text: props.message,
            })
        }

        if (props.dupplicateProjectName !== '') {
            dispatch({
                type: DUPPLICATE_PROJECT_NAME,
                value: '',
                message: '',
            })
        }

    }, [props.dupplicateProjectName]);

    const handleEditorChange = (content, editor) => {
        setFieldValue('description', content);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ width: '60%' }} className="mt-4">
                <div className="mb-4">
                    <label className="form-label">Название</label>
                    <input className="form-control" name="name" placeholder="Название задачи" required="required" onChange={handleChange} />
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="isArchive"
                        name="isArchive"
                        aria-expanded="false"
                        aria-controls="isArchive"
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="isArchive">Архивный проект</label>
                </div>
                <br />
                <div className="mb-4">
                    <label htmlFor="manager" className="form-label">
                        Выбор руководителя проекта
                    </label>
                    <select
                        className="form-select"
                        aria-label="Adding user to project"
                        name="manager"
                        onChange={handleChange}
                    >
                        {users.map((user) =>
                            <option value={user} key={user}>{user}</option>
                        )}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="form-label">Описание</label>
                    <Editor
                        name="description"
                        initialValue=""
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                        onEditorChange={handleEditorChange}
                    />
                </div>
                <button className="btn btn-primary" type="submit" onSubmit={handleSubmit}>
                    Сохранить
                </button>
                <button type="button" className="btn btn-secondary ml-3"
                    onClick={() => {
                        props.history.goBack();
                    }}>
                    Закрыть
                </button>
            </div>
        </form>
    )
}

const CreateProjectWithFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        return {
            id: props.match?.params?.id,
            name: '',
            manager: '',
            description: '',
            isArchive: false,
        }
    },
    // validationSchema: Yup.object().shape({
    // }),

    handleSubmit: (values, { setSubmitting, props }) => {
        setSubmitting(false);
        axios.post(
            `${SERVER_API_URL}/projects/change`,
            JSON.stringify({
                ...values,
            })
        ).catch((e) => console.log(e));
    },

    displayName: 'УПиЗ',
})(EditProject);

const mapStateToProps = (state) => {
    return {
        dupplicateProjectName: state.ProjectReducer.dupplicateProjectName,
        message: state.ProjectReducer.message,
    }
}

export default connect(mapStateToProps)(CreateProjectWithFormik);