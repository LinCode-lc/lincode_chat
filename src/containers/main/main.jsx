import React, { Component } from 'react'
import DashenInfo from '../dashen-info/dashen-info'
import LaobanInfo from '../laoban-info/laoban-info'
import Laoban from '../laoban/laoban'
import Dashen from '../dashen/dashen'
import Message from '../message/message'
import Personal from '../personal/personal'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Cookies from 'js-cookie' //set() get() remove()
import { getRedirectTo } from '../../utils/index'
import { getUser } from '../../redux/action'
import { NavBar } from 'antd-mobile'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../../containers/chat/chat'
class Main extends Component {
    navList = [
        {
            path: '/laoban',
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神'
        },
        {
            path: '/dashen',
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板'
        },
        {
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },
        {
            path: '/personal',
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人'
        },

    ]
    componentDidMount() {
        //  1.1如果cookie中有userid但redux中没有（即关闭过浏览器）,发请求获取对应的user
        const userid = Cookies.get('userid')
        const { id } = this.props.user
        if (userid && !id) {
            //发送异步请求，获取user
            this.props.getUser()
        }
    }
    render() {
        //render中不能执行异步
        //第一次执行render后会执行componentDidMount
        //检查是否登录的操作放在main,是因为main是用户主页和用户完善页的上级路由，可以一劳永逸
        // if (!this.props.user._id) {
        //     return <Redirect to={'/login'} />
        // }
        // console.log(this.props)
        //读取cookie中的userid
        const userid = Cookies.get('userid')
        //如果没有，自动重定向到登陆界面
        // debugger
        if (!userid) {
            return <Redirect to='/login' />
        }
        //如果有，读取redux中的user
        const { user, unReadCount } = this.props
        //如果redux中的user有_id,显示对应的界面
        if (user._id) {
            //如果请求的是根路径，根据user的type和header来计算出一个重定向的路由路径
            let path = this.props.location.pathname
            if (path === '/') {

                path = getRedirectTo(user.type, user.header)
                return <Redirect to={path} />
            }
        } else {
            return null
        }

        const { navList } = this

        const path = this.props.location.pathname
        const currentNav = navList.find(nav => nav.path === path)

        if (currentNav) {
            //决定哪个路由需要隐藏
            if (user.type === 'laoban') {
                navList[1].hide = true
            } else {
                navList[0].hide = true
            }
        }
        return (


            <div>
                {currentNav ? <NavBar className="sticky-header">{currentNav.title}</NavBar> : null}
                <Switch>
                    <Route path="/laoban" component={(props) => <Laoban {...props} />}></Route>
                    <Route path="/dashen" component={(props) => <Dashen {...props} />}></Route>
                    <Route path="/personal" component={(props) => <Personal {...props} />}></Route>
                    <Route path="/message" component={(props) => <Message {...props} />}></Route>
                    <Route path="/laobaninfo" component={(props) => <LaobanInfo {...props} />}></Route>
                    <Route path="/dasheninfo" component={(props) => <DashenInfo {...props} />}></Route>
                    <Route path="/chat/:userid" component={(props) => <Chat {...props} />}></Route>


                </Switch>
                {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}></NavFooter> : null}
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user, unReadCount: state.chat.unReadCount }),
    { getUser }
)(Main)

// 1.实现自动登录
//  1.1如果cookie中有userid但redux中没有（即关闭过浏览器）,发请求获取对应的user
//  1.2如果cookie中没有userid,自动进入Login界面
// 2.如果已经登录,重定向请求路径
//  2.1 根据user的type和header来计算一个重定向路径，并自动重定向