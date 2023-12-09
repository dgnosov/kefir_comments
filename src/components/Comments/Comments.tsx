import React, {useEffect, useState} from "react";
import CommentsHeader from "./CommentsHeader/CommentsHeader";
import {useQuery} from "react-query";
import {IAuthor, getAuthors} from "src/services/Authors";
import {IComment, getComments} from "src/services/Comments";
import traverseTree from "src/lib/traverseTree";
import renderComments from "./Comment/RenderComment";
import styles from "./Comments.module.scss";
import {atom, useAtom} from "jotai";
import LoadMore from "src/ui/LoadMore/LoadMore";
import MainLoader from "src/ui/MainLoader/MainLoader";
import ErrorScreen from "src/ui/ErrorScreen/ErrorScreen";

// Here we will keep an id of liked comment
export const comment_id = atom(0);

type Props = {};

interface IErrorType {
    msg: string | null;
    queryTo: string | null;
}

const enum ErrorMessage {
    error = "Network Error",
    _404 = "Request failed with status code 404",
}

const Comments: React.FC<Props> = ({}) => {
    const [page, setPage] = useState<number>(1);
    const [successComments, setSuccessComments] = useState<boolean>();
    const [successAuthors, setSuccessAuthors] = useState<boolean>();
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<boolean>();
    const [errorType, setErrorType] = useState<IErrorType>();
    const [dataLoader, setDataLoader] = useState(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalComments, setTotalComments] = useState<number>(0);
    const [totalLikes, setTotalLikes] = useState<number>(0);
    const [comments, setComments] = useState<IComment[]>([]);
    const [authors, setAuthors] = useState<IAuthor[]>([]);
    const [formatedComments, setFormatedComments] = useState<IComment[]>([]);
    const [commentsRaw, setCommentsRaw] = useState<IComment[]>([]);
    const [commentId, setCommentId] = useAtom(comment_id);

    const {data: authorsData} = useQuery({
        queryFn: getAuthors,
        queryKey: ["authors"],
        onSuccess: (data) => (
            data ? setErrorType({msg: data, queryTo: "authors"}) : null,
            setSuccessAuthors(
                ![ErrorMessage.error, ErrorMessage._404].includes(data),
            )
        ),
    });

    const {
        data: commentsData,
        refetch,
        isLoading,
    } = useQuery({
        queryFn: () => getComments(page),
        queryKey: ["comments"],
        onSuccess: (data) => (
            data ? setErrorType({msg: data, queryTo: "comments"}) : null,
            setSuccessComments(
                ![ErrorMessage.error, ErrorMessage._404].includes(data),
            )
        ),
    });

    const loadMoreHandler = () => {
        setDataLoader(true);
        setPage((prev) => prev + 1);
    };

    // Handle errors
    useEffect(() => {
        if (
            typeof successComments === "undefined" ||
            typeof successAuthors === "undefined"
        )
            return;
        if (!successComments || !successAuthors) {
            setError(true);
            setDataLoader(false);
        } else {
            setError(false);
            setDataLoader(false);
        }
    }, [successComments, successAuthors]);

    // If we have an error on load, we need decrement 1 from page counter
    // to avoid pagination mistakes
    useEffect(() => {
        if (!error) return;
        setPage((prev) => prev - 1);
    }, [error]);

    // refetch data to upload new comments
    useEffect(() => {
        if (page === 1) return;
        refetch();
    }, [page]);

    // Upload author's data
    useEffect(() => {
        if (!authorsData) return;
        setAuthors(authorsData.data);
    }, [authorsData]);

    // Upload comments
    useEffect(() => {
        if (!commentsData || !commentsData.pagination) return;
        setComments(commentsData.data);
        // Create state with total number of pages and current page
        setTotalPages(commentsData.pagination.total_pages);
        setCurrentPage(commentsData.pagination.page);
    }, [commentsData]);

    // Here we need to create a new aray with author's names
    // and replies array.
    // After creating an array we need to sort it
    // TODO - ask about sort "mistake" or "not mistake"
    useEffect(() => {
        if (!comments || !authors) return;

        const commentsWithAuthorsRaw = comments.map((comment) => {
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

    // On click we will change flag liked true/ false
    // and increment or dicrement it
    // Also we need to clear comment Id, to click multiple times
    useEffect(() => {
        if (commentId === 0) return;

        const newState = commentsRaw?.map((comment) => {
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

    // When array is created we need to format it and add
    // replies array to each comment if it has.
    // Also we need update comments and likes counter
    // TODO - ask about whole comments and likes counter
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

    return errorType?.msg === ErrorMessage._404 ? (
        <ErrorScreen msg={errorType?.msg} />
    ) : (
        <>
            <MainLoader start={isLoading} />
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
