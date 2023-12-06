import React, {useEffect, useState} from "react";
import CommentsHeader from "./CommentsHeader/CommentsHeader";
import {useQuery} from "react-query";
import {IAuthors, getAuthors} from "src/services/Authors";
import {IComment, IComments, getComments} from "src/services/Comments";
import traverseTree from "src/lib/traverseTree";
import recursive from "./Comment/RenderComment";
import RenderComments from "./Comment/RenderComment";
import renderComments from "./Comment/RenderComment";
import styles from "./Comments.module.scss";

type Props = {};

const Comments: React.FC<Props> = ({}) => {
    const {data: authorsData} = useQuery({
        queryFn: getAuthors,
        queryKey: ["authors"],
    });

    const {
        data: commentsData,
        refetch,
        isFetching,
    } = useQuery({
        queryFn: () => getComments(page),
        queryKey: ["comments"],
    });

    useEffect(() => {
        console.log("isFetching", isFetching);
    }, [isFetching]);

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalComments, setTotalComments] = useState<number>(0);
    const [totalLikes, setTotalLikes] = useState<number>(0);
    const [comments, setComments] = useState<any>([]);
    const [authors, setAuthors] = useState<any[]>([]);

    const loadMoreHandler = () => {
        refetch();
    };

    useEffect(() => {
        if (!authorsData) return;
        setAuthors(authorsData.data);
    }, [authorsData]);

    useEffect(() => {
        if (!commentsData) return;
        // Create state with total number of pages
        setTotalPages(commentsData.pagination.total_pages);

        // Описать
        const arrWithReplies = commentsData.data.map((comment) => {
            const author = authors.find(
                (author) => author.id === comment.author,
            );

            console.log("autrhor", author?.name);

            return {
                ...comment,
                replies: null,
                author_name: author?.name,
                authro_icon: author?.avatar,
            };
        });

        const formatedComments = traverseTree(arrWithReplies);
        setComments([...comments, ...formatedComments]);

        // After load comments we need to set +1 count page
        setPage((prev) => prev + 1);
    }, [commentsData]);

    return (
        <div className={styles.comments}>
            <CommentsHeader
                totalComments={totalComments}
                totalLikes={totalLikes}
            />
            {renderComments(comments)}

            {totalPages < page ? (
                <span>Все сообщения загружены</span>
            ) : (
                <button onClick={() => loadMoreHandler()}>Загрузить еще</button>
            )}
        </div>
    );
};
export default Comments;
