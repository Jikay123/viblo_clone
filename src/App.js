import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NewPost from './Component/NewPost';
import PostDetail from './Component/PostDetail';
import Posts from './Component/Posts';
import Tags from './Component/Tags';
import TagDetail from './Component/Tags/TagDetail';
import Login from './Component/User/Login';
import Profile from './Component/User/Profile';
import Register from './Component/User/Register';
import ScrollTop from './ScrollTop';

function App() {

  return (
    <Router>
      <ScrollTop />
      <Switch>
        <Route path="/" exact >
          <Posts type="posts" />
        </Route>
        <Route path="/question" exact >
          <Posts type="questions" />
        </Route>
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/push/newpost" exact >
          <NewPost type="posts" />
        </Route>
        <Route path="/push/newquestion" exact  >
          <NewPost type="questions" />
        </Route>
        <Route path="/posts/:id" exact  >
          <PostDetail typeNews="posts" />
        </Route>
        <Route path="/questions/:id" exact  >
          <PostDetail typeNews="questions" />
        </Route>
        <Route path="/tags/:id" exact  >
          <TagDetail />
        </Route>
        <Route path="/tags" exact  >
          <Tags />
        </Route>
        <Route path="/user/:id" exact  >
          <Profile />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
