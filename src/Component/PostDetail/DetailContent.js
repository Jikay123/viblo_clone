import { Bookmark, CreateOutlined, Facebook, ForumOutlined, PersonAdd, PlayArrow, Star, Twitter, VisibilityOffOutlined } from '@material-ui/icons';
import { Avatar, Button, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Moment from 'react-moment';
import db from '../../Firebase';
import { useHistory } from 'react-router-dom';

function DetailContent({ id, typeNews, content, handleBookmark, handleFollowUser, clickVote, userLogin, userWriteNews }) {

    const [showA, setShowA] = useState(false);
    const [number, setNumber] = useState('');
    const history = useHistory();

    const numberRef = useRef(null);
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                setShowA(true)
            } else {
                setShowA(false);
            }
        })
    }, [])

    useEffect(() => {
        const setValue =
            db.collection(typeNews).doc(id).collection('comments').onSnapshot((snap) => {
                if (snap) {
                    numberRef.current = snap.docs.length;
                    snap.docs.map((item) => {
                        db.collection(typeNews).doc(id).collection('comments').doc(item.id).collection('replys').onSnapshot((snapshot) => {
                            numberRef.current += snapshot.docs.length;
                        })
                        return null;
                    })
                }
                setTimeout(() => {
                    setNumber(numberRef.current)
                }, 200)
            })

        // db.collection(typeNews).onSnapshot((snap) => {
        //     snap.docs.map((item) => {
        //         // if(item.data)
        //     })
        // })

        return () => {
            setValue();
        }

    }, [id, typeNews])

    const handleBookmarkNews = () => {
        if (handleBookmark) {
            handleBookmark();
        }
    }

    const handleVote = (e, type) => {
        if (clickVote) {
            clickVote(e, type);
        }
    }

    const handleFollow = () => {
        if (handleFollowUser) {
            handleFollowUser();
        }
    }

    const foundIndex = () => {
        return userWriteNews?.data?.fan?.findIndex(item => item.uid === userLogin?.data?.uid);
    }

    const movePageTag = (name) => {
        db.collection('tags').onSnapshot(snap => {
            snap.docs.map((item) => {
                if (item.data().name === name) {
                    history.push(`/tags/${item.id}`);
                }
                return null;
            })
        })
    }


    return (
        <div className="detail__content">
            <div className="left">
                {showA && (<Avatar className="avatar" src={content?.photoURL}>{content?.displayName?.charAt(0).toUpperCase()}</Avatar>)}
                <div className="point">
                    <Tooltip placement="right" title="Upvote">
                        <PlayArrow onClick={(e) => handleVote(e, 'plus')} className="plus" />
                    </Tooltip>
                    <p>{content?.point}</p>
                    <Tooltip placement="right" title="Downvote">
                        <PlayArrow onClick={(e) => handleVote(e, 'sub')} className="sub" />
                    </Tooltip>
                </div>
                <Tooltip placement="right" title="Bookmark bài viết này">
                    <Button onClick={() => handleBookmarkNews()} className={`medium bookmart 
                ${userLogin?.data?.bookmark?.findIndex((item) => item.id === id) >= 0 && "active"}`}>
                        <Bookmark />
                    </Button>
                </Tooltip>
                <Button className="medium">
                    A
                </Button>
                <Tooltip placement="right" title="Chia sẻ bài viết trên facebook">
                    <Button className="small">
                        <Facebook />
                    </Button>
                </Tooltip>
                <Tooltip placement="right" title="Chia sẻ bài viết trên twitter">
                    <Button className="small">
                        <Twitter />
                    </Button>
                </Tooltip>

            </div>
            <div className="main">
                <div className="main__info">
                    <Avatar src={content?.photoURL} className="avatar">{content?.displayName && content?.displayName.charAt(0).toUpperCase()}</Avatar>
                    <div className="main__info--title">
                        <div className="title__first">
                            <div style={{ display: 'flex' }}>
                                <h3>{content?.displayName} </h3>
                                {userLogin?.data?.uid !== content?.uid && (<Button style={{ marginLeft: '0', display: 'inline-block' }} className={`follow ${foundIndex() !== -1 ? "active" : ""}`} onClick={() => handleFollow()} >{foundIndex() !== -1 ? "Đang theo dõi" : "Theo dõi"}</Button>)}
                            </div>
                            <p>Đăng đã vào time <Moment unix format="HH:mm:A ddd DD/MM/YYYY">{content?.timestamp?.seconds}</Moment></p>
                        </div>
                        <div className="title__second">
                            <div className="title__second--left">
                                <Tooltip placement="bottom" title="Reputations: 0">
                                    <div className="item">
                                        <Star /> <span>0</span>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom" title="Người theo dõi: 0">

                                    <div className="item">
                                        <PersonAdd /> <span>0</span>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom" title="Bài viết: 0">
                                    <div className="item">
                                        <CreateOutlined /> <span>0</span>
                                    </div>
                                </Tooltip>
                            </div>
                            <div className="title__second--right">
                                <Tooltip placement="bottom" title="Lượt xem: 0">
                                    <div className="item">
                                        <VisibilityOffOutlined /> <span>0</span>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom" title="Lượt bình luận: 0">
                                    <div className="item">
                                        <ForumOutlined /> <span>{!number ? 0 : number}</span>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom" title={`Danh sách người bookmark: ${content?.bookmark?.length}`}>
                                    <div className="item">
                                        <Bookmark /> <span>{content?.bookmark?.length}</span>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content">
                    <h1 style={{ fontSize: "45px", fontWeight: "bold" }} className="title">{content?.title}</h1>
                    <div className="content__main">

                    </div>
                    <div className="listTag" style={{ display: 'flex' }}>
                        {content?.tags?.map(item => (
                            <div onClick={() => movePageTag(item)} className="listTag__item" key={new Date(Date.now)}>
                                {item}
                            </div>
                        ))}
                    </div>
                    <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet voluptatibus aspernatur officiis doloremque exercitationem ratione accusamus quia illo voluptates totam ut, similique debitis alias, impedit aliquid esse. In veniam ut animi nostrum nisi numquam voluptate. Eveniet quibusdam, quisquam, soluta sapiente nulla consectetur vel nam repellat eaque deserunt laboriosam, dolor facere asperiores molestiae consequuntur porro? Earum illo sapiente eaque qui perferendis. Natus, totam laboriosam sint nihil odit repellat. Iusto magni temporibus ea, velit harum veniam vel fugiat corporis quibusdam totam accusamus debitis a ipsum modi dolorum! Velit temporibus dolorem ullam neque, vitae id porro saepe. Laudantium beatae qui voluptates molestias quia sit quod sapiente nam, facilis ipsam debitis dicta rem incidunt hic quis amet, officiis vitae. Delectus voluptatum nesciunt nulla magnam ducimus, voluptas optio doloribus laudantium voluptatem dolorem quaerat! Libero aperiam ullam optio earum repudiandae ad. Possimus excepturi tenetur quibusdam nostrum non sit numquam nemo. Rerum, architecto! Officiis natus commodi officia, fugit voluptates exercitationem. Odit tempora, veritatis deserunt ducimus saepe tenetur facilis molestias tempore numquam quidem voluptate ipsum totam, velit, a accusamus ipsam voluptatum consequuntur autem possimus! Illum nemo animi alias. Facilis dolorum odit corporis rem eaque distinctio aperiam voluptas. Esse praesentium voluptates magnam libero facere molestias exercitationem nobis placeat provident veniam! Perspiciatis reprehenderit accusantium eius est, a, porro voluptas assumenda vel quasi accusamus inventore officia cumque. Reprehenderit numquam laudantium doloribus, doloremque at inventore reiciendis nihil unde assumenda, enim, labore odit! Exercitationem aut quae nesciunt minus voluptatem, animi, corporis placeat consequatur ab ipsam a assumenda quam deleniti cumque velit saepe natus sapiente delectus quidem maxime. Iure corrupti, maiores velit commodi delectus facere magnam nostrum, consequuntur ut laudantium, assumenda repellat consequatur saepe molestiae labore officia officiis. Architecto consequatur expedita ullam facere! Ut, dolor minima praesentium perspiciatis, blanditiis ipsum vero pariatur consequuntur mollitia voluptatem sit, ducimus hic? Expedita pariatur a reiciendis eius quos cupiditate aspernatur ipsa officiis placeat impedit accusantium molestias nostrum obcaecati eligendi error, sint possimus totam. Molestias sint consequatur esse modi itaque hic? Facilis illo quam quod deleniti ad temporibus eius, necessitatibus esse voluptates cum in ullam iure nulla autem aperiam officiis quibusdam reprehenderit magni! At necessitatibus assumenda sequi reiciendis consequuntur dolor quos tempora dolore voluptate enim, incidunt doloribus corporis optio, suscipit atque soluta. Qui ratione iure consectetur earum ipsum consequatur officia quidem dolorum quasi ad ab facere perferendis fugit a placeat animi reiciendis ipsa, est voluptatibus nostrum amet atque nam commodi temporibus? Hic a minus illo molestias laborum nostrum earum qui quas nam corporis et dolorem ullam commodi enim unde, blanditiis itaque assumenda fugiat pariatur tempora! Illum iste, libero praesentium quisquam ab ullam dignissimos obcaecati, nulla fugit rerum dolores accusantium sunt voluptas placeat asperiores neque beatae a tenetur consequuntur itaque, magni veritatis! Delectus eaque non quaerat nobis, dolores sunt porro vel exercitationem deleniti ut quas voluptates ea, possimus numquam aspernatur impedit at quisquam! Accusantium consequuntur voluptas quia dolorem! Voluptatem praesentium beatae voluptatum natus dolorum sint iusto unde, cumque, totam officia doloremque reprehenderit nam harum minus ea ipsa debitis provident laborum eius hic quia consectetur recusandae? Eum, blanditiis ab! Voluptatum, harum?</div>

                </div>
            </div>

        </div>

    )
}

export default DetailContent
