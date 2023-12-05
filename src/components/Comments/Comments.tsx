import React, {useEffect, useState} from "react";
import Comment from "./Comment/Comment";
import CommentsHeader from "./CommentsHeader/CommentsHeader";
import getAuthorsRequest from "src/api/authors/getAuthorsRequest";
import {useQuery} from "react-query";
import {IAuthors, getAuthors} from "src/services/Authors";
import {getComments} from "src/services/Comments";
import getCommentsRequest from "src/api/comments/getCommentsRequest";
type Props = {};

const Comments: React.FC<Props> = ({}) => {
    const {data: authorsData} = useQuery({
        queryFn: getAuthors,
        queryKey: ["authors"],
    });

    const {data: commentsData} = useQuery({
        queryFn: () => getComments(1),
        queryKey: ["comments"],
    });

    const [totalComments, setTotalComments] = useState<number>(0);
    const [totalLikes, setTotalLikes] = useState<number>(0);
    const [authors, setAuthors] = useState<IAuthors>();
    const [comments, setComments] = useState<any>();

    useEffect(() => {
        if (!authorsData) return;
        setAuthors(authorsData);
    }, [authorsData]);

    useEffect(() => {
        if (!commentsData) return;
        setComments(commentsData);
    }, [commentsData]);

    return (
        <div>
            <CommentsHeader
                totalComments={totalComments}
                totalLikes={totalLikes}
            />
            {authors?.status !== 200 ? (
                <span>Что-то пошло не так</span>
            ) : (
                authors.data.map((author) => (
                    <div>
                        <span>{author.id}</span>
                        <span>{author.name}</span>
                    </div>
                ))
            )}
        </div>
    );
};
export default Comments;
