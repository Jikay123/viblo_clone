import { Button, Form, Input, Select } from 'antd';
import firebase from 'firebase';
import JoditEditor from 'jodit-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import db from '../../Firebase';
import Nav from '../Nav';
import './style.scss';


function NewPost({ type }) {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const editor = useRef(null);
    const [userLogin, setUserLogin] = useState('');

    const { Option } = Select;
    const history = useHistory();
    const [content, setContent] = useState('');
    const [listTag, setListTag] = useState([]);
    const children = useRef([]);
    const [tagsValue, setTagsValue] = useState('')


    useEffect(() => {
        db.collection('tags').onSnapshot((snapshot) => (
            [
                ...snapshot.docs.map((item) => (
                    children.current.push(<Option key={item.id} value={item.data().name}>{item.data().name}</Option>)
                )),
                setTimeout(() => {
                    setTags(children.current)
                }, 200),
                setTagsValue([...snapshot.docs.map((item) => ({ id: item.id, data: item.data().name }))])

            ]
        ))
    }, [children])


    function handleChange(value) {
        setListTag(value);
    }

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


    const handlePushPost = () => {
        db.collection(type).add({
            displayName: user.displayName,
            photoURL: user.photoURL,
            title: title,
            tags: listTag,
            content: content,
            uid: user.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            view: 0,
            point: 0,
            people: [],
            check: [],
        });
        if (type === "posts") {
            if (!userLogin.data.posts) {
                db.collection('users').doc(userLogin.id).update({
                    ...userLogin.data,
                    posts: 1,
                })
            } else {
                db.collection('users').doc(userLogin.id).update({
                    ...userLogin.data,
                    posts: userLogin.data.posts + 1,
                })
            }
        } else {
            if (!userLogin.data.questions) {
                db.collection('users').doc(userLogin.id).update({
                    ...userLogin.data,
                    questions: 1,
                })
            } else {
                db.collection('users').doc(userLogin.id).update({
                    ...userLogin.data,
                    questions: userLogin.data.questions + 1,
                })
            }
        }

        listTag.map((item) => {
            let index = tagsValue.findIndex(value => value.data === item);
            if (index === -1) {
                db.collection('tags').add({
                    name: item,
                })
            }
            return null;
        })
        type === "questions" ? history.push('/question') : history.push('/')

    }


    return (
        <div className="newpost">
            <Nav user={user} />
            <Form
                className="form__login"
                name="newpost"
                initialValues={{
                    remember: true,
                }}

            >
                <Form.Item
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Tiêu đề là trường bắt buộc!',
                        },
                    ]}
                >
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} className="input__title" placeholder="Tiêu đề" />
                </Form.Item>
                <Form.Item
                    name="tags"
                    rules={[
                        {
                            required: true,
                            message: 'Thẻ bài viết là trường bắt buộc!',
                        },
                    ]}
                >
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Gán thẻ bài viết của bạn."
                        onChange={handleChange}
                    >
                        {tags}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="content"
                    rules={[
                        {
                            required: true,
                            message: 'Nội dung là trường bắt buộc!',
                        },
                    ]}
                >
                    <JoditEditor
                        id="editor"
                        ref={editor}
                        tabIndex={1}
                        value={content}
                        onChange={(text) => {
                            setContent(text)
                        }}

                    // onBlur={newContent => setContent(newContent)}
                    />
                </Form.Item>
                <Form.Item
                >
                    <Button onClick={handlePushPost} className="button__submit" type="primary">{type === "questions" ? "Đặt câu hỏi" : "Viết Bài"}</Button>
                    <Button onClick={() => history.goBack()} className="button__cancel">Hủy</Button>
                </Form.Item>

            </Form>

        </div>
    )
}

export default NewPost
