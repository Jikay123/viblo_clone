import { Add, LocalOffer } from '@material-ui/icons';
import { Button, Tabs } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import db from '../../Firebase';
import Nav from '../Nav';
import Posts from '../Posts';
import ProfilePost from '../User/ProfilePost';

function TagDetail() {
    const { id } = useParams();
    const [valueTags, setValueTags] = useState('');
    const { user } = useContext(UserContext);
    const color = ["#297FB8", "#FE9E40", "#8D44AD"];
    const [profile, setProfile] = useState('');
    const [listTagsPopular, setListTagsPopular] = useState([]);

    const [listPost, setListPost] = useState([]);
    const listPostRef = useRef([]);
    const [listQuestion, setListQuestion] = useState([]);
    const ValueRef = useRef({
        listPost: [],
        listQuestion: []
    })
    const { TabPane } = Tabs;
    const history = useHistory();

    const randomColor = () => {
        return color[Math.floor(Math.random() * color.length)];
    }
    useEffect(() => {
        db.collection('tags').orderBy('follow', 'desc').onSnapshot((snap) => {
            setListTagsPopular([
                ...snap.docs.map((item) => ({ id: item.id, data: item.data() }))
            ])
        })
    }, [])
    useEffect(() => {
        db.collection('users').onSnapshot((snapShot) => {
            snapShot.docs.map((item) => {
                if (item.data().uid === user.uid) {
                    setProfile({
                        id: item.id,
                        data: item.data()
                    })
                }
                return null;
            })
        })
    }, [user])
    useEffect(() => {


        db.collection('tags').doc(id).onSnapshot((snap) => {
            setValueTags({
                id: snap.id,
                data: snap.data(),
            })
        })

    }, [id])

    useEffect(() => {
        let countPost = 0, countQuestion = 0;
        const countPostElement = document.querySelector('.count__post');
        const countQuestionlement = document.querySelector('.count__question');

        db.collection('posts').onSnapshot(snap => (
            snap.docs.map(item => {
                if (item.data().tags.includes(valueTags?.data?.name)) {
                    if (ValueRef.current.listPost.findIndex(valueFind => valueFind.id === item.id))
                        ValueRef.current.listPost.push({
                            id: item.id,
                            data: item.data(),
                        })
                    countPost++;

                }
                return null;
            })
        ))
        db.collection('questions').onSnapshot(snap => (
            snap.docs.map(item => {
                if (item.data().tags.includes(valueTags?.data?.name)) {
                    if (ValueRef.current.listQuestion.findIndex(valueFind => valueFind.id === item.id))
                        ValueRef.current.listQuestion.push({
                            id: item.id,
                            data: item.data(),
                        })
                    countQuestion++;
                }
                return null;
            })
        ))


        setTimeout(() => {
            countPostElement.innerHTML = countPost;
            countQuestionlement.innerHTML = countQuestion;
            setListPost(ValueRef.current.listPost);
            setListQuestion(ValueRef.current.listQuestion);
        }, 200)
    }, [valueTags])

    const handleFollow = (tagID, tagData) => {
        if (!tagData.follow?.includes(user.uid)) {
            let arr = [user.uid];
            let arrProfileTags = [tagID];
            if (tagData.follow) {
                tagData.follow.push(user.uid);
                db.collection('tags').doc(tagID).update({
                    ...tagData,
                    follow: tagData.follow,
                })

            } else {
                db.collection('tags').doc(tagID).update({
                    ...tagData,
                    follow: arr,
                })
            }

            if (profile.data.tagsFollow) {
                profile.data.tagsFollow.push(tagID);
                db.collection('users').doc(profile.id).update({
                    ...profile.data,
                    tagsFollow: profile.data.tagsFollow,
                })


            } else {
                db.collection('users').doc(profile.id).update({
                    ...profile.data,
                    tagsFollow: arrProfileTags,
                })


            }

        } else {
            const index = tagData.follow.findIndex((item) => item === user.uid);
            const indexProfileTags = profile.data.tagsFollow.findIndex((item) => item === tagID);
            profile.data.tagsFollow.splice(indexProfileTags, 1);
            tagData.follow.splice(index, 1);
            db.collection('tags').doc(tagID).update({
                ...tagData,
                follow: tagData.follow,
            })
            db.collection('users').doc(profile.id).update({
                ...profile.data,
                tagsFollow: profile.data.tagsFollow,
            })
        }
    }
    return (
        <div className="tags__detail">
            <Nav />
            <div className="content__top">
                <div style={{ background: randomColor() }} className="content__top--logo">
                    {valueTags?.data?.name}
                </div>
                <div className="content__top--info">
                    <h2> {valueTags?.data?.name.toUpperCase()}</h2>
                    <Button onClick={() => handleFollow(id, valueTags.data)} className={`info__button ${valueTags.data?.follow?.includes(user.uid) ? "follow" : ""} `}><Add /> {valueTags?.data?.follow?.includes(user.uid) ? "Đang theo dõi" : "Theo dõi"}</Button>
                </div>
            </div>
            <div className="content__bottom">
                <div className="content__bottom--left">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="Bài viết" key="1">
                            <ProfilePost data={listPost} type="posts" tag={true} />
                        </TabPane>
                        <TabPane tab="Câu hỏi" key="2">
                            <ProfilePost data={listQuestion} type="questions" tag={true} />
                        </TabPane>

                    </Tabs>
                </div>
                <div className="content__bottom--right">
                    <h2>{valueTags?.data?.name.toUpperCase()}</h2>
                    <div className="boxInfo">
                        <div className="boxInfo__item">
                            <h2><strong className="count__post">number</strong></h2>
                            <p>Bài viết</p>
                        </div>
                        <div className="boxInfo__item">
                            <h2><strong className="count__question">number</strong></h2>
                            <p>Câu hỏi</p>
                        </div>
                        <div className="boxInfo__item" style={{ borderRight: "1px solid #ccc" }}>
                            <h2><strong>{valueTags?.data?.follow.length}</strong></h2>
                            <p>Người theo dõi</p>
                        </div>
                    </div>
                    <h2>Thẻ phổ biến</h2>
                    <div className="tags__popular">
                        {listTagsPopular.map((item) => (
                            <div onClick={() => history.push(`/tags/${item.id}`)} className="tags__popular--item" key={item.id}>
                                <p className="name">{item.data.name}</p>
                                <p className="follow">{item.data.follow.length}</p>
                            </div>
                        ))}
                    </div>
                    <Link to="/tags" style={{ display: 'flex', alignItems: 'center' }} ><LocalOffer />Tất cả các thẻ</Link>
                </div>
            </div>
        </div>
    )
}

export default TagDetail
