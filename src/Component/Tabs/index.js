import { Button } from '@material-ui/core';
import { EditOutlined, Help } from '@material-ui/icons';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import './style.scss';

function Tabs({ data, type, user }) {
    const history = useHistory();
    const [tabs, setTabs] = useState(data[0]);

    const clickTab = (e) => {
        setTabs(e.target.textContent)
    }

    const handleMovePage = () => {
        if (type !== "questions") {
            history.push('/push/newpost')
        } else {
            history.push('/push/newquestion');
        }
    }
    return (
        <div className="tabs">
            <img src="https://www.who.int/images/default-source/searo---images/emergencies/covid19/banner-covid.tmb-1920v.jpg?sfvrsn=3af79ead_1" alt="banner" className="tabs__banner" />
            <div className="main">
                <ul className="tabs__list">
                    {data.map((item, index) => (
                        <li onClick={clickTab} key={index} className={"tabs__item new " + (item === tabs ? "active" : "")}>{item}</li>
                    ))}

                </ul>
                {user && (
                    <Button onClick={handleMovePage} className="button__newPost" variant="contained" color="primary" startIcon={
                        type === "questions" ? <Help /> : <EditOutlined />}
                    >{type === "questions" ? "Đặt câu hỏi" : "Bài viết"}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Tabs
