import React from "react";
import styles from "./CommentsHeader.module.scss";
import static_content from "src/settings/static_content";
type Props = {
    totalComments: number;
    totalLikes: number;
};

const CommentsHeader: React.FC<Props> = ({totalComments, totalLikes}) => {
    return (
        <div className={styles.commentsHeader}>
            <div className={styles.commentsHeader__total}>
                {totalComments} {static_content.comments_title_plural}
            </div>
            <div className={styles.commentsHeader__likes}>
                <span>ICON</span>
                {totalLikes}
            </div>
        </div>
    );
};
export default CommentsHeader;
