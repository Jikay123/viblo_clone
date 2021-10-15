import React from 'react';
import PostItem from '../PostContent/PostItem';

function ProfilePost({ data, type, tag }) {
    return (
        <> {(data && data.length > 0) ? (
            <div className="profile__post">
                {/* <div key={item.id}>{item.data.title}</div> */}
                <div className="content__main">
                    {data.map(item => (
                        <PostItem item={item} key={item.id} type={type} />
                    ))}
                </div>
            </div>
        ) : (tag ? (<div>{`Thẻ hiện tại chưa có ${type === "posts" ? "Bài viết" : "câu hỏi"} nào`}</div>) : (<div>{`Người dùng chưa có ${type === "posts" ? "Bài viết" : "đặt câu hỏi"} nào`}</div>))}
        </>
    )
}

export default ProfilePost
