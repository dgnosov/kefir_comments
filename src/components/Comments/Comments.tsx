import React, {useEffect, useState} from "react";
import CommentsHeader from "./CommentsHeader/CommentsHeader";
import {useQuery} from "react-query";
import {IAuthors, getAuthors} from "src/services/Authors";
import {getComments} from "src/services/Comments";
import traverseTree from "src/lib/traverseTree";

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
        // Если не получим какие-либо данные, выходим
        if (!commentsData) return;

        const arrWithReplies = commentsData.data.map((item: any) => {
            return {
                ...item,
                replies: null,
            };
        });

        const formatedComments = traverseTree(arrWithReplies);

        setComments(formatedComments);
    }, [commentsData]);

    return (
        <div>
            <CommentsHeader
                totalComments={totalComments}
                totalLikes={totalLikes}
            />
        </div>
    );
};
export default Comments;
