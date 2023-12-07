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

    const [page, setPage] = useState<number>(1);

    const {
        data: commentsData,
        refetch,
        isLoading,
    } = useQuery({
        queryFn: () => getComments(page),
        queryKey: ["comments"],
        onSuccess: (success) =>
            setSuccessComments(
                ![ErrorMessage.error, ErrorMessage._404].includes(success),
            ),
    });

    const [successComments, setSuccessComments] = useState<boolean>();
    const [successAuthor, setSuccessAuthor] = useState<boolean>();
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<boolean>();
    const [dataloader, setDataLoader] = useState(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalComments, setTotalComments] = useState<number>(0);
    const [totalLikes, setTotalLikes] = useState<number>(0);
    const [comments, setComments] = useState<any>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [formatedComments, setFormatedComments] = useState<any[]>([]);

    const loadMoreHandler = () => {
        setDataLoader(true);
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        if (
            typeof successComments === "undefined" ||
            typeof successAuthor === "undefined"
        )
            return;
        if (!successComments || !successAuthor) {
            setError(true);
            setDataLoader(false);
        } else {
            setError(false);
            setDataLoader(false);
        }
    }, [successComments, successAuthor]);

    useEffect(() => {
        if (!error) return;
        setPage((prev) => prev - 1);
    }, [error]);

    useEffect(() => {
        if (page === 1) return;
        refetch();
    }, [page]);

    useEffect(() => {
        if (!authorsData) return;
        setAuthors(authorsData.data);
    }, [authorsData]);

    useEffect(() => {
        if (!commentsData || !commentsData.pagination) return;

        setComments(commentsData.data);
        // Create state with total number of pages
        setTotalPages(commentsData.pagination.total_pages);
        setCurrentPage(commentsData.pagination.page);
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

    return (
        <div className={styles.comments}>
            <CommentsHeader
                totalComments={totalComments}
                totalLikes={totalLikes}
            />
            {renderComments(formatedComments)}
            {totalPages === currentPage ? (
                <span>Все сообщения загружены</span>
            ) : dataloader ? (
                <span>loading data...</span>
            ) : (
                <button onClick={() => loadMoreHandler()}>
                    {error ? "Ошибка" : "Загрузить еще"}
                </button>
            )}
        </div>
    );
};
export default Comments;
