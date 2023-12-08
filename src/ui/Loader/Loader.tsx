import React from "react";
import styles from "./Loader.module.scss";
type Props = {};

const Loader: React.FC<Props> = ({}) => {
    return (
        <div className={styles.loader}>
            <div className={styles.loader__loadingspinner}>
                <div className={styles.loader__loadingspinner_square1}></div>
                <div className={styles.loader__loadingspinner_square2}></div>
                <div className={styles.loader__loadingspinner_square3}></div>
                <div className={styles.loader__loadingspinner_square4}></div>
                <div className={styles.loader__loadingspinner_square5}></div>
            </div>
        </div>
    );
};
export default Loader;
