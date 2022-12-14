import React, { useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { GET_ALL_PROJECT_CATEGORY_SAGA } from '../../../redux/constants/ProjectCategoryConst';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { CREATE_PROJECT_SAGA, DUPPLICATE_PROJECT_NAME } from '../../../redux/constants/ProjectConst';
import Swal from 'sweetalert2'

function ProjectSetting(props) {

    const {
        // errors,
        handleChange,
        handleSubmit,
        setFieldValue,
        // values,
        // touched,
        // handleBlur,
    } = props;

    const { projectCategories } = useSelector(state => state.ProjectCategoryReducer);

    const dispatch = useDispatch();

    const renderProjectCategories = () => {
        return projectCategories.map((projectCategory, index) => {
            return <option key={index} value={projectCategory.id}>{projectCategory.name}</option>
        });
    };

    useEffect(() => {
        dispatch({
            type: GET_ALL_PROJECT_CATEGORY_SAGA,
        });
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
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input className="form-control" name="name" placeholder="ReactJS Jira Clone" required="required" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">URL</label>
                    <input className="form-control" name="url" placeholder="https://github.com/quanghavan29/jira_bugs_clone_reactjs_nestjs" required="required" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-control" name="projectCategoryId" onChange={handleChange}>
                        {renderProjectCategories()}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <Editor
                        name="description"
                        initialValue="<p>A Jira clone app built with ReactJS and NestJS - by quanghavan29.</p>"
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
                    Save
                </button>
                <button type="button" className="btn btn-secondary ml-3"
                    onClick={() => {
                        props.history.goBack();
                    }}>
                    Cancel
                </button>
            </div>
        </form>
    )
}

const CreateProjectWithFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        return {
            name: '',
            url: '',
            description: '<p>A Jira clone app built with ReactJS and NestJS - by quanghavan29.</p>',
            projectCategoryId: props.projectCategories[0]?.id,
        }
    },
    // validationSchema: Yup.object().shape({
    // }),

    handleSubmit: (values, { setSubmitting, props }) => {
        setSubmitting(true);
        props.dispatch({
            type: CREATE_PROJECT_SAGA,
            newProject: {
                ...values,
                projectCategory: {
                    id: values.projectCategoryId,
                }
            }
        });
    },

    displayName: 'Jira Bugs Create Project',
})(ProjectSetting);

const mapStateToProps = (state) => {
    return {
        projectCategories: state.ProjectCategoryReducer.projectCategories,
        dupplicateProjectName: state.ProjectReducer.dupplicateProjectName,
        message: state.ProjectReducer.message,
    }
}

export default connect(mapStateToProps)(CreateProjectWithFormik);