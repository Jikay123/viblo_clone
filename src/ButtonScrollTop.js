import { ArrowUpward } from '@material-ui/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

function ButtonScrollTop() {

    const [show, setShow] = useState(false);
    useEffect(() => {
        const checkScroll = () => {
            window.addEventListener("scroll", () => {
                if (window.scrollY > 200) {
                    setShow(true);
                } else {
                    setShow(false);
                }
                return () => {
                    window.removeEventListener("scroll");
                }
            })
        }
        return () => checkScroll();
    }, [])
    return (
        <>
            {show && (<Button onClick={() => window.scrollTo(0, 0)} style={{
                position: "fixed", bottom: "10%", right: "2%",
                backgroundColor: "#3C74B8",
                zIndex: '10',
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", border: "none",
                width: "50px", height: "50px"
            }} ><ArrowUpward /></Button>)}
        </>
    )
}

export default ButtonScrollTop
