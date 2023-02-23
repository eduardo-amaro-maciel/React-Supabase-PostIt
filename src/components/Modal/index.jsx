import { useRef } from "react";

function Modal({ children, isVisible, fnSetVisible }) {
    const containerRef = useRef(0)

    function onClickModalWindow(event) {
        if (containerRef.current === event.target) {
            fnSetVisible(false)
        }
    }

    return (
        <div onClick={event => onClickModalWindow(event)} ref={containerRef}
            className={"fixed top-0 left-0 z-50 overflow-y-auto w-full h-[100vh] p-1 bg-[rgba(0,0,0,.6)] items-center justify-center " +
                (isVisible ? "flex" : "hidden")
            }
        >
            <div className="h-auto w-[520px] bg-white p-5 rounded-xl relative">
                <button className="absolute right-5" onClick={event => fnSetVisible(false)}>
                    <img src="/img/x.svg" alt="fechar modal" />
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal