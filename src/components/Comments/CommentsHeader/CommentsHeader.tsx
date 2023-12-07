import React from "react";
import styles from "./CommentsHeader.module.scss";
import {getNoun} from "src/lib/getNoun";
import {ReactComponent as LikeIcon} from "../../../assets/icons/like.svg";

type Props = {
    totalComments: number;
    totalLikes: number;
};

const CommentsHeader: React.FC<Props> = ({totalComments, totalLikes}) => {
    return (
        <div className={styles.commentsHeader}>
            <div className={styles.commentsHeader__total}>
                <span>
                    {`${totalComments} `}
                    {getNoun(
                        totalComments,
                        "комментарий",
                        "комментария",
                        "комментариев",
                    )}
                </span>
            </div>
            <div className={styles.commentsHeader__likes}>
                <LikeIcon />
                <span>{totalLikes}</span>
            </div>
        </div>
    );
};
export default CommentsHeader;
