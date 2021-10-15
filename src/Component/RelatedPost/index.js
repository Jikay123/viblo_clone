import { Bookmark, ForumOutlined, PlayArrow, VisibilityOffOutlined } from '@material-ui/icons';
import { Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import db from '../../Firebase';
import './style.scss';

function RelatedPost({ tags, id }) {
    const [listPostRelated, setListPostRelated] = useState([]);
    const postRef = useRef([]);
    useEffect(() => {

        tags?.map(valueTag => (
            db.collection('posts').onSnapshot(snap => {
                snap.docs.map(item => {
                    if (item.tags?.includes(valueTag) !== -1) {
                        if (postRef.current.findIndex(itemFind => itemFind.id === item.id) === -1) {
                            postRef.current.push({
                                id: item.id,
                                data: item.data(),
                            })

                        }
                    }
                    return null;
                })
            })
        ))
        setTimeout(() => {
            const index = postRef.current.findIndex(item => item.id === id);
            console.log(index)
            postRef.current.splice(index, 1)
            console.log(postRef.current)
            setListPostRelated(postRef.current)
        }, 200)


    }, [tags, id])
    return (
        <div className="related">
            <h2 className="title__first">Bài viết liên quan</h2>
            <div className="tags">
                {listPostRelated.map(item => (

                    <div key={item.id} className="tags__item">
                        <h2 className="title">
                            {item.data.title}
                        </h2>
                        <p className="name">{item.data.displayName}</p>
                        <p className="time__read"></p>
                        <div className="info">
                            <Tooltip placement="bottom" title="Lượt xem" >
                                <div className="icon">
                                    <VisibilityOffOutlined /> <span>0</span>
                                </div>
                            </Tooltip>
                            <Tooltip placement="bottom" title="Bookmark" >
                                <div className="icon">
                                    <Bookmark /> <span>{item.data?.bookmark?.length}</span>
                                </div>
                            </Tooltip>
                            <Tooltip placement="bottom" title="Bình luận" >
                                <div className="icon">
                                    <ForumOutlined /> <span>0</span>
                                </div>
                            </Tooltip>
                            <Tooltip placement="bottom" title="Bình luận" >
                                <div className="icon point">
                                    <PlayArrow className="up" />
                                    <span>{item.data.point}</span>
                                    <PlayArrow className="down" />
                                </div>
                            </Tooltip>

                        </div>
                    </div>

                ))}

                <div className="tags__item">
                    <h2 className="title">
                        Destructuring Assignment in ES6
                    </h2>
                    <p className="name">Nguyễn Văn A</p>
                    <p className="time__read"></p>
                    <div className="info">
                        <Tooltip placement="bottom" title="Lượt xem" >
                            <div className="icon">
                                <VisibilityOffOutlined /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bookmark" >
                            <div className="icon">
                                <Bookmark /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bình luận" >
                            <div className="icon">
                                <ForumOutlined /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bình luận" >
                            <div className="icon point">
                                <PlayArrow className="up" />
                                <span>0</span>
                                <PlayArrow className="down" />
                            </div>
                        </Tooltip>

                    </div>
                </div>

                <div className="tags__item">
                    <h2 className="title">
                        Destructuring Assignment in ES6
                    </h2>
                    <p className="name">Nguyễn Văn A</p>
                    <p className="time__read"></p>
                    <div className="info">
                        <Tooltip placement="bottom" title="Lượt xem" >
                            <div className="icon">
                                <VisibilityOffOutlined /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bookmark" >
                            <div className="icon">
                                <Bookmark /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bình luận" >
                            <div className="icon">
                                <ForumOutlined /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bình luận" >
                            <div className="icon point">
                                <PlayArrow className="up" />
                                <span>0</span>
                                <PlayArrow className="down" />
                            </div>
                        </Tooltip>

                    </div>
                </div>

            </div>

            <h2 className="title__first">Bài viết khác từ tác giả</h2>
            <div className="tags">
                <div className="tags__item">
                    <h2 className="title">
                        Destructuring Assignment in ES6
                    </h2>
                    <p className="name">Nguyễn Văn A</p>
                    <p className="time__read"></p>
                    <div className="info">
                        <Tooltip placement="bottom" title="Lượt xem" >
                            <div className="icon">
                                <VisibilityOffOutlined /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bookmark" >
                            <div className="icon">
                                <Bookmark /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bình luận" >
                            <div className="icon">
                                <ForumOutlined /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bình luận" >
                            <div className="icon point">
                                <PlayArrow className="up" />
                                <span>0</span>
                                <PlayArrow className="down" />
                            </div>
                        </Tooltip>

                    </div>
                </div>

                <div className="tags__item">
                    <h2 className="title">
                        Destructuring Assignment in ES6
                    </h2>
                    <p className="name">Nguyễn Văn A</p>
                    <p className="time__read"></p>
                    <div className="info">
                        <Tooltip placement="bottom" title="Lượt xem" >
                            <div className="icon">
                                <VisibilityOffOutlined /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bookmark" >
                            <div className="icon">
                                <Bookmark /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bình luận" >
                            <div className="icon">
                                <ForumOutlined /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bình luận" >
                            <div className="icon point">
                                <PlayArrow className="up" />
                                <span>0</span>
                                <PlayArrow className="down" />
                            </div>
                        </Tooltip>

                    </div>
                </div>

                <div className="tags__item">
                    <h2 className="title">
                        Destructuring Assignment in ES6
                    </h2>
                    <p className="name">Nguyễn Văn A</p>
                    <p className="time__read"></p>
                    <div className="info">
                        <Tooltip placement="bottom" title="Lượt xem" >
                            <div className="icon">
                                <VisibilityOffOutlined /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bookmark" >
                            <div className="icon">
                                <Bookmark /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bình luận" >
                            <div className="icon">
                                <ForumOutlined /> <span>0</span>
                            </div>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Bình luận" >
                            <div className="icon point">
                                <PlayArrow className="up" />
                                <span>0</span>
                                <PlayArrow className="down" />
                            </div>
                        </Tooltip>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default RelatedPost
