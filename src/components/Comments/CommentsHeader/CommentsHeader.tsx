import React from "react";
import static_content from "src/settings/static_content";
type Props = {
    totalComments: number;
    totalLikes: number;
};

const CommentsHeader: React.FC<Props> = ({totalComments, totalLikes}) => {
    return (
        <div>
            <div>
                {totalComments} {static_content.comments_title_plural}
            </div>
            <div>
                <span>ICON</span>
                {totalLikes}
            </div>
        </div>
    );
};
export default CommentsHeader;
