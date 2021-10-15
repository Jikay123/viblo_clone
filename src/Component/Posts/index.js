import React, { useContext, useEffect, useState } from 'react'
import ButtonScrollTop from '../../ButtonScrollTop'
import { UserContext } from '../../Context/UserContext'
import db from '../../Firebase'
import Footer from '../Footer'
import Nav from '../Nav'
import PostContent from '../PostContent'
import Tabs from '../Tabs'

function Posts({ type }) {
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [tabPost, setTabPost] = useState(["Mới nhất",
        "Đang theo dõi",])
    const [tabQuestion, setTabQuestion] = useState(["Mới nhất",
        "Chưa giải quyết",
        "Đang theo dõi"])

    useEffect(() => {
        if (user) {
            setTabPost([...tabPost, "Bookmark của tôi"])
            setTabQuestion([...tabQuestion, "Bookmark của tôi"])
        }
    }, [user])

    useEffect(() => {
        const crible = db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snap) => (
            setPosts([
                ...snap.docs.map((item) => (
                    { id: item.id, data: item.data() }))
            ])
        ))
        const check = db.collection('questions').orderBy('timestamp', 'desc').onSnapshot((snap) => (
            setQuestions([
                ...snap.docs.map((item) => ({ id: item.id, data: item.data() }))
            ])
        ))

        return () => {
            crible();
            check();
        }
    }, [])

    return (
        <div className="post" style={{ position: 'relative' }}>
            <ButtonScrollTop />
            <Nav />
            <Tabs data={type === "posts" ? tabPost : tabQuestion} user={user} type={type} />
            <PostContent data={type === "posts" ? posts : questions} type={type} dataExtra={type === "posts" ? questions : posts} />
            <Footer />
        </div>
    )
}

export default Posts
