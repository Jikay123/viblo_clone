import { Avatar, Button, Tabs } from 'antd'
import { Report } from '@material-ui/icons'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { UserContext } from '../../Context/UserContext';
import db from '../../Firebase';
import Nav from '../Nav'
import ButtonScrollTop from '../../ButtonScrollTop';
import FollowUser from './FollowUser';
import ProfileTag from './ProfileTag';
import BookmarkList from './BookmarkList';
import ProfilePost from './ProfilePost';
import Fan from './Fan';

function Profile() {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [valueProfile, setValueProfile] = useState('');
    const [checkUser, setCheckUser] = useState(false);
    const [userLogin, setUserLogin] = useState('');

    const { TabPane } = Tabs;

    const [postList, setPostList] = useState([]);
    const postListRef = useRef([]);
    const [questionList, setQuestionList] = useState([]);
    const questionListRef = useRef([]);

    useEffect(() => {
        db.collection('posts').onSnapshot(snap => {
            snap.docs.map((valuePost) => {
                if (valuePost.data().uid === id) {
                    if (postList.findIndex((item) => item.id === valuePost.id) === -1) {
                        postListRef.current.push({
                            id: valuePost.id,
                            data: valuePost.data(),
                        })
                    }
                }
                return null;
            })
        })

        setTimeout(() => {
            setPostList(postListRef.current);
        }, 1200)
    }, [postList, id])

    useEffect(() => {
        db.collection('questions').onSnapshot(snap => {
            snap.docs.map((valuePost) => {
                if (valuePost.data().uid === id) {
                    if (questionList.findIndex((item) => item.id === valuePost.id) === -1) {
                        questionListRef.current.push({
                            id: valuePost.id,
                            data: valuePost.data(),
                        })
                    }
                }
                return null;
            })
        })

        setTimeout(() => {
            setQuestionList(questionListRef.current);
        }, 1000)
    }, [questionList, id])

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

        return () => loadData();

    }, [id])

    useEffect(() => {
        if (valueProfile) {
            if (valueProfile.data.uid === user.uid) {
                setCheckUser(true);
            }
        }
    }, [user, valueProfile])

    useEffect(() => {
        const idLocalStorage = JSON.parse(localStorage.getItem('idViblo'))
        if (id !== idLocalStorage) {
            localStorage.setItem('idViblo', JSON.stringify(id));
            window.location.reload();
        }
    }, [id])

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
                    uid: user?.uid,
                    displayName: user?.displayName,
                    photoURL: user?.photoURL,
                })
                db.collection('users').doc(valueProfile?.id).update({
                    ...valueProfile?.data,
                    fan: valueProfile?.data.fan,
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


    const findIndexCheckUser = () => {
        if (valueProfile.data?.fan)
            return valueProfile.data?.fan.findIndex(item => item.uid === user.uid);
        return -1;
    }




    return (
        <div className="profile">
            <ButtonScrollTop />
            <Nav />
            <div className="profile__info">
                <Avatar src={valueProfile.data?.photoURL} className="profile__info--logo" >{valueProfile.data?.displayName?.charAt(0).toUpperCase()}</Avatar>
                <div className="profile__info--text">
                    <h2 className="displayName">{valueProfile.data?.displayName} <span style={{ color: '#999', fontWeight: '500' }}>{valueProfile.data?.email}</span> </h2>
                    {checkUser ? (<Button className="profile__button">Sửa</Button>) : (<Button
                        onClick={handleFollowUser}
                        className={`profile__button ${findIndexCheckUser() !== -1 && "followed"}`}>
                        {findIndexCheckUser() === -1 ? "Theo dõi" : "Đang theo dõi"}</Button>)}
                    <div style={{ display: 'flex', alignItems: 'center' }}><Report /> <span>Báo cáo</span></div>
                </div>
            </div>

            <div className="profile__tabs">
                <Tabs className="profile__tabs--title" defaultActiveKey="1" >
                    <TabPane className="tabs__item" tab="Bài viết" key="1">
                        <ProfilePost data={postList} type="posts" />
                    </TabPane>
                    <TabPane className="tabs__item" tab="Câu hỏi" key="2">
                        <ProfilePost data={questionList} type="questions" />
                    </TabPane>
                    <TabPane className="tabs__item" tab="Bookmark" key="3">
                        <BookmarkList data={valueProfile?.data?.bookmark} />
                    </TabPane>
                    <TabPane className="tabs__item" tab="Đang theo dõi" key="4">
                        <FollowUser data={valueProfile?.data?.followUser} userLogin={userLogin} />
                    </TabPane>
                    <TabPane className="tabs__item" tab="Người theo dõi" key="5">
                        <Fan data={valueProfile?.data?.fan} userLogin={userLogin} />
                    </TabPane>
                    <TabPane className="tabs__item" tab="Thẻ" key="6">
                        <ProfileTag data={valueProfile?.data?.tagsFollow} userLogin={userLogin} />
                    </TabPane>
                </Tabs>
                <div className="profile__tabs--summary">
                    <p className="summary__item">Bài viết<span>{postList?.length}</span></p>
                    <p className="summary__item">Tổng số câu hỏi<span>{questionList?.length}</span></p>
                    <p className="summary__item">Bookmark<span>{valueProfile?.data?.bookmark?.length ? valueProfile?.data?.bookmark?.length : 0}</span></p>
                    <p className="summary__item">Đang theo dõi các người dùng <span>{valueProfile?.data?.followUser?.length ? valueProfile?.data?.followUser?.length : 0}</span></p>
                    <p className="summary__item">Các người dùng đang theo dõi <span>{valueProfile?.data?.fan?.length ? valueProfile?.data?.fan?.length : 0}</span></p>
                    <p className="summary__item">Các thẻ theo dõi <span>{valueProfile?.data?.tagsFollow?.length ? valueProfile?.data?.tagsFollow?.length : 0}</span></p>
                </div>
            </div>



        </div>
    )
}

export default Profile
