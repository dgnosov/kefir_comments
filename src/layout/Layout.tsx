import React from "react";
import Comments from "src/components/Comments/Comments";
import styles from "./Layout.module.scss";
type Props = {};

const Layout: React.FC<Props> = ({}) => {
    return (
        <div className={styles.layout}>
            <Comments />
        </div>
    );
};
export default Layout;
