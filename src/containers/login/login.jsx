import React, { Component } from 'react'
import Logo from '../../components/logo/logo'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,

    Button,
} from 'antd-mobile'
import { connect } from 'react-redux'
import { login } from '../../redux/action'
import { Redirect } from 'react-router-dom'
// const ListItem = List.Item



class Login extends Component {
    state = {
        username: '',
        password: '',

    }
    login = () => {

        this.props.login(this.state)
    }
    handleChange = (name, val) => {
        //更新状态
        //因为这里传的name的字符串，所以要用[]接
        this.setState({
            [name]: val
        })
    }
    //跳转登录
    toRegister = () => {
        this.props.history.push('/register')

    }
    render() {

        // const { type } = this.state
        const { msg, redirectTo } = this.props.user

        if (redirectTo) {
            return <Redirect to={redirectTo} />
        }
        return (
            <div>
                <NavBar>广&nbsp;工 &nbsp;直 &nbsp;聘</NavBar>
                <Logo></Logo>
                <WingBlank>
                    <List>
                        {msg ? <div className="error-msg">{msg}</div> : null}
                        <WhiteSpace />
                        <InputItem placeholder="请输入用户名" onChange={val => { this.handleChange('username', val) }}>用户名:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder="请输入密码" type="password" onChange={val => { this.handleChange('password', val) }}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace />

                        <Button type="primary" onClick={this.login}>登&nbsp;&nbsp;&nbsp;录</Button>
                        <WhiteSpace />
                        <Button onClick={this.toRegister}>去注册</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    { login }
)(Login)
