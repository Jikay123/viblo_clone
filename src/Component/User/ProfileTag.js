import { Add } from '@material-ui/icons';
import { Button } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router';
import { UserContext } from '../../Context/UserContext';
import db from '../../Firebase';

function ProfileTag({ data = [], userLogin }) {
    const { user } = useContext(UserContext);
    const [valueTags, setValueTags] = useState([]);
    const arrayTagRef = useRef([]);
    const history = useHistory();
    const color = ["#297FB8", "#FE9E40", "#d6562c", "#1f3a67", "#8D44AD", "#27AE61", "#C1392B"];

    const randomColor = () => {
        return color[Math.floor(Math.random() * color.length)];
    }
    useEffect(() => {
        data?.map((item) => (
            db.collection('tags').onSnapshot(snap => {
                snap.docs.map((valueTag) => {
                    if (valueTag.id === item) {
                        if (valueTags.findIndex((itemValue) => itemValue.id === valueTag.id) === -1) {
                            arrayTagRef.current.push({
                                id: valueTag.id,
                                data: valueTag.data(),
                            })

                        }
                    }
                    return null;
                })
            })
        ))

        setTimeout(() => {
            setValueTags(arrayTagRef.current)

        }, 1000)
    }, [data, valueTags])

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

            if (userLogin.data.tagsFollow) {
                userLogin.data.tagsFollow.push(tagID);
                db.collection('users').doc(userLogin.id).update({
                    ...userLogin.data,
                    tagsFollow: userLogin.data.tagsFollow,
                })


            } else {
                db.collection('users').doc(userLogin.id).update({
                    ...userLogin.data,
                    tagsFollow: arrProfileTags,
                })


            }

        } else {
            const index = tagData.follow.findIndex((item) => item === user.uid);
            const indexProfileTags = userLogin.data.tagsFollow.findIndex((item) => item === tagID);
            userLogin.data.tagsFollow.splice(indexProfileTags, 1);
            tagData.follow.splice(index, 1);
            db.collection('tags').doc(tagID).update({
                ...tagData,
                follow: tagData.follow,
            })
            db.collection('users').doc(userLogin.id).update({
                ...userLogin.data,
                tagsFollow: userLogin.data.tagsFollow,
            })
        }
    }
    const handleMoveDetail = (tagID) => {
        history.push(`/tags/${tagID}`);
    }
    return (
        <>
            {data.length !== 0 ? (
                <div className="content__main">
                    {valueTags.map((item) => (
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
            ) : (
                <div>
                    Người dùng chưa theo dõi thẻ
                </div>
            )
            }
        </>

    )
}

export default ProfileTag
