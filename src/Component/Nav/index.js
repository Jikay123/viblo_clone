import { Avatar, IconButton, ImageListItem, Link } from '@material-ui/core';
import { CreateOutlined, EditOutlined, HelpOutline, Notifications, Search } from '@material-ui/icons';
import { Button, Dropdown, Menu, Spin } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import db, { auth } from '../../Firebase';
import FormSearch from './FormSearch';
import './style.scss';


function Nav() {
    const history = useHistory();
    const { user } = useContext(UserContext);
    const [userLogin, setUserLogin] = useState('');
    const [valueSearch, setValueSearch] = useState('');
    const [postSearch, setPostSearch] = useState([]);
    const [questionSearch, setQuestionSearch] = useState([]);
    const [userSearch, setUserSearch] = useState([]);
    const [tagSearch, setTagSearch] = useState([]);
    const postSearchRef = useRef([])
    const questionSearchRef = useRef([])
    const userSearchRef = useRef([])
    const tagSearchRef = useRef([])

    const [ModalSearch, setModalSearch] = useState(false)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchKey = valueSearch.trim();
        if (searchKey !== '') {
            setLoading(true)
            setTimeout(() => {
                setModalSearch(true);
                setLoading(false)
            }, 1000)
        } else {
            setModalSearch(false);
        }
        if (searchKey !== '') {
            db.collection('posts').onSnapshot(snap => {
                snap.docs.map(item => {
                    if (item.data().title.toUpperCase().includes(searchKey.toUpperCase()) || item.data().content.toUpperCase().includes(searchKey.toUpperCase())) {
                        if (postSearch.findIndex(valueFind => valueFind.id === item.id) === -1) {
                            postSearchRef.current.push(
                                {
                                    id: item.id,
                                    data: item.data(),
                                })
                        }
                    }
                    return null;
                })
                setTimeout(() => {
                    setPostSearch(postSearchRef.current)
                }, 500)

            })
            db.collection('questions').onSnapshot(snap => {
                snap.docs.map(item => {
                    if (searchKey !== '')
                        if (item.data().title.toUpperCase().includes(searchKey.toUpperCase()) || item.data().content.toUpperCase().includes(searchKey.toUpperCase())) {
                            if (questionSearch.findIndex(valueFind => valueFind.id === item.id) === -1) {
                                questionSearchRef.current.push(
                                    {
                                        id: item.id,
                                        data: item.data(),
                                    })
                            }
                        }
                    return null;
                })
                setTimeout(() => {
                    setQuestionSearch(questionSearchRef.current)
                }, 500)
            })


            db.collection('users').onSnapshot(snap => {
                snap.docs.map(item => {
                    if (searchKey !== '')
                        if (item.data().displayName.toUpperCase().includes(searchKey.toUpperCase()) || item.data().email.toUpperCase().includes(searchKey.toUpperCase())) {
                            if (userSearch.findIndex(valueFind => valueFind.id === item.id) === -1)
                                userSearchRef.current.push(
                                    {
                                        id: item.id,
                                        data: item.data(),
                                    })
                        }
                    return null;
                })
                setTimeout(() => {
                    setUserSearch(userSearchRef.current)
                }, 500)
            })


            db.collection('tags').onSnapshot((snap) => {
                snap.docs.map(item => {
                    if (searchKey !== '')
                        if (item.data().name.toUpperCase().includes(searchKey.toUpperCase())) {
                            if (tagSearch.findIndex(valueFind => valueFind.id === item.id) === -1)
                                tagSearchRef.current.push(
                                    {
                                        id: item.id,
                                        data: item.data(),
                                    })
                        }
                    return null;
                })
                setTimeout(() => {
                    setTagSearch(tagSearchRef.current)
                }, 500)
            })
        }

    }
        , [valueSearch])
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

    const handleLogOut = () => {
        const check = window.confirm("Bạn muốn đăng xuất?", "Thông báo");
        if (check) {
            auth.signOut();
            history.push('/login');
        }
    }
    const handleSearchData = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    const handleOnChangeValueSearch = (e) => {
        setValueSearch(e.target.value);
        postSearchRef.current = [];
        questionSearchRef.current = [];
        userSearchRef.current = [];
        tagSearchRef.current = [];
        setPostSearch([])
        setQuestionSearch([])
        setUserSearch([])
        setTagSearch([])


    }
    const handleMovePage = (link) => {
        history.push(link)
    }

    const handleBlurSearch = () => {
        setModalSearch(false);
    }

    const truncate = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + " ..." : str;
    }

    const createContent = (key, content, classElement = "postSearch__item") => {
        const elementF = document.querySelector(`div.${classElement}.k${key}`);
        const element = document.createElement('div');

        if (elementF && elementF !== null) {
            elementF.innerHTML = ``;
            element.innerHTML = `${content}`;
            elementF.append(element);
            return;
        }

    }
    const countPost = (uid, id) => {
        const elementNumberPost = document.querySelector(`.countPost.k${id}`);
        let number = 0;
        db.collection('posts').onSnapshot(snap => {
            snap.docs.map(item => {
                if (item.data().uid === uid) {
                    number++;
                }
                return null;
            })

        })
        db.collection('questions').onSnapshot(snap => {
            snap.docs.map(item => {
                if (item.data().uid === uid) {
                    number++;
                }
                return null;
            })
        })
        setTimeout(() => {
            if (elementNumberPost || elementNumberPost !== null)
                elementNumberPost.innerHTML = `${number}`;
        }, 50)


    }

    const hightLightText = (text, str) => {
        return text.replace(str, `<p style={{color:'blue}}>${str}</p>`);
    }
    return (
        <div className="navbar">
            <div className="navbar__left">
                <img onClick={() => history.push('/')} src="https://viblo.asia/images/logo.png" alt="logo" className="navbar__left--logo" />
                <ul className="navbar__left--tabs">
                    <li><Link href="/" >Bài viết</Link></li>
                    <li><Link href="/question" >Hỏi đáp</Link></li>
                </ul>
            </div>
            <div className="navbar__right" >
                <FormSearch countPost={countPost} postSearch={postSearch} questionSearch={questionSearch}
                    userSearch={userSearch} tagSearch={tagSearch} valueSearch={valueSearch} handleSearchData={handleSearchData}
                    handleOnChangeValueSearch={handleOnChangeValueSearch} loading={loading} ModalSearch={ModalSearch}
                    handleMovePage={handleMovePage} createContent={createContent} truncate={truncate}
                    handleBlurSearch={handleBlurSearch}
                />
                <div className="navbar__right--tabs">
                    {user && (
                        <>
                            <Dropdown overlay={
                                <Menu className="notification__menu">
                                    {userLogin?.data?.notification && userLogin?.data?.notification.length > 0 ? (userLogin?.data?.notification?.slice().reverse().map((item, index) => (
                                        <Menu.Item onClick={() => history.push(item.link)} key={index}>
                                            <p style={{ marginBottom: '0' }}>{item.user} {item.title} </p>
                                            <Moment format="ddd DD/MM/YYYY hh:mm A" >{item?.timestamp?.seconds * 1000}</Moment>
                                        </Menu.Item>
                                    ))) : (<div className="empty__notification" key="notification">Hiện tại không có thông báo nào cả</div>)}

                                </Menu>
                            }
                                trigger={['click']} placement="bottomCenter" arrow>
                                <IconButton><Notifications /></IconButton>
                            </Dropdown>
                            <Dropdown overlay={
                                <Menu className="newpost__menu">
                                    <Menu.Item key="newpost">
                                        <div onClick={() => history.push('/push/newpost')} style={{ display: 'flex', alignItems: "center" }}><CreateOutlined /> <span style={{ marginLeft: "5px" }}>Viết bài</span></div>

                                    </Menu.Item>
                                    <Menu.Item key="newquestion">
                                        <div onClick={() => history.push('/push/newquestion')} style={{ display: 'flex', alignItems: "center" }}><HelpOutline /> <span style={{ marginLeft: "5px" }}>Đặt câu hỏi</span></div>
                                    </Menu.Item>
                                </Menu>
                            }
                                trigger={['click']} placement="bottomCenter" arrow>
                                <IconButton><EditOutlined /></IconButton>
                            </Dropdown>
                            <Dropdown overlay={
                                <Menu className="menu__avatar">
                                    <Menu.Item key="profile">
                                        <p className="menu__item" onClick={() => history.push(`/user/${user.uid}`)}>Trang cá nhân</p>
                                    </Menu.Item>
                                    <Menu.Item key="logout">
                                        <p className="menu__item" onClick={handleLogOut}>Logout</p>
                                    </Menu.Item>
                                </Menu>

                            } trigger={['click']} placement="bottomCenter" arrow>
                                <Avatar src={!user?.photoURL ? "" : user.photoURL} className="avatar">
                                    {(!user?.displayName ? "" : user.displayName?.charAt(0).toUpperCase())}</Avatar>
                            </Dropdown>
                        </>
                    )}

                    {!user ? <Button onClick={() => history.push('/login')} style={{ margin: "10px" }} type="primary">Login</Button> : ""}
                </div>

            </div>
        </div>
    )
}


export default Nav
