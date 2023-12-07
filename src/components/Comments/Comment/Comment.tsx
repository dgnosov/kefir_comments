import {IComment} from "src/services/Comments";
import styles from "./Comment.module.scss";
import {subtractHours} from "src/lib/date";
import moment from "moment";
import {useAtom} from "jotai";
import {comment_id} from "../Comments";

type Props = {
    comment: IComment;
    isChild?: boolean;
    index: number;
};

const enum LimitHours {
    limitHours = 4,
}

const Comment: React.FC<Props> = ({comment, isChild, index}) => {
    const [commentId, setCommentId] = useAtom(comment_id);

    const time_created = subtractHours(
        new Date(),
        new Date(comment.created).getHours(),
    ).getHours();

    const created_date = moment(comment.created).format("DD.MM.YYYY, hh:mm:ss");

    const onLike = (comment_id: number) => setCommentId(comment_id);

    return (
        <div className={styles.comment} style={{marginLeft: isChild ? 40 : 0}}>
            <div className={styles.comment__icon}>
                <img src={comment.authro_icon} alt={comment.author_name} />
            </div>
            <div className={styles.comment__container}>
                <div className={styles.comment__block}>
                    <div className={styles.comment__block_info}>
                        <div className={styles.comment__block_info_nickname}>
                            {comment.author_name}
                        </div>
                        <div className={styles.comment__block_info_created}>
                            <p>
                                {time_created > LimitHours.limitHours
                                    ? created_date
                                    : time_created}
                            </p>
                        </div>
                    </div>
                    <div className={styles.comment__block_likes}>
                        <div
                            className={styles.comment__block_likes_icon}
                            onClick={() => onLike(comment.id)}
                        >
                            Likes
                        </div>
                        <div className={styles.comment__block_likes_number}>
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
