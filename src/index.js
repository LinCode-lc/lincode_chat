import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom'
// import App from './App';
import Login from './containers/login/login';
import Main from './containers/main/main';
import Register from './containers/register/register';

import './assets/css/index.css'
//引入store
import { Provider } from 'react-redux'
import store from './redux/store'
//最后在最外层包provider,再传入store
// import './test/socketio_test'
ReactDOM.render(

  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path="/login" component={(props) => <Login {...props} />}></Route>
        <Route path="/register" component={(props) => <Register {...props} />}></Route>
        <Route path="/" component={(props) => <Main {...props} />}></Route>  {/* 默认组件 */}


      </Switch>
    </HashRouter>
  </Provider>
  ,
  document.getElementById('root')
);


