/* eslint-disable no-sequences */
import { Facebook, GitHub } from '@material-ui/icons';
import { Checkbox, Input, Button, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import db, { auth } from '../../Firebase/index';
import firebase from 'firebase';
import { useHistory } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [repasswod, setRepassword] = useState('');
    const [check, setCheck] = useState(false);
    const history = useHistory();

    const handleSigup = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return (
                    db.collection('users').add({
                        displayName: name,
                        email: email,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        uid: authUser.user.uid,
                        notification: []
                    }),
                    authUser.user.updateProfile({
                        displayName: name,
                    }),
                    onFinish()

                )
            }).catch((e) => console.error(e.message));
    }

    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            if (authUser)
                history.push('/');
        })
    }, [history])

    const onFinish = () => {
        setTimeout(() => {
            history.push('/');
        }, 200)
    };

    const onFinishFailed = (errorInfo) => {
        alert('Failed:', errorInfo);
    };
    return (
        <div className="register">
            <img className="logo" width="120px" src="https://accounts.viblo.asia/assets/webpack/logo.fbfe575.svg" alt="logo" />

            <Form
                className="form__register"
                name="register"
                onFinish={handleSigup}
                onFinishFailed={onFinishFailed}
            >
                <div className="subTitle">
                    <h2>Đăng ký tài khoản cho Viblo</h2>
                    <h4>
                        Chào mừng bạn đến <strong> Nền tảng Viblo!</strong> Tham gia cùng chúng tôi để tìm kiếm thông tin hữu ích cần thiết để cải thiện kỹ năng IT của bạn. Vui lòng điền thông tin của bạn vào biểu mẫu bên dưới để tiếp tục.
                    </h4>
                </div>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Tên là bắt buộc!"
                        }
                    ]}
                >
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="input__register" placeholder="Tên của bạn" />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Email là trường bắt buộc!"
                        }
                    ]}
                >
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="input__register" placeholder="Địa chỉ email của bạn" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={
                        [
                            {
                                required: true,
                                message: "password là bắt buộc!"
                            }

                        ]
                    }
                >
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} className="input__register" placeholder="Mật khẩu của bạn" />
                </Form.Item>
                <Form.Item
                    name="re-password"
                    rules={
                        [
                            {
                                required: true,
                                message: "re-password là bắt buộc!"
                            }

                        ]
                    }
                >
                    <Input.Password value={repasswod} onChange={(e) => setRepassword(e.target.value)} className="input__register" placeholder="Nhập mật khẩu của bạn" />
                </Form.Item>
                <Form.Item
                    name="check"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error("Vui lòng đồng ý với điều khoản của chúng tôi!")),

                        },
                    ]}

                >
                    <Checkbox value={check} onChange={() => setCheck(!check)} >Tôi đồng ý <span>Điều khoản của dịch vụ</span></Checkbox>
                </Form.Item>
                <Form.Item >
                    <Button className="button__submit" disabled={!check} type="primary" htmlType="submit">Đăng ký</Button>
                </Form.Item>
                <Form.Item className="login__social">
                    <h3 className="title">Đăng nhập bằng</h3>
                    <div className="login__social--item">
                        <Button icon={<Facebook />} type="default">Facebook</Button>
                        <Button icon={<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
                            alt="icon" width="20px" />} type="default">Google</Button>
                        <Button icon={<GitHub />} type="default">Github</Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Register
