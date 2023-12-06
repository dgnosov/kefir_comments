import React from "react";
import styles from "./Comment.module.scss";
import Comment from "./Comment";

type Props = {
    name: string;
    isChild?: boolean;
};

const renderComments = (array: any, isChild?: boolean) => {
    return array.map((comment: any, index: any) => (
        <>
            <Comment isChild={isChild} comment={comment} index={index} />
            {comment?.replies.length
                ? renderComments(comment.replies, true)
                : null}
        </>
    ));
};

export default renderComments;
