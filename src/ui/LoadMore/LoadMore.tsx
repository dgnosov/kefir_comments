import React from "react";
import Loader from "../Loader/Loader";
import styles from "./LoadMore.module.scss";

type Props = {
    totalPages: number;
    currentPage: number;
    dataLoader: boolean;
    error: boolean | undefined;
    loadMoreHandler: () => void;
};

const LoadMore: React.FC<Props> = ({
    totalPages,
    currentPage,
    dataLoader,
    error,
    loadMoreHandler,
}) => {
    return (
        <div className={styles.loadMore}>
            {totalPages === currentPage ? (
                <div className={styles.loadMore__all}>
                    <span>Все комментарии загружены.</span>
                </div>
            ) : dataLoader ? (
                <Loader />
            ) : (
                <button
                    className={[
                        styles.loadMore__button,
                        error ? styles.loadMore__button_error : "",
                    ].join(" ")}
                    onClick={() => loadMoreHandler()}
                >
                    <span>
                        {error ? "Что-то пошло не так..." : "Загрузить еще"}
                    </span>
                </button>
            )}
        </div>
    );
};
export default LoadMore;
