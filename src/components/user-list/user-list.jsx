import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { WingBlank, WhiteSpace, Card, } from 'antd-mobile'
import './user-list.css'
import { withRouter } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
const Header = Card.Header
const Body = Card.Body
class UserList extends Component {
    static propTypes = {
        userList: PropTypes.array.isRequired
    }
    render() {
        const { userList } = this.props
        // console.log(userList)
        return (
            <WingBlank style={{ marginBottom: 50, marginTop: 50 }}>
                <QueueAnim type="scale" >
                    {
                        userList.map(user =>
                            <div key={user._id}>
                                <WhiteSpace></WhiteSpace>
                                <Card onClick={() => { this.props.history.push(`/chat/${user._id}`) }}>
                                    <Header thumb={<div className="header"><img src={`/images/${user.header}.jpg`} /></div>}
                                        extra={user.username}>

                                    </Header>
                                    <Body>
                                        <div>职位:&nbsp;&nbsp;{user.post}</div>
                                        {user.company ? <div>公司:&nbsp;&nbsp;{user.company}</div> : null}
                                        {user.salary ? <div>薪资:&nbsp;&nbsp;{user.salary}</div> : null}
                                        <div>描述:&nbsp;&nbsp;{user.info}</div>
                                    </Body>
                                </Card>
                            </div>
                        )
                    }
                </QueueAnim>
            </WingBlank>
        )
    }
}
export default withRouter(UserList)