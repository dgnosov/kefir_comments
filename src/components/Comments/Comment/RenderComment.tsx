import styles from "./Comment.module.scss";
import Comment from "./Comment";
import {IComment} from "src/services/Comments";

const renderComments = (array: IComment[], isChild?: boolean) => {
    return array.map((comment: IComment, index: number) => (
        <div key={comment.id} className={styles.comments__wrapper}>
            <Comment isChild={isChild} comment={comment} index={index} />
            {comment?.replies.length
                ? renderComments(comment.replies, true)
                : null}
        </div>
    ));
};

export default renderComments;
