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

const enum ErrorMessage {
    error = "Network Error",
    _404 = "Request failed with status code 404",
}

const Comments: React.FC<Props> = ({}) => {
    const {data: authorsData} = useQuery({
        queryFn: getAuthors,
        queryKey: ["authors"],
        onSuccess: (success) =>
            setSuccessAuthor(
                ![ErrorMessage.error, ErrorMessage._404].includes(success),
            ),
    });

    const {
        data: commentsData,
        refetch,
        isLoading,
        isSuccess,
    } = useQuery({
        queryFn: () => getComments(page),
        queryKey: ["comments"],
        onSuccess: (success) =>
            setSuccessComments(
                ![ErrorMessage.error, ErrorMessage._404].includes(success),
            ),
    });

    const [page, setPage] = useState<number>(1);
    const [successComments, setSuccessComments] = useState<boolean>();
    const [successAuthor, setSuccessAuthor] = useState<boolean>();
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalComments, setTotalComments] = useState<number>(0);
    const [totalLikes, setTotalLikes] = useState<number>(0);
    const [comments, setComments] = useState<any>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [formatedComments, setFormatedComments] = useState<any[]>([]);

    const loadMoreHandler = () => {
        refetch();
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        console.log(successComments);
    }, [successComments]);

    useEffect(() => {
        if (!authorsData) return;
        setAuthors(authorsData.data);
    }, [authorsData]);

    useEffect(() => {
        if (!commentsData || !commentsData.pagination) return;

        setComments(commentsData.data);
        // Create state with total number of pages
        setTotalPages(commentsData.pagination.total_pages);
    }, [commentsData]);

    useEffect(() => {
        if (!comments || !authors) return;
        // Описать
        const commentsWithReplies = comments.map((comment: any) => {
            const author = authors.find(
                (author) => author.id === comment.author,
            );
            return {
                ...comment,
                replies: null,
                author_name: author?.name,
                authro_icon: author?.avatar,
            };
        });

        const formatedCommentsTest = traverseTree(commentsWithReplies);
        setFormatedComments([...formatedComments, ...formatedCommentsTest]);
    }, [comments, authors]);

    if (isLoading) {
        return <span>LOADING</span>;
    }

    // if(!successAuthor || !successComments){
    //     return
    // }

    return (
        <div className={styles.comments}>
            {totalPages} {page}
            <CommentsHeader
                totalComments={totalComments}
                totalLikes={totalLikes}
            />
            {renderComments(formatedComments)}
            {totalPages === page ? (
                <span>Все сообщения загружены</span>
            ) : (
                <button onClick={() => loadMoreHandler()}>Загрузить еще</button>
            )}
        </div>
    );
};
export default Comments;
