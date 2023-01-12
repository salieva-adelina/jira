import React from 'react';
import { Input } from 'antd';
import { useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';

export default function ViewProject(props) {

    const { project } = useSelector(state => state.ProjectDetailReducer);

    return (
        <form>
            <div>
                <div className="mb-3">
                    <label className="form-label">Название</label>
                    <Input className="form-control" name="name" value={project.name} readOnly="readOnly" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Руководитель проекта</label>
                    <select className="form-control" name="projectCategoryId" readOnly="readOnly">
                        <option>{project.projectCategory.name}</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Дата создания</label>
                    <Input className="form-control" name="name" value={project.createdDate} readOnly="readOnly" />
                </div>
            </div>
        </form>
    )
}
