import React, {useEffect, useState} from "react";
import Comment from "./Comment/Comment";
import CommentsHeader from "./CommentsHeader/CommentsHeader";
import getAuthorsRequest from "src/api/authors/getAuthorsRequest";
import {useQuery} from "react-query";
import {IAuthors, getAuthors} from "src/services/Authors";
type Props = {};

const Comments: React.FC<Props> = ({}) => {
    const {data: authorsData} = useQuery({
        queryFn: getAuthors,
        queryKey: ["authors"],
    });

    const [totalComments, setTotalComments] = useState<number>(0);
    const [totalLikes, setTotalLikes] = useState<number>(0);
    const [authors, setAuthors] = useState<IAuthors>();

    useEffect(() => {
        if (!authorsData) return;
        setAuthors(authorsData);
    }, [authorsData]);

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
