import { Copyright, Facebook, GitHub } from '@material-ui/icons';
import { Select } from 'antd';
// import { Option } from 'antd/lib/mentions';
import React from 'react';
import './style.scss';
function Footer() {
    const data = ["Tiếng Việt", "english"];
    const { Option } = Select;
    return (
        <div className="footer">
            <div className="footer__top">
                <div className="footer__top--left">
                    <h2>Tài nguyên</h2>
                    <div className="text">
                        <p>Bài viết</p>
                        <p>Câu hỏi</p>
                        <p>Videos</p>
                        <p>Thảo luận</p>
                        <p>Công cụ</p>
                        <p>Trạng thái hệ thống</p>
                        <p>Tổ chức</p>
                        <p>Tags</p>
                        <p>Tác giả</p>
                        <p>Đề xuất hệ thống</p>
                        <p>Machine learning</p>
                    </div>
                </div>
                <div className="footer__top--center">
                    <h2>Dịch vụ</h2>
                    <div className="item">
                        <img src="https://viblo.asia/images/viblo-code.svg" alt="" width="30px" />
                        <span>Viblo code</span>
                    </div>
                    <div className="item">
                        <img src="https://viblo.asia/images/viblo-cv.svg" alt="" width="30px" />
                        <span>Viblo CV</span>
                    </div>
                    <div className="item">
                        <img src="https://viblo.asia/images/viblo-ctf.png" alt="" width="30px" />
                        <span>Viblo CTF</span>
                    </div>
                    <div className="item">
                        <img src="https://viblo.asia/images/learn.svg" alt="" width="30px" />
                        <span>Viblo Learning</span>
                    </div>

                </div>
                <div className="footer__top--right">
                    <div className="mobile">
                        <h2>Ứng dụng di động</h2>
                        <div style={{ display: 'flex' }}>
                            <div className="store">
                                <img style={{ display: 'block' }} width="150px" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="" />
                                <img style={{ display: 'block', margin: "10px" }} width="130px" src="https://viblo.asia/_nuxt/img/app-store-badge.8c4986ee4828b47d16f5cd694ef065f2.svg" alt="" />
                            </div>
                            <div className="QRcode">
                                <img width="120px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAB8CAIAAAAkfEPpAAACEklEQVR42u3aUY6DMAwFQO5/6e4JKhXF7yUL488KBZhEcm1zfUQ9LgTQoYsC+hWIb+t/faCb19x9hp9Q0g7QoUOHXkZfShRDL/wLxMp9p9a5vT506NChb0RPJ8yVNaeSc9MBOnTo0N+CvgKdKI6gQ4cOHfoMysrzJBpz0KFDh/4E9EQimmqcJYqmR3UZoUOHDn1jgjrt98d+DQAdOvTHozcjsZGJxlzk3aFDhw69jN5Mqol10odjrDiCDh069DL6yjXpYfTUvarFIHTo0KEX0KcGAlMD6MSgIz0Qv10cQYcOHXoBfaphlG5UNRPs2AGFDh069I3oTaxE46xZfI19DQAdOnTog+iJwmQlwSaKo+ahgQ4dOvTT0acKimaynTpMS4cAOnTo0AvozRdrbmT6cNz+EwEdOnToG9F3DSjSSb45DIEOHTr0NnpiEJwoRtKIiaEKdOjQoZ+Inn7QxMZMDVjGng06dOjQD0FPFDVTiTqNODU0hw4dOvRT0CMNoOKHPitF1timQocOHXoBPR1TELuG6ZGGF3To0KEXvk+fiubQ+YRCb+nfC3To0KGH0BMJMz3QmDociQIQOnTo0E9BTyfM9NAg0fBa2jzo0KFDfxj6rmsSGwkdOnTob0dPI6Ybdo8qjqBDh/4q9PRgYaqQSQ/QoUOHDv2/oqcbQFPJNp14E4cJOnTo0BvoohPQoUMXofgD+J8kMHoXlkcAAAAASUVORK5CYII=" alt="qrcode" />
                            </div>
                        </div>
                    </div>
                    <div className="social">
                        <h2>Liên kết</h2>
                        <Facebook style={{ margin: "10px" }} />
                        <GitHub style={{ margin: "10px" }} />
                    </div>
                </div>
            </div>
            <div className="footer__bottom">
                <Select className="bottom__select" defaultValue={data[0]}>
                    {data.map((item, index) => (
                        <Option key={index} value={item}>{item}</Option>
                    ))}
                </Select>

                <div className="bottom__right">
                    <p>Về chúng tôi</p>
                    <p>Phản hồi</p>
                    <p>Giúp đỡn</p>
                    <p>FAQs</p>
                    <p>RSS</p>
                    <p>Điều khoản</p>
                    <p><img src="https://images.dmca.com/Badges/dmca-badge-w100-5x1-07.png?ID=41818fcd-5a60-4504-867a-38fde606354e" alt="img" /></p>
                    <p><Copyright /> <strong style={{ margin: "0px 5px" }}>Viblo</strong>2021 </p>
                </div>
            </div>
        </div>
    )
}

export default Footer
