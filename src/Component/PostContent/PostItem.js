import { ArrowDropDown, ArrowDropUp, Bookmark, Check, CreateOutlined, LinkSharp, PersonAdd, QuestionAnswer, Reply, Star, Visibility } from '@material-ui/icons';
import { Avatar, Button, Dropdown, Tooltip } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import db from '../../Firebase';


function PostItem({ item, type }) {
    const { user } = useContext(UserContext);
    const history = useHistory();
    const numberRef = useRef(null);
    const [number, setNumber] = useState('');
    const [infoUser, setInfoUser] = useState();
    const [checkRespect, setCheckRespect] = useState(false);
    const [userLogin, setUserLogin] = useState('');

    useEffect(() => {
        const loadData = db.collection('users').onSnapshot((snap) => {
            snap.docs.map((item) => {
                if (item.data().uid === user.uid) {
                    setUserLogin({
                        id: item.id,
                        data: item.data()
                    })
                }
                return null;
            })
        })
        return () => loadData();
    }, [user])

    useEffect(() => {
        const setValueComment =
            db.collection(type).doc(item.id).collection('comments').onSnapshot((snap) => {
                if (snap) {
                    numberRef.current = snap.docs.length;
                    snap.docs.map((itemSnap) => {
                        db.collection(type).doc(item.id).collection('comments').doc(itemSnap.id).collection('replys').onSnapshot((snapshot) => {
                            numberRef.current += snapshot.docs.length;
                        })
                        if (itemSnap.data().respect) {
                            setCheckRespect(true)
                        }
                        return null;
                    })
                }
                setTimeout(() => {
                    setNumber(numberRef.current);
                }, 200)
            })
        const setUserInfo =
            db.collection('users').onSnapshot(snap => {
                snap.docs.map((value) => {
                    if (value.data().uid === item.data.uid) {
                        setInfoUser({
                            id: value.id,
                            data: value.data(),
                        })
                    }
                    return null;
                })
            })

        return () => {
            setValueComment();
            setUserInfo();
        }
    }, [item, type, user])

    const handleMoveDetailtag = (name) => {
        db.collection('tags').onSnapshot((snap) => {
            snap.docs.map((item) => {
                if (name === item.data().name) {
                    history.push(`/tags/${item.id}`)
                }
                return null;
            })
        })

    }

    const handleFollowUser = () => {
        let arr = [{
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
        }]
        if (!infoUser.data.fan) {
            db.collection('users').doc(infoUser.id).update({
                ...infoUser.data,
                fan: arr,
            })
        } else {
            const index = infoUser.data.fan.findIndex(item => item.uid === user.uid)
            if (index === -1) {
                infoUser.data.fan.push({
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                })
                db.collection('users').doc(infoUser.id).update({
                    ...infoUser.data,
                    fan: infoUser.data.fan,
                })
            } else {
                infoUser.data.fan.splice(index, 1);
                db.collection('users').doc(infoUser.id).update({
                    ...infoUser.data,
                    fan: infoUser.data.fan,
                })
            }
        }

        if (!userLogin.data.followUser) {
            db.collection('users').doc(userLogin.id).update({
                ...userLogin.data,
                followUser: [infoUser.data.uid],
            })
        } else {
            const index = userLogin.data.followUser.findIndex(item => item.uid === infoUser.data.uid)
            if (index === -1) {
                userLogin.data.followUser.push(infoUser.data.uid)
                db.collection('users').doc(userLogin.id).update({
                    ...userLogin.data,
                    followUser: userLogin.data.followUser,
                })
            } else {
                userLogin.data.followUser.splice(index, 1);
                db.collection('users').doc(userLogin.id).update({
                    ...userLogin.data,
                    followUser: userLogin.data.followUser,
                })
            }
        }

    }
    const findIndexCheckUser = () => {
        if (infoUser?.data?.fan)
            return infoUser.data?.fan.findIndex(item => item.uid === user.uid);
    }
    return (
        <div className="item" key={item.id}>
            <Avatar onClick={() => history.push(`/user/${item.data.uid}`)} src={item.data.photoURL} alt="" className="item__avatar" >{item.data.displayName ? item.data.displayName.charAt(0).toUpperCase() : ""}</Avatar>
            <div className="item__content">
                <div className="item__content--header">
                    <Dropdown overlay={
                        <div className="menu__info" >
                            <div key="infoUser" className="popup__info">
                                <div className="header">
                                    <Avatar onClick={() => history.push(`/user/${item.data.uid}`)} className="header__logo" src={item.data.photoURL}>{item.data.displayName.charAt(0).toUpperCase()}</Avatar>
                                    <div className="header__info">
                                        <h2 onClick={() => history.push(`/user/${item.data.uid}`)} className="header__info--name">
                                            {item.data.displayName}
                                        </h2>

                                        <div className="header__info--icon">
                                            <Tooltip title={`Reputation: X`} placement="bottom">
                                                <p className="icon__item"><Star /> <span>X</span></p>
                                            </Tooltip>
                                            <Tooltip title={`Bài viết: 0`} placement="bottom">
                                                <p className="icon__item"><CreateOutlined /> <span>0</span></p>
                                            </Tooltip>
                                            <Tooltip title={`Người theo dõi: 0`} placement="bottom">
                                                <p className="icon__item"><PersonAdd /> <span>0</span></p>
                                            </Tooltip>
                                            <Tooltip title={`Tổng lượt xem: X`} placement="bottom">
                                                <p className="icon__item"><Visibility /> <span>X</span></p>
                                            </Tooltip>
                                        </div>

                                    </div>
                                </div>
                                <div className="follow">
                                    {infoUser?.data?.fan?.length > 0 && (
                                        <Avatar.Group maxCount={5}>
                                            {infoUser?.data?.fan?.map((item) => (
                                                <Tooltip placement="bottom" title={item?.displayName} key={item?.uid}>
                                                    <Avatar style={{ cursor: 'pointer' }} onClick={() => history.push(`/user/${item?.uid}`)} src={item?.photoURL}>{item?.displayName?.charAt(0).toUpperCase()}</Avatar>
                                                </Tooltip>)
                                            )}
                                        </Avatar.Group>
                                    )}
                                    {userLogin?.data?.uid !== item?.data?.uid && (
                                        <Button
                                            onClick={handleFollowUser}
                                            className={`follow__button ${findIndexCheckUser() !== -1 && "followed"}`}>
                                            {findIndexCheckUser() === -1 ? "Theo dõi" : "Đang theo dõi"}</Button>
                                    )}

                                </div>
                            </div>

                        </div>
                    } trigger={['hover']} arrow placement="bottomLeft">
                        <div className="displayName">{item.data.displayName}</div>
                    </Dropdown>
                    <Tooltip placement="bottom" title={<Moment unix fromNow >{item.data.timestamp?.seconds}</Moment>} arrow >
                        <p className="header__time">
                            <Moment unix fromNow format="ddd DD/MM/YYYY" >{item.data.timestamp?.seconds}</Moment>
                        </p>
                    </Tooltip>
                    <Tooltip title="Copylink" placement="bottom">
                        <div className="header__link" onClick={() => navigator.clipboard.writeText(`https://viblo-23154.web.app/${type}/${item.id}`)}><LinkSharp /></div>
                    </Tooltip>
                </div>
                <div className="item__content--info">
                    <div onClick={() => history.push(`/${type}/${item.id}`)} className="info__title">{item.data.title}</div>
                    <div className="info__theme">
                        {item.data.tags.map((item, index) => (
                            <div onClick={() => handleMoveDetailtag(item)} className="info__theme--item" key={index}>
                                {item}
                            </div>
                        ))}

                    </div>
                </div>
                <div className="item__content--interactive">
                    <div className="interactive__info">
                        <Tooltip placement="bottom" arrow title={"Lượt xem : 0"}>
                            <div className="info__item">
                                <Visibility /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" arrow title={`Bookmark : ${item?.data?.bookmark?.length}`}>
                            <div className="info__item">
                                <Bookmark /><span>{item?.data?.bookmark?.length}</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" arrow title={(type === "posts" ? "Bình luận" : "Câu trả lời") + `: ${number}`}>
                            <div className="info__item">
                                {type === "posts" ? <QuestionAnswer /> : (checkRespect === true ? <Check className="checkRespect" /> : <Reply />)}<span>{number}</span>
                            </div>
                        </Tooltip>

                    </div>

                    <div className="interactive__comment">
                        <Avatar.Group maxCount={5}>
                            {item.data.people?.map((item, index) => (
                                <Tooltip key={index} placement="bottom" title={item.displayName}>
                                    <Avatar src={item.photoURL}>{item.displayName && item.displayName.charAt(0).toUpperCase()}</Avatar>
                                </Tooltip>
                            ))}
                        </Avatar.Group>

                    </div>
                </div>
            </div>
            <div className="item__point">
                <div className="carets">
                    <ArrowDropUp className="up" />
                    <ArrowDropDown className="down" />
                </div>
                <p>{item.data.point}</p>
            </div>
        </div>

    )
}

export default PostItem
