import {IComment} from "src/services/Comments";
import styles from "./Comment.module.scss";
import {subtractHours} from "src/lib/date";

type Props = {
    comment: IComment;
    isChild?: boolean;
    index: number;
};

const Comment: React.FC<Props> = ({comment, isChild, index}) => {
    const a = subtractHours(new Date(comment.created), 0);

    return (
        <div className={styles.comment} style={{marginLeft: isChild ? 40 : 0}}>
            <div className={styles.comment__icon}>
                <img src={comment.authro_icon} alt={comment.author_name} />
            </div>
            <div className={styles.comment__container}>
                <div className={styles.comment__block}>
                    <div className={styles.comment__block_info}>
                        <div className={styles.comment__info_nickname}>
                            {comment.author_name}
                        </div>
                        <div className={styles.comment__info_created}>
                            {comment.created}
                        </div>
                    </div>
                    <div className={styles.comment__block_likes}>
                        <div className={styles.comment__likes_icon}>Likes</div>
                        <div className={styles.comment__likes_number}>
                            {comment.likes}
                        </div>
                    </div>
                </div>
                <div className={styles.comment__test}>{comment.text}</div>
            </div>
        </div>
    );
};

export default Comment;
