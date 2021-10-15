import React, { useEffect, useRef, useState } from 'react';
import db from '../../Firebase';
import PostItem from '../PostContent/PostItem';

function BookmarkList({ data }) {
    const [bookmarkList, setBookmarkList] = useState([]);
    const bookmarkListRef = useRef([]);

    useEffect(() => {
        data?.map((item) => (
            db.collection(item.type).orderBy('timestamp', 'desc').onSnapshot(snap => {
                snap.docs.map(valueDB => {
                    if (valueDB.id === item.id) {
                        if (bookmarkList.findIndex((itemValue) => itemValue.id === valueDB.id) === -1) {
                            bookmarkListRef.current.push({
                                id: valueDB.id,
                                data: valueDB.data(),
                                type: item.type,
                            })
                        }
                    }
                    return null;
                })
            })
        ))
        setTimeout(() => {
            setBookmarkList(bookmarkListRef.current);
        }, 500)
    }, [data, bookmarkList])
    return (
        <>{
            (data && data.length > 0) ?
                (<div className="bookmark">
                    <div className="content__main">
                        {bookmarkList.map(item => (
                            <PostItem item={item} key={item.id} type={item.type} />
                        ))}
                    </div>
                </div>)
                : (<div>Người dùng chưa bookmark bài viết nào cả</div>)
        }

        </>
    )
}

export default BookmarkList
