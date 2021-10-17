import { ArrowDropDown, ArrowDropUp, Check, ForumOutlined, Reply, Visibility } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import db from '../../Firebase';

const ExtraContent = ({ item, type }) => {
    const [number, setNumber] = useState('');
    const numberRef = useRef(null);
    const [checkRespect, setCheckRespect] = useState(false);
    let typeNews = '';
    const history = useHistory();

    if (type === "posts") {
        typeNews = 'questions'
    } else {
        typeNews = 'posts'
    }

    useEffect(() => {
        const setValue =
            db.collection(typeNews).doc(item.id).collection('comments').onSnapshot((snap) => {
                if (snap) {
                    numberRef.current = snap.docs.length;
                    snap.docs.map((item) => {
                        db.collection(typeNews).doc(item.id).collection('comments').doc(item.id).collection('replys').onSnapshot((snapshot) => {
                            numberRef.current += snapshot.docs.length;
                        })
                        return null;
                    })
                }
                setTimeout(() => {
                    setNumber(numberRef.current)
                }, 200)
            })
        const setValueComment =
            db.collection(typeNews).doc(item.id).collection('comments').onSnapshot((snap) => {
                if (snap) {
                    numberRef.current = snap.docs.length;
                    snap.docs.map((itemSnap) => {
                        db.collection(typeNews).doc(item.id).collection('comments').doc(itemSnap.id).collection('replys').onSnapshot((snapshot) => {
                            numberRef.current += snapshot.docs.length;
                        })
                        if (itemSnap.data().respect) {
                            setCheckRespect(true)
                        }
                        return null;
                    })
                }
                setTimeout(() => {
                    setNumber(numberRef.current);
                }, 200)
            })

        return () => {
            setValue();
            setValueComment();
        }

    }, [item.id, typeNews])
    console.log(item, !type, "12")
    return (
        <li className="content__item">
            <h3 style={{ cursor: 'pointer' }} onClick={() => history.push(`${typeNews}/${item.id}`)}>{item.data.title}</h3>
            <div className="item__interacion">
                <div className="iteraction__vote">
                    <ArrowDropUp className="up" />
                    <ArrowDropDown className="down" />
                    <span>{item.data.point}</span>
                </div>
                <div className="interaction__view">
                    <Visibility /> <span>0</span>
                </div>
                <div className="interaction__comment">
                    {type === "questions" ? <ForumOutlined /> : (checkRespect === true ? <Check style={{ color: 'green' }} /> : <Reply />)} <span>{!number ? 0 : number}</span>
                </div>
            </div>
            <p className="item__personName">{item.data.displayName}</p>
        </li>
    )
}

export default ExtraContent
