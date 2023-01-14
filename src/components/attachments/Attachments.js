import React from 'react'
import Attachment from "./Attachment";

export default function Attachments(props) {
    const updateAttachments = (link) => {
        props.setAttachments(
            props.attachments
                .filter((item) => item.link !== link)
        );
    };
    return (
        <div className="col-xl">
            <label>Прикреплённые файлы</label>
            <ol className="list-group list-group-numbered">
                {props.attachments?.map((file) =>
                    <Attachment link={file.link} name={file.name} updateAttachments={updateAttachments} />
                )}
            </ol>
        </div>
    )
}


