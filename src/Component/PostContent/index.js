import { Link } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp, QuestionAnswer, Reply, Visibility } from '@material-ui/icons';
import React from 'react';
import db from '../../Firebase';
import PostItem from './PostItem';
import './style.scss';

function PostContent({ type, data, dataExtra }) {
    const numberRef = React.useRef(null);


    return (
        <div className="post__content">
            <div className="content__main" >
                {data.map((item) => (
                    <PostItem item={item} key={item.id} type={type} />
                ))}
                <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet voluptatibus aspernatur officiis doloremque exercitationem ratione accusamus quia illo voluptates totam ut, similique debitis alias, impedit aliquid esse. In veniam ut animi nostrum nisi numquam voluptate. Eveniet quibusdam, quisquam, soluta sapiente nulla consectetur vel nam repellat eaque deserunt laboriosam, dolor facere asperiores molestiae consequuntur porro? Earum illo sapiente eaque qui perferendis. Natus, totam laboriosam sint nihil odit repellat. Iusto magni temporibus ea, velit harum veniam vel fugiat corporis quibusdam totam accusamus debitis a ipsum modi dolorum! Velit temporibus dolorem ullam neque, vitae id porro saepe. Laudantium beatae qui voluptates molestias quia sit quod sapiente nam, facilis ipsam debitis dicta rem incidunt hic quis amet, officiis vitae. Delectus voluptatum nesciunt nulla magnam ducimus, voluptas optio doloribus laudantium voluptatem dolorem quaerat! Libero aperiam ullam optio earum repudiandae ad. Possimus excepturi tenetur quibusdam nostrum non sit numquam nemo. Rerum, architecto! Officiis natus commodi officia, fugit voluptates exercitationem. Odit tempora, veritatis deserunt ducimus saepe tenetur facilis molestias tempore numquam quidem voluptate ipsum totam, velit, a accusamus ipsam voluptatum consequuntur autem possimus! Illum nemo animi alias. Facilis dolorum odit corporis rem eaque distinctio aperiam voluptas. Esse praesentium voluptates magnam libero facere molestias exercitationem nobis placeat provident veniam! Perspiciatis reprehenderit accusantium eius est, a, porro voluptas assumenda vel quasi accusamus inventore officia cumque. Reprehenderit numquam laudantium doloribus, doloremque at inventore reiciendis nihil unde assumenda, enim, labore odit! Exercitationem aut quae nesciunt minus voluptatem, animi, corporis placeat consequatur ab ipsam a assumenda quam deleniti cumque velit saepe natus sapiente delectus quidem maxime. Iure corrupti, maiores velit commodi delectus facere magnam nostrum, consequuntur ut laudantium, assumenda repellat consequatur saepe molestiae labore officia officiis. Architecto consequatur expedita ullam facere! Ut, dolor minima praesentium perspiciatis, blanditiis ipsum vero pariatur consequuntur mollitia voluptatem sit, ducimus hic? Expedita pariatur a reiciendis eius quos cupiditate aspernatur ipsa officiis placeat impedit accusantium molestias nostrum obcaecati eligendi error, sint possimus totam. Molestias sint consequatur esse modi itaque hic? Facilis illo quam quod deleniti ad temporibus eius, necessitatibus esse voluptates cum in ullam iure nulla autem aperiam officiis quibusdam reprehenderit magni! At necessitatibus assumenda sequi reiciendis consequuntur dolor quos tempora dolore voluptate enim, incidunt doloribus corporis optio, suscipit atque soluta. Qui ratione iure consectetur earum ipsum consequatur officia quidem dolorum quasi ad ab facere perferendis fugit a placeat animi reiciendis ipsa, est voluptatibus nostrum amet atque nam commodi temporibus? Hic a minus illo molestias laborum nostrum earum qui quas nam corporis et dolorem ullam commodi enim unde, blanditiis itaque assumenda fugiat pariatur tempora! Illum iste, libero praesentium quisquam ab ullam dignissimos obcaecati, nulla fugit rerum dolores accusantium sunt voluptas placeat asperiores neque beatae a tenetur consequuntur itaque, magni veritatis! Delectus eaque non quaerat nobis, dolores sunt porro vel exercitationem deleniti ut quas voluptates ea, possimus numquam aspernatur impedit at quisquam! Accusantium consequuntur voluptas quia dolorem! Voluptatem praesentium beatae voluptatum natus dolorum sint iusto unde, cumque, totam officia doloremque reprehenderit nam harum minus ea ipsa debitis provident laborum eius hic quia consectetur recusandae? Eum, blanditiis ab! Voluptatum, harum?</div>
            </div>
            <div className="content__right">
                <div className="content__first">
                    <Link className="title">{type === "posts" ? "Câu hỏi mới nhất" : "Bài viết mới nhất"}</Link>
                    <ul className="content__list">
                        {dataExtra.map((item) => (
                            <li className="content__item">
                                <h3>{item.data.title}</h3>
                                <div className="item__interacion">
                                    <div className="iteraction__vote">
                                        <ArrowDropUp className="up" />
                                        <ArrowDropDown className="down" />
                                        <span>{item.data.point}</span>
                                    </div>
                                    <div className="interaction__share">
                                        <Reply /><span>0</span>
                                    </div>
                                    <div className="interaction__view">
                                        <Visibility /> <span>0</span>
                                    </div>
                                    <div className="interaction__comment">
                                        <QuestionAnswer /><span>{ }</span>
                                    </div>
                                </div>
                                <p className="item__personName">{item.data.displayName}</p>
                            </li>
                        ))}


                        <li className="content__item">
                            <h3>Ai giúp tìm chó với....</h3>
                            <div className="item__interacion">
                                <div className="iteraction__vote">
                                    <ArrowDropUp className="up" />
                                    <ArrowDropDown className="down" />
                                    <span>0</span>
                                </div>
                                <div className="interaction__share">
                                    <Reply /><span>0</span>
                                </div>
                                <div className="interaction__view">
                                    <Visibility /> <span>0</span>
                                </div>
                                <div className="interaction__comment">
                                    <QuestionAnswer /><span>0</span>
                                </div>
                            </div>
                            <p className="item__personName">Nguyễn Văn A</p>
                        </li>

                        <li className="content__item">
                            <h3>Ai giúp tìm chó với....</h3>
                            <div className="item__interacion">
                                <div className="iteraction__vote">
                                    <ArrowDropUp className="up" />
                                    <ArrowDropDown className="down" />
                                    <span>0</span>
                                </div>
                                <div className="interaction__share">
                                    <Reply /><span>0</span>
                                </div>
                                <div className="interaction__view">
                                    <Visibility /> <span>0</span>
                                </div>
                                <div className="interaction__comment">
                                    <QuestionAnswer /><span>0</span>
                                </div>
                            </div>
                            <p className="item__personName">Nguyễn Văn A</p>
                        </li>

                        <li className="content__item">
                            <h3>Ai giúp tìm chó với....</h3>
                            <div className="item__interacion">
                                <div className="iteraction__vote">
                                    <ArrowDropUp className="up" />
                                    <ArrowDropDown className="down" />
                                    <span>0</span>
                                </div>
                                <div className="interaction__share">
                                    <Reply /><span>0</span>
                                </div>
                                <div className="interaction__view">
                                    <Visibility /> <span>0</span>
                                </div>
                                <div className="interaction__comment">
                                    <QuestionAnswer /><span>0</span>
                                </div>
                            </div>
                            <p className="item__personName">Nguyễn Văn A</p>
                        </li>
                        <li className="content__item">
                            <h3>Ai giúp tìm chó với....</h3>
                            <div className="item__interacion">
                                <div className="iteraction__vote">
                                    <ArrowDropUp className="up" />
                                    <ArrowDropDown className="down" />
                                    <span>0</span>
                                </div>
                                <div className="interaction__share">
                                    <Reply /><span>0</span>
                                </div>
                                <div className="interaction__view">
                                    <Visibility /> <span>0</span>
                                </div>
                                <div className="interaction__comment">
                                    <QuestionAnswer /><span>0</span>
                                </div>
                            </div>
                            <p className="item__personName">Nguyễn Văn A</p>
                        </li>
                        <li className="content__item">
                            <h3>Ai giúp tìm chó với....</h3>
                            <div className="item__interacion">
                                <div className="iteraction__vote">
                                    <ArrowDropUp className="up" />
                                    <ArrowDropDown className="down" />
                                    <span>0</span>
                                </div>
                                <div className="interaction__share">
                                    <Reply /><span>0</span>
                                </div>
                                <div className="interaction__view">
                                    <Visibility /> <span>0</span>
                                </div>
                                <div className="interaction__comment">
                                    <QuestionAnswer /><span>0</span>
                                </div>
                            </div>
                            <p className="item__personName">Nguyễn Văn A</p>
                        </li>
                        <li className="content__item">
                            <h3>Ai giúp tìm chó với....</h3>
                            <div className="item__interacion">
                                <div className="iteraction__vote">
                                    <ArrowDropUp className="up" />
                                    <ArrowDropDown className="down" />
                                    <span>0</span>
                                </div>
                                <div className="interaction__share">
                                    <Reply /><span>0</span>
                                </div>
                                <div className="interaction__view">
                                    <Visibility /> <span>0</span>
                                </div>
                                <div className="interaction__comment">
                                    <QuestionAnswer /><span>0</span>
                                </div>
                            </div>
                            <p className="item__personName">Nguyễn Văn A</p>
                        </li>
                        <li className="content__item">
                            <h3>Ai giúp tìm chó với....</h3>
                            <div className="item__interacion">
                                <div className="iteraction__vote">
                                    <ArrowDropUp className="up" />
                                    <ArrowDropDown className="down" />
                                    <span>0</span>
                                </div>
                                <div className="interaction__share">
                                    <Reply /><span>0</span>
                                </div>
                                <div className="interaction__view">
                                    <Visibility /> <span>0</span>
                                </div>
                                <div className="interaction__comment">
                                    <QuestionAnswer /><span>0</span>
                                </div>
                            </div>
                            <p className="item__personName">Nguyễn Văn A</p>
                        </li>

                    </ul>
                </div>

            </div>
        </div>
    )
}

export default PostContent
