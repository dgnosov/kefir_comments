import {IComment} from "src/services/Comments";
import styles from "./Comment.module.scss";
import {subtractHours} from "src/lib/date";
import moment from "moment";
import {useAtom} from "jotai";
import {comment_id} from "../Comments";
import {getNoun} from "src/lib/getNoun";
import {ReactComponent as LikeStroke} from "../../../assets/icons/like_stroke.svg";
import {ReactComponent as LikeFilled} from "../../../assets/icons/like_filled.svg";
import placeholder from "../../../assets/img/image_placeholder.jpg";

type Props = {
    comment: IComment;
    isChild?: boolean;
    index: number;
};

const limitHours = new Date().getHours() - new Date().getUTCHours();
const oneHour = 1;

const Comment: React.FC<Props> = ({comment, isChild}) => {
    const [_, setCommentId] = useAtom(comment_id);

    const time_created = subtractHours(
        new Date(),
        new Date(comment.created).getHours(),
    ).getHours();

    const created_date = moment(comment.created).format("DD.MM.YYYY, hh:mm:ss");

    const onLike = (comment_id: number) => setCommentId(comment_id);

    const formatTimePrefixes = () => {
        return time_created > limitHours
            ? created_date
            : time_created < oneHour
            ? "менее часа назад"
            : `${time_created} ${getNoun(
                  time_created,
                  "час",
                  "часа",
                  "часов",
              )} назад`;
    };

    return (
        <div
            className={[
                styles.comment,
                isChild ? styles.comment__offset : "",
            ].join(" ")}
        >
            <div className={styles.comment__icon}>
                <img
                    src={
                        !comment.authro_icon ? placeholder : comment.authro_icon
                    }
                    alt={comment.author_name}
                />
            </div>
            <div className={styles.comment__container}>
                <div className={styles.comment__block}>
                    <div className={styles.comment__block_info}>
                        <div className={styles.comment__block_info_nickname}>
                            <span>{comment.author_name}</span>
                        </div>
                        <div className={styles.comment__block_info_created}>
                            <span>{formatTimePrefixes()}</span>
                        </div>
                    </div>
                    <div className={styles.comment__block_likes}>
                        <div
                            className={styles.comment__block_likes_icon}
                            onClick={() => onLike(comment.id)}
                        >
                            {comment.liked ? <LikeFilled /> : <LikeStroke />}
                        </div>
                        <div className={styles.comment__block_likes_number}>
                            <span>{comment.likes}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.comment__text}>
                    <span>{comment.text}</span>
                </div>
            </div>
        </div>
    );
};

export default Comment;
