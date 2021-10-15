import { Link } from '@material-ui/core';
import { Facebook, GitHub, Lock, Person } from '@material-ui/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import db, { auth } from '../../Firebase';
import firebase from 'firebase';
import './style.scss';

const providerGoogle = new firebase.auth.GoogleAuthProvider();
const providerFB = new firebase.auth.FacebookAuthProvider();

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email, password)
            .then((history.push('/'))).catch((e) => {
                history.push('/login')
                setTimeout(() => {
                    alert(e.message)
                }, 1)
            });
    }
    const handleLoginWithGoogle = async () => {
        const login = await auth.signInWithPopup(providerGoogle)
        const { additionalUserInfo, user } = login;
        if (additionalUserInfo.isNewUser) {
            db.collection('users').add({
                displayName: user.displayName,
                photoURL: user.photoURL,
                email: user.email,
                timestampe: firebase.firestore.FieldValue.serverTimestamp(),
                uid: user.uid,
                notification: []
            })
        }
        if (login) {
            history.push('/');
        }
    }
    const handleLoginWithFB = async () => {
        const login = await auth.signInWithPopup(providerFB);
        const { additionalUserInfo, user } = login;
        if (additionalUserInfo.isNewUser) {
            db.collection('users').add({
                displayName: user.displayName,
                photoURL: user.photoURL,
                email: user.email,
                timestampe: firebase.firestore.FieldValue.serverTimestamp(),
                uid: user.uid,
                notification: []
            })
        }
        if (login) {
            history.push('/');
        }
    }

    useEffect(() => {
        const check = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                history.push('/');
            }
        })
        return () => check();
    }, [history])


    return (
        <div className="login">
            <div className="login__top">
                <img width="100px" src="https://accounts.viblo.asia/assets/webpack/logo.fbfe575.svg" alt="" />
                <h3>Đăng nhập với Viblo</h3>
            </div>
            <Form
                className="form__login"
                name="login"
                initialValues={{
                    remember: true,
                }}
                onFinish={handleLogin}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Email là trường bắt buộc!',
                        },
                    ]}
                >
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="input__login" prefix={<Person />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Password là trường bắt buộc!',
                        },
                    ]}
                >
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} className="input__login" prefix={<Lock />} placeholder="Password" />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"

                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button className="button__submit" type="primary" htmlType="submit">
                        Đăng nhập
                    </Button>
                    <div className="button__control ">
                        <Link >Quên mật khẩu</Link>
                        <Link href="/register" >Tạo tài khoản</Link>
                    </div>
                </Form.Item>
                <Form.Item className="login__social">
                    <h3 className="title">Đăng nhập bằng</h3>
                    <div className="login__social--item">
                        <Button onClick={handleLoginWithFB} icon={<Facebook />} type="default">Facebook</Button>
                        <Button onClick={handleLoginWithGoogle} icon={<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
                            alt="icon" width="20px" />} type="default">Google</Button>
                        <Button icon={<GitHub />} type="default">Github</Button>
                    </div>
                </Form.Item>
            </Form>

        </div>
    );

}

export default Login
