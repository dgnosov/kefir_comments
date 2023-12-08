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
import {atom, useAtom} from "jotai";
import LoadMore from "src/ui/LoadMore/LoadMore";
import MainLoader from "src/ui/MainLoader/MainLoader";

// Here we will keep an id of liked comment
export const comment_id = atom(0);

type Props = {};

const enum ErrorMessage {
    error = "Network Error",
    _404 = "Request failed with status code 404",
}

const Comments: React.FC<Props> = ({}) => {
    const [page, setPage] = useState<number>(1);
    const [successComments, setSuccessComments] = useState<boolean>();
    const [successAuthor, setSuccessAuthor] = useState<boolean>();
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<boolean>();
    const [dataLoader, setDataLoader] = useState(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalComments, setTotalComments] = useState<number>(0);
    const [totalLikes, setTotalLikes] = useState<number>(0);
    const [comments, setComments] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [formatedComments, setFormatedComments] = useState<any[]>([]);
    const [commentId, setCommentId] = useAtom(comment_id);
    const [commentsRaw, setCommentsRaw] = useState<any[]>([]);

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
    } = useQuery({
        queryFn: () => getComments(page),
        queryKey: ["comments"],
        onSuccess: (success) =>
            setSuccessComments(
                ![ErrorMessage.error, ErrorMessage._404].includes(success),
            ),
    });

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

    // Описать
    useEffect(() => {
        if (!comments || !authors) return;

        const commentsWithAuthorsRaw = comments.map((comment: any) => {
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

        setCommentsRaw(
            [...commentsRaw, ...commentsWithAuthorsRaw].sort((a, b) =>
                new Date(a.created).toISOString() >
                new Date(b.created).toISOString()
                    ? -1
                    : 1,
            ),
        );
    }, [comments, authors]);

    useEffect(() => {
        if (!commentsRaw) return;
        const formatedCommentsWithReplies = traverseTree(commentsRaw);
        setFormatedComments(formatedCommentsWithReplies);

        const totalComments = commentsRaw.length;
        setTotalComments(totalComments);

        const totalLikes = commentsRaw
            .map((like) => like.likes)
            .reduce((acc, i) => acc + i, 0);

        setTotalLikes(totalLikes);
    }, [commentsRaw]);

    // Лайки - описать
    useEffect(() => {
        if (commentId === 0) return;

        const newState = commentsRaw?.map((comment: any) => {
            if (comment.id === commentId) {
                if (!comment.liked) {
                    return {
                        ...comment,
                        liked: true,
                        likes: comment.likes + 1,
                    };
                }
                return {
                    ...comment,
                    liked: false,
                    likes: comment.likes - 1,
                };
            }
            return comment;
        });

        setCommentId(0);
        setCommentsRaw(newState);
    }, [commentId]);

    // if (isLoading) {
    //     return <MainLoader start={isLoading} />;
    // }

    return (
        <>
            <MainLoader start={isLoading} />;
            <section className={styles.comments}>
                <CommentsHeader
                    totalComments={totalComments}
                    totalLikes={totalLikes}
                />
                <div className={styles.comments__block}>
                    {renderComments(formatedComments)}
                    <LoadMore
                        totalPages={totalPages}
                        currentPage={currentPage}
                        dataLoader={dataLoader}
                        error={error}
                        loadMoreHandler={loadMoreHandler}
                    />
                </div>
            </section>
        </>
    );
};
export default Comments;
