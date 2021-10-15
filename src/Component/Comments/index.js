import { ArrowBackIos } from '@material-ui/icons';
import { Button, Form, Tooltip } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import db from '../../Firebase';
import ListReply from './ListReply';
import './style.scss';

function Comments({ id, user, typeNews, contentId }) {
    const [value, setValue] = useState('');
    const [valueRep, setValueRep] = useState('');
    const [comments, setComments] = useState([]);
    const [open, setOpen] = useState('');
    const [peopleComment, setPeopleComment] = useState('');
    const [postValue, setPostValue] = useState('');
    const [checkUid, setCheckUid] = useState('');

    useEffect(() => {
        db.collection(typeNews).doc(id).collection('comments').orderBy('timestamp').onSnapshot((snap) => {
            setComments([
                ...snap.docs.map((item) => ({ id: item.id, data: item.data() }))
            ])
        });

        db.collection(typeNews).doc(id).onSnapshot((snap) => {

            if (snap.data()?.people) {
                setPeopleComment([
                    ...snap.data().people
                ]);
            }
            setPostValue([
                snap.data()
            ])
        })

    }, [id, typeNews])

    useEffect(() => {
        if (contentId === user.uid && contentId !== undefined) {
            setCheckUid(true);
        }

    }, [contentId, user])


    const handlePostComment = () => {

        db.collection(typeNews).doc(id).collection('comments').add({
            displayName: user.displayName,
            uid: user.uid,
            photoURL: user.photoURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            content: value,
            point: 0,
        })
        const index = peopleComment?.findIndex(item => item.uid === user.uid);
        if (index === -1) {
            db.collection(typeNews).doc(id).update({
                ...postValue,
                people: [...peopleComment,
                {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }]
            })
        }
        setValue('');
    }


    const handlePostReply = (commentID) => {
        db.collection(typeNews).doc(id).collection('comments').doc(commentID).collection('replys').add({
            displayName: user.displayName,
            uid: user.uid,
            photoURL: user.photoURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            content: valueRep,
            point: 0,
            check: [],
        })

        const index = peopleComment.findIndex(item => item.uid === user.uid);
        if (index === -1) {
            db.collection(typeNews).doc(id).update({
                ...postValue,
                people: [...peopleComment,
                {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }]
            })
        }
        setValueRep('');
        setOpen('')
    }
    const clickVote = (e, type, data, dataGen, replyId) => {
        e.stopPropagation();
        const elementClick = e.target;
        const plusElement = document.querySelector('.plus');
        const subElement = document.querySelector('.sub');

        if (elementClick === plusElement || elementClick === subElement) {
            return;
        }
        if (replyId) {
            if (type === 'plus') {
                subElement.querySelector('path').removeAttribute('class');
                const index = data.check.findIndex((item) => item.uid === user.uid)
                // return;
                if (index === -1) {
                    data.check.push({
                        uid: user.uid,
                        type: "plus",
                    });

                    db.collection(typeNews).doc(id).collection('comments').doc(dataGen).collection('replys').doc(replyId).update({
                        ...data,
                        point: data.point + 1,
                        check: data.check,
                    })
                } else {
                    if (data.check[index]?.type === 'plus') {
                        data.check.splice(index, 1);
                        db.collection(typeNews).doc(id).collection('comments').doc(dataGen).collection('replys').doc(replyId).update({
                            ...data,
                            point: data.point - 1,
                            check: data.check,
                        })
                    } else {
                        const newcheck = {
                            ...data.check[index],
                            type: "plus",
                        }
                        data.check.splice(index, 1, newcheck);
                        db.collection(typeNews).doc(id).collection('comments').doc(dataGen).collection('replys').doc(replyId).update({
                            ...data,
                            point: data.point + 2,
                            check: data.check,
                        })
                    }
                }


            } else {
                plusElement.querySelector('path').removeAttribute('class');

                // return;
                const index = data.check.findIndex((item) => item.uid === user.uid)
                if (index === -1) {
                    data.check.push({
                        uid: user.uid,
                        type: "sub",
                    });
                    db.collection(typeNews).doc(id).collection('comments').doc(dataGen).collection('replys').doc(replyId).update({
                        ...data,
                        point: data.point - 1,
                        check: data.check,
                    })
                } else {
                    if (data.check[index]?.type === 'sub') {
                        data.check.splice(index, 1);
                        db.collection(typeNews).doc(id).collection('comments').doc(dataGen).collection('replys').doc(replyId).update({
                            ...data,
                            point: data.point + 1,
                            check: data.check,
                        })
                    } else {
                        const newcheck = {
                            ...data.check[index],
                            type: "sub",
                        }
                        data.check.splice(index, 1, newcheck);
                        db.collection(typeNews).doc(id).collection('comments').doc(dataGen).collection('replys').doc(replyId).update({
                            ...data,
                            point: data.point - 2,
                            check: data.check,
                        })
                    }
                }
            }
        } else {
            if (type === 'plus') {
                subElement.querySelector('path').removeAttribute('class');
                const index = data.check.findIndex((item) => item.uid === user.uid)
                // return;
                if (index === -1) {
                    data.check.push({
                        uid: user.uid,
                        type: "plus",
                    });

                    db.collection(typeNews).doc(id).collection('comments').doc(dataGen).update({
                        ...data,
                        point: data.point + 1,
                        check: data.check,
                    })
                } else {
                    if (data.check[index]?.type === 'plus') {
                        data.check.splice(index, 1);
                        db.collection(typeNews).doc(id).collection('comments').doc(dataGen).update({
                            ...data,
                            point: data.point - 1,
                            check: data.check,
                        })
                    } else {
                        const newcheck = {
                            ...data.check[index],
                            type: "plus",
                        }
                        data.check.splice(index, 1, newcheck);
                        db.collection(typeNews).doc(id).collection('comments').doc(dataGen).update({
                            ...data,
                            point: data.point + 2,
                            check: data.check,
                        })
                    }
                }


            } else {
                plusElement.querySelector('path').removeAttribute('class');

                // return;
                const index = data.check.findIndex((item) => item.uid === user.uid)
                if (index === -1) {
                    data.check.push({
                        uid: user.uid,
                        type: "sub",
                    });
                    db.collection(typeNews).doc(id).collection('comments').doc(dataGen).update({
                        ...data,
                        point: data.point - 1,
                        check: data.check,
                    })
                } else {
                    if (data.check[index]?.type === 'sub') {
                        data.check.splice(index, 1);
                        db.collection(typeNews).doc(id).collection('comments').doc(dataGen).update({
                            ...data,
                            point: data.point + 1,
                            check: data.check,
                        })
                    } else {
                        const newcheck = {
                            ...data.check[index],
                            type: "sub",
                        }
                        data.check.splice(index, 1, newcheck);
                        db.collection(typeNews).doc(id).collection('comments').doc(dataGen).update({
                            ...data,
                            point: data.point - 2,
                            check: data.check,
                        })
                    }
                }
            }
        }

        elementClick.classList.toggle('active');
    }

    const handleOpenFormReply = (id, name) => {
        setValueRep(`@${name}`);
        setOpen(id);
    }

    useEffect(() => {
        if (open && valueRep) {
            const elementTexterea = document.querySelector('.content__reply');
            elementTexterea.setAttribute('autofocus', '');
        }
    }, [open, valueRep])

    const addActive = (data, uid, type) => {
        if (data) {
            const index = data?.findIndex((item) =>
                item.uid === uid)
            if (index !== -1) {
                if (data[index].type === type) {
                    return "active";
                }
            }
        }
    }
    const handleRespect = (commentID, data) => {
        if (data.respect) {
            const check = window.confirm("Câu trả lời này không còn là phù hợp nhất?", "thông báo");
            if (check) {
                db.collection('questions').doc(id).collection('comments').doc(commentID).update({
                    ...data,
                    respect: false,
                })
            }

        } else {
            const check = window.confirm("Bạn nghĩ đây là câu trả lời phù hợp nhất?", "thông báo");
            if (check) {
                db.collection('questions').doc(id).collection('comments').doc(commentID).update({
                    ...data,
                    respect: true,
                })
            }
        }
    }
    return (
        <div className="comments">
            <h2>{typeNews === "posts" ? "Bình luận" : "Câu trả lời"}</h2>
            <div className="comment__form">
                <Avatar className="comment__avatar" src={user.photoURL}>{user.displayName && user.displayName.charAt(0).toUpperCase()}</Avatar>
                <Form name="new__comment" >
                    <Form.Item >
                        <textarea className="input__text" placeholder="Viết bình luận" onChange={(e) => setValue(e.target.value)} value={value} style={{ width: '100%', resize: "none" }} />
                        <textarea hidden onChange={(e) => setValue(e.target.value)} value={value} />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handlePostComment} disabled={!value} type="primary">{typeNews === "posts" ? "Bình luận" : "Trả lời"}</Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="comment__list">
                {comments.map((item) => (
                    <div className="comment__item" key={item.id}>
                        <div className="item__info">
                            <div className="item__info--user">
                                <Avatar src={item.data.photoURL}>{item.data.displayName.charAt(0).toUpperCase()}</Avatar>
                                <h3>{item.data.displayName}
                                    {checkUid && (<Button className={item.data.respect && "respect"} onClick={() => handleRespect(item.id, item.data)}>{item.data.respect ? "Đã được chấp nhận" : "Chấp nhận câu trả lời"}</Button>)}
                                </h3>
                            </div>
                            <div className="time">
                                <Moment format="ddd DD/MM/YYYY HH:mm A">{item?.data?.timestamp.seconds * 1000}</Moment>
                            </div>
                        </div>
                        <div className="item__content">
                            {item.data.content}
                        </div>
                        <div className="item__button">
                            <div className="point">
                                <ArrowBackIos onClick={(e) => clickVote(e, "plus", item.data, item.id)} className={"plus " + addActive(item.data.check, user.uid, "plus")} />
                                <span>{item.data.point}</span>
                                <ArrowBackIos onClick={(e) => clickVote(e, "sub", item.data, item.id)} className={"sub " + addActive(item.data.check, user.uid, "sub")} />
                            </div>
                            <Tooltip placement="bottom" title="Trả lời">
                                <Button onClick={() => handleOpenFormReply(item.id, item.data.displayName)} className="button__reply">Trả lời</Button>
                            </Tooltip>
                        </div>
                        <ListReply clickVote={clickVote} handleOpenFormReply={handleOpenFormReply} user={user} id={id} commentID={item.id} />
                        {open === item.id &&
                            (<Form name="new__comment" >
                                <Form.Item >
                                    <textarea className="content__reply" autoFocus value={valueRep} onChange={(e) => setValueRep(e.target.value)} placeholder="Viết bình luận" style={{ width: '100%', resize: "none" }} />
                                    <textarea hidden value={valueRep} onChange={(e) => setValueRep(e.target.value)} />
                                </Form.Item>
                                <Form.Item>
                                    <Button onClick={() => handlePostReply(item.id)} disabled={!valueRep} type="primary">Bình luận</Button>
                                    <Button onClick={() => setOpen('')} type="default" style={{ marginLeft: "10px" }}>Hủy</Button>
                                </Form.Item>

                            </Form>)}
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Comments
