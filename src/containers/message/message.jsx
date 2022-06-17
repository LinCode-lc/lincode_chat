import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Badge, List } from 'antd-mobile';
import { getUserList } from '../../redux/action'
import './message.css'
const Item = List.Item
const Brief = List.Item.Brief
//对chatMsg按chat_id进行分组，并得到每个组的lastMsg组成的数组
// 1找出每个聊天的LastMsg,并用一个对象容器保存{chat_id,lastMsg}
// 2得到所有LastMsg的数组
// 3对数组进行排序(按creat_time降序)
function getLastMsgs(chatMsgs, userid) {
    let lastMsgObjs = {}
    chatMsgs.forEach(element => {
        // console.log(element)
        if (element.to === userid && !element.read) {
            element.unReadCount = 1
        } else {
            element.unReadCount = 0
        }

        if (lastMsgObjs[element.chat_id]) {
            //保存已经统计的未读数量
            // console.log(11111)
            let preUnReadCount = lastMsgObjs[element.chat_id].unReadCount
            if (lastMsgObjs[element.chat_id].create_time < element.create_time) {
                lastMsgObjs[element.chat_id] = element
            }
            //累加
            lastMsgObjs[element.chat_id].unReadCount = preUnReadCount + element.unReadCount

        } else {
            lastMsgObjs[element.chat_id] = element
        }

    });
    //得到所有的LastMsg数组
    const lastMsgs = Object.values(lastMsgObjs)
    //排序
    lastMsgs.sort(function (m1, m2) {  //如果小于零，将m1放前面
        return m2.create_time - m1.create_time

    })
    // console.log(lastMsgs)
    return lastMsgs
}
class Message extends Component {

    render() {



        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        //对chatMsgs按chat_id进行分组
        const lastMsgs = getLastMsgs(chatMsgs, user._id)

        return (
            <List style={{ marginTop: 50, marginBottom: 50 }}>
                {lastMsgs.map(msg => {
                    const targetUserId = msg.to === user._id ? msg.from : msg.to
                    let targetUser = msg.to === user._id ? users[msg.from] : users[msg.to]



                    const header = targetUser.header ? `/images/${targetUser.header}.jpg` : null

                    return (
                        <Item
                            key={msg._id}
                            extra={<Badge text={msg.unReadCount} />}
                            thumb={<div className='messageHeader'><img src={header} /></div>}
                            arrow='horizontal'
                            onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
                        >
                            {targetUser.username}
                            <Brief>
                                {msg.content}

                            </Brief>
                        </Item>
                    )
                }

                )}
            </List>
        )
    }
}
export default connect(
    state => ({
        user: state.user,
        chat: state.chat,
        userList: state.userList
    }),
    { getUserList }
)(Message)
