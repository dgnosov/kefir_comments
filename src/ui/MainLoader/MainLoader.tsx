import React, {useRef} from "react";
import {Transition} from "react-transition-group";
import styles from "./MainLoader.module.scss";
import Loader from "../Loader/Loader";

type Props = {
    start: boolean;
};

const duration = 2000;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
};

interface ITest {
    entering: {opacity: number};
    entered: {opacity: number};
    exiting: {opacity: number};
    exited: {opacity: number; display: string};
}

const transitionStyles: ITest = {
    entering: {opacity: 1},
    entered: {opacity: 1},
    exiting: {opacity: 0},
    exited: {opacity: 0, display: "none"},
};

const MainLoader: React.FC<Props> = ({start}) => {
    const nodeRef = useRef(null);
    return (
        <Transition nodeRef={nodeRef} in={start} timeout={duration}>
            {(state) => (
                <div
                    className={styles.mainLoader}
                    ref={nodeRef}
                    style={{
                        ...defaultStyle,
                        ...transitionStyles[state as keyof ITest],
                    }}
                >
                    <div className={styles.mainLoader__loader}>
                        <span>Загружаем...</span>
                        <Loader />
                    </div>
                </div>
            )}
        </Transition>
    );
};
export default MainLoader;
