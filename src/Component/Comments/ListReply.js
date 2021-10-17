import { Avatar, Button } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import db from '../../Firebase';

function ListReply({ user, id, commentID, handleOpenFormReply, clickVote }) {
    const [listReply, setListReply] = useState([]);
    useEffect(() => {
        db.collection('posts').doc(id).collection('comments')
            .doc(commentID).collection('replys').orderBy('timestamp', 'asc').onSnapshot((snap) => (
                setListReply([...snap.docs.map((val) => ({ id: val.id, data: val.data() }))])
            ))
    }, [commentID, id])

    const handleOpenForm = (id, name) => {
        if (handleOpenFormReply) {
            handleOpenFormReply(id, name)
        }

    }

    const handleClickVote = (e, type, data, dataGen, replyId) => {
        if (clickVote) {
            clickVote(e, type, data, dataGen, replyId)
        }
    }

    const addActive = (data, uid, type) => {
        const index = data.findIndex((item) =>
            item.uid === uid)
        if (index !== -1) {
            if (data[index].type === type) {
                return "active";
            }
        }
    }
    return (
        <div className="listReply">
            {listReply.map((item) => (
                <div className="comment__item" key={item.id}>
                    <div className="item__info">
                        <div className="item__info--user">
                            <Avatar src={item.data.photoURL}>{item.data.displayName.charAt(0).toUpperCase()}</Avatar>
                            <h3>{item.data.displayName}</h3>
                        </div>
                        <div className="time">
                            <Moment format="ddd DD/MM/YYYY HH:mm A">{item?.data?.timestamp?.seconds * 1000}</Moment>
                        </div>
                    </div>
                    <div className="item__content">
                        {item.data.content}
                    </div>
                    <div className="item__button">
                        <div className="point">
                            <ArrowBackIos onClick={(e) => handleClickVote(e, "plus", item.data, commentID, item.id)} className={"plus " + addActive(item.data.check, user.uid, "plus")} />
                            <span>{item.data.point}</span>
                            <ArrowBackIos onClick={(e) => handleClickVote(e, "sub", item.data, commentID, item.id)} className={"sub " + addActive(item.data.check, user.uid, "sub")} />
                        </div>
                        <Tooltip placement="bottom" title="Trả lời">
                            <Button onClick={() => handleOpenForm(commentID, item.data.displayName)} className="button__reply">Trả lời</Button>
                        </Tooltip>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListReply
