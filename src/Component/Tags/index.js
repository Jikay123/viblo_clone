import React, { useContext, useEffect, useState } from 'react'
import Nav from '../Nav'
import { Button, Select } from 'antd'
import Footer from '../Footer';
import './style.scss';
import ButtonScrollTop from '../../ButtonScrollTop';
import db from '../../Firebase';
import { Add } from '@material-ui/icons';
import { UserContext } from '../../Context/UserContext';
import { useHistory } from 'react-router';

function Tags() {
    const { Option } = Select;
    const { user } = useContext(UserContext);
    const [listTags, setListTags] = useState([]);

    const [profile, setProfile] = useState('');
    const color = ["#297FB8", "#FE9E40", "#8D44AD"];
    const history = useHistory();

    const randomColor = () => {
        return color[Math.floor(Math.random() * color.length)];
    }

    useEffect(() => {
        db.collection('tags').onSnapshot((snap) => {
            setListTags([...snap.docs.map((item) => ({ id: item.id, data: item.data() }))])
        })
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
    const handleMoveDetail = (tagID) => {
        history.push(`tags/${tagID}`);
    }
    const sort = ["Người theo dõi", "Số bài viết", "Số câu hỏi"];
    return (
        <div className="tags">
            <ButtonScrollTop />
            <Nav />
            <div className="content__top">
                <h3>Chủ đề({listTags.length})</h3>
                <div>
                    Loại
                    <Select className="selectSort" showArrow="true" defaultValue={sort[0]}>
                        {sort.map((item, index) => (
                            <Option key={index} value={item}>{item}</Option>
                        ))}
                    </Select>
                </div>
            </div>
            <div className="content__main">
                {listTags.map((item) => (
                    <div className="tags__item" key={item.id}>
                        <div onClick={() => handleMoveDetail(item.id)} style={{ background: randomColor() }} className="tags__item--logo">
                            {item.data.name}
                        </div>
                        <div className="tags__item--info">
                            <h3 onClick={() => handleMoveDetail(item.id)}>
                                {item.data.name.toUpperCase()}
                            </h3>
                            <p><strong>1</strong> bài viết</p>
                            <p><strong>1</strong> câu hỏi</p>
                            <p><strong>{item.data.follow.length}</strong> người theo dõi</p>
                            <Button onClick={() => handleFollow(item.id, item.data)} className={`info__button ${item.data.follow?.includes(user.uid) ? "follow" : ""} `}><Add /> {item.data.follow?.includes(user.uid) ? "Đang theo dõi" : "Theo dõi"}</Button>
                        </div>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    )
}

export default Tags
