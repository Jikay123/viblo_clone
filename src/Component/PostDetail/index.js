import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ButtonScrollTop from '../../ButtonScrollTop';
import { UserContext } from '../../Context/UserContext';
import db from '../../Firebase';
import ScrollTop from '../../ScrollTop';
import Comments from '../Comments';
import Footer from '../Footer';
import Nav from '../Nav';
import RelatedPost from '../RelatedPost';
import DetailContent from './DetailContent';
import './style.scss';

function PostDetail({ typeNews }) {
    const { id } = useParams();
    const { user } = useContext(UserContext)

    const [content, setContent] = useState('');

    const [userLogin, setUserLogin] = useState('');
    const [userWriteNews, setUserWriteNews] = useState('');

    // const [reputation, setReputation] = useState(0);
    // const reputationRef = useRef(0);
    useEffect(() => {
        const check =
            db.collection(typeNews).doc(id).onSnapshot((snap) => {
                setContent(snap.data())
            });
        return () => check();

    }, [id, typeNews])


    useEffect(() => {
        if (content) {
            document.querySelector('.content__main').innerHTML = content.content
        }
        const loadData =
            db.collection('users').onSnapshot(snap => {
                snap.docs.map(item => {
                    if (item.data().uid === content.uid) {
                        setUserWriteNews({
                            id: item.id,
                            data: item.data(),
                        })
                    }
                    return null;
                })

            })
        return () => loadData();
    }, [content])

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
        const plusElement = document.querySelector('.plus');
        const subElement = document.querySelector('.sub');
        if (content) {
            const index = content.check.findIndex((item) => item.uid === user.uid);
            if (index !== -1) {
                if (content.check[index].type === 'plus') {
                    plusElement.querySelector('path').classList.add('active');
                    subElement.querySelector('path').classList.remove('active');
                } else {
                    subElement.querySelector('path').classList.add('active');
                    plusElement.querySelector('path').classList.remove('active');
                }
            }
        }
    }, [content, user.uid])

    const notificationUser = (typeNotification, typeAction) => {

        if (typeNotification) {
            if (userLogin?.data?.photoURL) {
                userWriteNews.data.notification.push({
                    user: userLogin?.data?.displayName,
                    photoURL: userLogin?.data?.photoURL,
                    title: `đã ${typeNotification === "plus" ? 'upvote' : 'downvote'} cho ${typeNews === "posts" ? "Bài viết" : "Câu hỏi"} của bạn`,
                    link: `/${typeNews}/${id}`,
                    timestamp: new Date(),
                })
            } else {
                userWriteNews.data.notification.push({
                    user: userLogin?.data?.displayName,
                    title: `đã ${typeNotification === "plus" ? 'upvote' : 'downvote'} cho ${typeNews === "posts" ? "Bài viết" : "Câu hỏi"} của bạn`,
                    link: `/${typeNews}/${id}`,
                    timestamp: new Date(),
                })
            }
            db.collection('users').doc(userWriteNews.id).update({
                ...userWriteNews.data,
                notification: userWriteNews.data.notification,
            })
        } else {
            if (userLogin?.data?.photoURL) {
                userWriteNews.data.notification.push({
                    user: userLogin?.data?.displayName,
                    photoURL: userLogin?.data?.photoURL,
                    title: `đã ${typeAction} cho ${typeNews === "posts" ? "Bài viết" : "Câu hỏi"} của bạn`,
                    link: `/${typeNews}/${id}`,
                    timestamp: new Date(),
                })
            } else {
                userWriteNews.data.notification.push({
                    user: userLogin?.data?.displayName,
                    title: `đã ${typeAction} cho ${typeNews === "posts" ? "Bài viết" : "Câu hỏi"} của bạn`,
                    link: `/${typeNews}/${id}`,
                    timestamp: new Date(),
                })
            }

            db.collection('users').doc(userWriteNews.id).update({
                ...userWriteNews.data,
                notification: userWriteNews.data.notification,
            })
        }


    }

    const clickVote = (e, type) => {
        e.stopPropagation();
        const elementClick = e.target;
        const plusElement = document.querySelector('.plus');
        const subElement = document.querySelector('.sub');
        if (elementClick === plusElement || elementClick === subElement) {
            return;
        }
        if (type === 'plus') {
            subElement.querySelector('path').removeAttribute('class');
            const index = content.check.findIndex((item) => item.uid === user.uid)
            // return;
            if (index === -1) {
                content.check.push({
                    uid: user.uid,
                    type: "plus",
                });

                db.collection(typeNews).doc(id).update({
                    ...content,
                    point: content.point + 1,
                    check: content.check,
                })
                notificationUser(type);

            } else {
                if (content.check[index]?.type === 'plus') {
                    content.check.splice(index, 1);
                    db.collection(typeNews).doc(id).update({
                        ...content,
                        point: content.point - 1,
                        check: content.check,
                    })
                } else {
                    const newcheck = {
                        ...content.check[index],
                        type: "plus",
                    }
                    content.check.splice(index, 1, newcheck);
                    db.collection(typeNews).doc(id).update({
                        ...content,
                        point: content.point + 2,
                        check: content.check,
                    })
                    notificationUser(type);
                }

            }

        } else {
            plusElement.querySelector('path').removeAttribute('class');

            // return;
            const index = content.check.findIndex((item) => item.uid === user.uid)
            if (index === -1) {
                content.check.push({
                    uid: user.uid,
                    type: "sub",
                });
                db.collection(typeNews).doc(id).update({
                    ...content,
                    point: content.point - 1,
                    check: content.check,
                })
                notificationUser(type);
            } else {
                if (content.check[index]?.type === 'sub') {
                    content.check.splice(index, 1);
                    db.collection(typeNews).doc(id).update({
                        ...content,
                        point: content.point + 1,
                        check: content.check,
                    })
                } else {
                    const newcheck = {
                        ...content.check[index],
                        type: "sub",
                    }
                    content.check.splice(index, 1, newcheck);
                    db.collection(typeNews).doc(id).update({
                        ...content,
                        point: content.point - 2,
                        check: content.check,
                    })
                    notificationUser(type);
                }
            }
        }
        elementClick.classList.toggle('active');

    }

    const handleBookmark = () => {

        if (!userLogin.data.bookmark) {
            db.collection('users').doc(userLogin.id).update({
                ...userLogin.data,
                bookmark: [{
                    id: id,
                    type: typeNews
                }],
            })
            notificationUser("", "bookmark")

        } else {
            const index = userLogin.data.bookmark.findIndex((item) => item.id === id);
            if (index === -1) {
                userLogin?.data?.bookmark?.push({ id: id, type: typeNews });
                notificationUser("", "bookmark")
            } else {
                userLogin.data.bookmark.splice(index, 1);
            }
            db.collection('users').doc(userLogin.id).update({
                ...userLogin.data,
                bookmark: userLogin.data.bookmark,
            })
        }

        if (!content.bookmark) {
            db.collection(typeNews).doc(id).update({
                ...content,
                bookmark: [userLogin.data.uid]
            })
        } else {
            const indexPost = content.bookmark.findIndex((item) => item === userLogin.data.uid);

            if (indexPost === -1) {
                content.bookmark.push(userLogin?.data?.uid)
            } else {
                content.bookmark.splice(indexPost, 1);
            }
            db.collection(typeNews).doc(id).update({
                ...content,
                bookmark: content.bookmark
            })
        }

    }
    const handleFollowUser = () => {
        let arr = [{
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
        }]
        if (!userWriteNews.data.fan) {
            db.collection('users').doc(userWriteNews.id).update({
                ...userWriteNews.data,
                fan: arr,
            })
        } else {
            const index = userWriteNews.data.fan.findIndex(item => item.uid === user.uid)
            if (index === -1) {
                userWriteNews.data.fan.push({
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                })

            } else {
                userWriteNews.data.fan.splice(index, 1);
            }
            db.collection('users').doc(userWriteNews.id).update({
                ...userWriteNews.data,
                fan: userWriteNews.data.fan,
            })
        }
        if (!userLogin.data.followUser) {
            db.collection('users').doc(userLogin.id).update({
                ...userLogin.data,
                followUser: [userWriteNews.data.uid],
            })
        } else {
            const index = userLogin.data.followUser.findIndex(item => item.uid === userWriteNews.data.uid)
            if (index === -1) {
                userLogin.data.followUser.push(userWriteNews.data.uid)

            } else {
                userLogin.data.followUser.splice(index, 1);
            }
            db.collection('users').doc(userLogin.id).update({
                ...userLogin.data,
                followUser: userLogin.data.followUser,
            })
        }

    }

    return (
        <div className="post__detail">
            <ScrollTop />
            <ButtonScrollTop />
            <Nav />
            <img width="100%" src="https://peterborough.ac.uk/wp-content/uploads/2020/03/NHS-covid-banner-1.png"
                alt="banner" />
            <DetailContent id={id} typeNews={typeNews} content={content} handleBookmark={handleBookmark} handleFollowUser={handleFollowUser} clickVote={clickVote} userLogin={userLogin} userWriteNews={userWriteNews} />

            {typeNews === "posts" && (<RelatedPost tags={content?.tags} id={id} />)}

            <Comments id={id} user={user} typeNews={typeNews} contentId={content?.uid} />
            <Footer />
        </div>
    )
}

export default PostDetail
