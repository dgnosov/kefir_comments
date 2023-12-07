import React from "react";
import styles from "./CommentsHeader.module.scss";
import {getNoun} from "src/lib/getNoun";
type Props = {
    totalComments: number;
    totalLikes: number;
};

const CommentsHeader: React.FC<Props> = ({totalComments, totalLikes}) => {
    return (
        <div className={styles.commentsHeader}>
            <div className={styles.commentsHeader__total}>
                {`${totalComments} `}
                {getNoun(
                    totalComments,
                    "Комментарий",
                    "Комментария",
                    "Комментариев",
                )}
            </div>
            <div className={styles.commentsHeader__likes}>
                <span>ICON</span>
                {totalLikes}
            </div>
        </div>
    );
};
export default CommentsHeader;
