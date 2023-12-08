import React from "react";
import styles from "./ErrorScreen.module.scss";
import {ReactComponent as ErrorIcon} from "../../assets/icons/error.svg";
type Props = {
    msg: string;
};

const ErrorScreen: React.FC<Props> = ({}) => {
    return (
        <div className={styles.errorScreen}>
            <div className={styles.errorScreen__text}>
                <span>Ошибка при загрузке данных...</span>
            </div>
            <div className={styles.errorScreen__icon}>
                <ErrorIcon />
            </div>
        </div>
    );
};
export default ErrorScreen;
