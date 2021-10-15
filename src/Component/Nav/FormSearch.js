import { Search } from '@material-ui/icons';
import { Spin, Avatar } from 'antd';
import React from 'react';
import Moment from 'react-moment';
import db from '../../Firebase';

function FormSearch({ countPost, postSearch, questionSearch,
    userSearch, tagSearch, valueSearch, handleSearchData, handleOnChangeValueSearch,
    loading, ModalSearch, handleMovePage, truncate, createContent, handleBlurSearch }) {
    const color = ["#297FB8", "#FE9E40", "#d6562c", "#1f3a67", "#8D44AD", "#27AE61", "#C1392B"];

    const randomColor = () => {
        return color[Math.floor(Math.random() * color.length)];
    }

    const countUserFollowTag = (key) => {
        const element = document.querySelector(`.info__content--UserFollow.k${key}`);
        let number = 0;
        db.collection('users').onSnapshot(snap => {
            snap.docs.map(item => {
                if (item.data()?.tagsFollow?.includes(key)) {

                    number++;
                }
                return null;
            })
        })
        setTimeout(() => {

            if (element && element !== null)
                element.innerHTML = number
        }, 200)
    }
    const countPostsTags = (key, nametag) => {
        const element = document.querySelector(`.info__content--countpost.k${key}`);
        let number = 0;
        db.collection('posts').onSnapshot(snap => {
            snap.docs.map(item => {
                if (item.data()?.tags?.includes(nametag)) {

                    number++;
                }
                return null;
            })
        })
        setTimeout(() => {
            if (element && element !== null)
                element.innerHTML = number
        }, 200)
    }
    return (
        <div>
            <form className="formSearch" onSubmit={handleSearchData}>
                <input className="search__input" value={valueSearch}
                    onBlur={handleBlurSearch}
                    onChange={(e) => handleOnChangeValueSearch(e)} type="text" placeholder="tìm kiếm trên Viblo" />
                <button className="search__submit" type="submit" >{(!loading) ? <Search /> : <Spin />}</button>
            </form>
            <div className="valueSearch" hidden={(ModalSearch === true && valueSearch !== '') === true ? false : true}>
                <div className="search__post">
                    <h2 className="searchData__title">Bài viết</h2>
                    {loading ? <Spin /> : (
                        <>
                            {postSearch.length > 0 ? (
                                <div>
                                    {postSearch?.map(item => (
                                        <div onClick={() => handleMovePage(`/posts/${item.id}`)} className="postsearch__item" key={item.id}>
                                            <h3>
                                                <strong onClick={(e) => handleMovePage(e)}>
                                                    {item.data.title}
                                                </strong>
                                            </h3>
                                            <p style={{ color: '#5488c7', fontWeight: '600' }}>{item.data.displayName} <span style={{ color: '#999', fontWeight: '400' }}> Đã đăng vào <Moment format="ddd DD/MM/YYYY hh:mm A">{item.data.timestamp.seconds * 1000}</Moment></span></p>
                                            {/* <p>{truncate(item.data.content, 100)}</p> */}
                                            <div className={`postSearch__item k${item.id}`} >{
                                                setTimeout(() => {
                                                    createContent(item.id, truncate(item.data.content, 220))
                                                    return;
                                                }, 10)

                                            }</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (<div>Không có nội dung phù hợp</div>)}
                        </>

                    )}
                </div>
                <div className="search__question">
                    <h2 className="searchData__title">Câu hỏi</h2>
                    {loading ? <Spin /> : (
                        <>
                            {questionSearch.length > 0 ? (
                                <div>
                                    {questionSearch?.map(item => (
                                        <div onClick={() => handleMovePage(`questions/${item.id}`)} className="questionSearch__item" key={item.id}>
                                            <h3>
                                                <strong onClick={(e) => handleMovePage(e)}>
                                                    {item.data.title}
                                                </strong>
                                            </h3>
                                            <p style={{ color: '#5488c7', fontWeight: '600' }}>{item.data.displayName} <span style={{ color: '#999', fontWeight: '400' }}> Đã đăng vào <Moment format="ddd DD/MM/YYYY hh:mm A">{item.data.timestamp.seconds * 1000}</Moment></span></p>
                                            {/* <p>{truncate(item.data.content, 100)}</p> */}
                                            <div className={`questionSearch__item k${item.id}`} >{
                                                setTimeout(() => {
                                                    createContent(item.id, truncate(item.data.content, 220), "questionSearch__item")
                                                    return;
                                                }, 10)

                                            }</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (<div>Không có nội dung phù hợp</div>)}
                        </>

                    )}
                </div>
                <div className="search__users">
                    <h2 className="searchData__title">Tác giả</h2>
                    {loading ? <Spin /> : (
                        <>
                            {userSearch.length > 0 ? (
                                <div >
                                    {userSearch?.map(item => (
                                        <div onClick={() => handleMovePage(`user/${item.data.uid}`)} className="userSearch__item" key={item.id}>
                                            <Avatar src={item.data.photoURL}>{item.data?.displayName.charAt(0).toUpperCase()}</Avatar>
                                            <div className="userSearch__item--info">
                                                <p>
                                                    <strong>{item.data.displayName}</strong>
                                                    <span style={{ color: '#999', marginLeft: '5px' }}>
                                                        {item.data.email}
                                                    </span>
                                                </p>
                                                <p>
                                                    <span >Số người theo dõi <strong>{item.data.fan ? item.data.fan?.length : 0}</strong></span>
                                                    <span style={{ marginLeft: '5px' }}>Số bài viết <strong className={`countPost k${item.id}`}>{
                                                        setTimeout(() => {
                                                            return countPost(item.data.uid, item.id)
                                                        }, 50)
                                                    }</strong></span>
                                                </p>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            ) : (<div>Không có nội dung phù hợp</div>)}
                        </>

                    )}
                </div>
                <div className="search__tags">
                    <h2 className="searchData__title">Thẻ</h2>
                    {loading ? <Spin /> : (
                        <>
                            {tagSearch.length > 0 ? (
                                <div>
                                    {tagSearch?.map(item => (
                                        <div onClick={() => handleMovePage(`tags/${item.id}`)} className="tagSearch__item" key={item.id}>
                                            <div style={{ background: randomColor() }} className="tagSearch__item--logo">
                                                {item.data.name}
                                            </div>
                                            <div className="tagSearch__item--info">
                                                <h3 className="info__name">
                                                    {item.data.name}
                                                </h3>
                                                <div className="info__content">
                                                    <p>Người theo dõi <strong className={`info__content--UserFollow k${item.id}`}>{countUserFollowTag(item.id)}</strong></p>
                                                    <p style={{ marginLeft: '5px' }}>Bài viết <strong className={`info__content--countpost k${item.id}`}>{countPostsTags(item.id, item.data.name)}</strong></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (<div>Không có nội dung phù hợp</div>)}
                        </>

                    )}
                </div>
            </div>

        </div>
    )
}

export default FormSearch
