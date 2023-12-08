import React from "react";
import styles from "./Comment.module.scss";
import Comment from "./Comment";

type Props = {
    name: string;
    isChild?: boolean;
};

const renderComments = (
    array: any,
    isChild?: boolean,
    handleLikeClick?: any,
) => {
    return array.map((comment: any, index: any) => (
        <div className={styles.comments__wrapper}>
            <Comment isChild={isChild} comment={comment} index={index} />
            {comment?.replies.length
                ? renderComments(comment.replies, true)
                : null}
        </div>
    ));
};

export default renderComments;
