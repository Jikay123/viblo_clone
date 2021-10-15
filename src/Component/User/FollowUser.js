import { CreateOutlined, PersonAdd } from '@material-ui/icons';
import { Avatar, Button } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router';
import { UserContext } from '../../Context/UserContext';
import db from '../../Firebase';

function FollowUser({ data, userLogin }) {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [valueProfile, setValueProfile] = useState('');
    const valueFollowRef = useRef([]);
    const [valueFollow, setValueFollow] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const loadData =
            db.collection('users').onSnapshot(snap => {
                snap.docs.map((item) => {
                    if (item.data().uid === id) {
                        setValueProfile({
                            id: item.id,
                            data: item.data()
                        })
                    }
                    return null;
                })
            })

        return () => {
            loadData();
        }

    }, [id])

    useEffect(() => {
        data?.map((item) => (
            db.collection('users').onSnapshot((snap) => {
                snap.docs.map(value => {
                    if (value.data().uid === item) {
                        if (valueFollow.findIndex((itemValue) => itemValue.id === value.id) === -1) {
                            if (valueFollowRef.current.length >= data.length) {
                                return null;
                            } else {
                                valueFollowRef.current.push(
                                    {
                                        id: value.id,
                                        data: value.data()
                                    }
                                )
                            }
                        }

                    }
                    return null;
                })

            })
        ))
        setTimeout(() => {
            console.log(data?.length, valueFollowRef.current.length)
            setValueFollow(valueFollowRef.current)
        }, 500)
    }, [data, valueFollow])

    const handlePosts = (posts, questions) => {
        if (posts && questions) {
            return questions + posts;
        } else {
            if (!posts) {
                if (questions) {
                    return questions;
                } else {
                    return 0;
                }
            } else {
                return posts;
            }
        }
    }

    const handleFollowUser = () => {
        let arr = [{
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
        }]
        if (!valueProfile.data.fan) {
            db.collection('users').doc(valueProfile.id).update({
                ...valueProfile.data,
                fan: arr,
            })
        } else {
            const index = valueProfile.data.fan.findIndex(item => item.uid === user.uid)
            if (index === -1) {
                valueProfile.data.fan.push({
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                })
                db.collection('users').doc(valueProfile.id).update({
                    ...valueProfile.data,
                    fan: valueProfile.data.fan,
                })
            } else {
                valueProfile.data.fan.splice(index, 1);
                db.collection('users').doc(valueProfile.id).update({
                    ...valueProfile.data,
                    fan: valueProfile.data.fan,
                })
            }
        }
        if (!userLogin.data.followUser) {
            db.collection('users').doc(userLogin.id).update({
                ...userLogin.data,
                followUser: [valueProfile.data.uid],
            })
        } else {
            const index = userLogin.data.followUser.findIndex(item => item === valueProfile.data.uid)
            if (index === -1) {
                userLogin.data.followUser.push(valueProfile.data.uid)
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
    const handleMovePage = (newid) => {
        localStorage.setItem('idViblo', JSON.stringify(id));
        history.push(`/user/${newid}`);
    }

    const foundIndex = (item) => {
        return userLogin.data.followUser.findIndex((value) => value === item?.data?.uid);
    }

    const hightLightText = (text, str) => {
        return text.replace('str', `<p style={{color: 'blue'}}>${str}</p>`);
    }
    return (
        <> {
            (data && data.length > 0) ? (
                <div className="followed">
                    {valueFollow && valueFollow?.map(item => (
                        <div className="followed__item" key={item.id}>
                            <Avatar onClick={() => handleMovePage(item.data?.uid)} className="item__avatar" src={item?.data?.photoURL} >{item?.data?.displayName.charAt(0).toUpperCase()}</Avatar>
                            <div onClick={() => handleMovePage(item.data?.uid)} className="item__info">
                                <div className="item__info--name">{item?.data?.displayName}</div>
                                <div className="item__info--icon">
                                    <p><PersonAdd /><span>{item?.data?.fan?.length}</span></p>
                                    <p><CreateOutlined /><span>{handlePosts(item?.data?.posts, item?.data?.questions)}</span></p>
                                </div>
                                {item.data?.uid !== userLogin.data?.uid && (<Button onClick={handleFollowUser} className={`item__info--button ${foundIndex(item) !== -1 && 'active'}`} >
                                    {foundIndex(item) !== -1 ? 'Đang theo dõi' : 'Theo dõi'}
                                </Button>)}

                            </div>
                        </div>
                    ))}
                </div>

            ) :
                <div>{"Người dùng chưa follow người khác"}</div>
        }


        </>
    )
}
export default FollowUser
