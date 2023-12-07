import React from "react";
import Comments from "src/components/Comments/Comments";
import styles from "./Layout.module.scss";
type Props = {};

const Layout: React.FC<Props> = ({}) => {
    return (
        <main className={styles.layout}>
            <Comments />
        </main>
    );
};
export default Layout;
