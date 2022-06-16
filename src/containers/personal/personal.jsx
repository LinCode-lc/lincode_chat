import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Result, List, WhiteSpace, Button, Modal } from 'antd-mobile'
import Cookies from 'js-cookie'
import { resetUser } from '../../redux/action'
import './personal.css'
const Item = List.Item
const Brief = Item.Brief
class Personal extends Component {
    handleLogout = () => {
        Modal.alert('退出', '确认退出登录吗', [
            {
                text: '取消',

            },
            {
                text: '确认',
                onPress: () => {
                    //清除cookie的userid
                    Cookies.remove('userid')
                    //清除redux的user
                    this.props.resetUser()
                }
            }
        ])
    }
    render() {
        // console.log(this.props.user)
        const { username, info, salary, header, post, company } = this.props.user
        return (
            <div style={{ marginBottom: 50, marginTop: 50 }}>
                <Result
                    img={<div className="personHeader "><img src={`/images/${header}.jpg`} alt="header" /></div>}
                    title={username}
                    message={company}
                />
                <List renderHeader={() => '请输入相关信息'}>
                    <Item multipleLine>
                        <Brief>职位:&nbsp;&nbsp;{post}</Brief>
                        <Brief>简介:&nbsp;&nbsp;{info}</Brief>
                        {salary ? <Brief>薪资:&nbsp;&nbsp;{salary}</Brief> : null}
                    </Item>
                </List>
                <WhiteSpace></WhiteSpace>
                <List>
                    <Button type="warning" onClick={this.handleLogout}>退出登录</Button>
                </List>

            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { resetUser }
)(Personal)
