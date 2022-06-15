import React, { Component } from 'react'
import { connect } from 'react-redux'
import { InputItem, List, NavBar, Grid, Icon } from 'antd-mobile'

import { sendMsg, readMsg } from '../../redux/action'
const Item = List.Item
class Chat extends Component {
    state = {
        connect: "",
        isShow: false, //是否显示表情列表
    }

    handleSend = () => {
        //收集数据
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content.trim()
        //发送消息
        if (content) {
            console.log(from)
            console.log(to)
            console.log(content)
            this.props.sendMsg({ from, to, content })
            this.setState({ content: '', isShow: false })
        }
    }
    toggleShow = () => {
        const isShow = !this.state.isShow
        this.setState({ isShow })
        if (isShow) {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    }
    //选择表情
    chooseEmoji = (item) => {

        if (this.state.content) {
            this.setState({ content: this.state.content + item.text })
        } else {
            this.setState({ content: item.text })
        }

    }
    //在第一次render之前调用
    componentWillMount() {
        //初始化表情列表数据
        const emojis = ["😀", "😃", "😄", "😁", "😆", "🤣", "😂", "🙂", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😶", "😏", "😒", "🙄", "😬"]
        this.emojis = emojis.map(emoji => ({ text: emoji }))
    }

    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight)

    }
    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentWillUnmount() {
        //发请求更新消息的未读
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from, to)
    }
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat

        //计算当前聊天的chat_id
        const meId = user._id
        const targetId = this.props.match.params.userid

        //如果还没获取到数据，不做任何显示
        if (!users[meId]) {
            return null
        }
        const chatId = [meId, targetId].sort().join('_')
        const msgs = chatMsgs.filter(val => val.chat_id === chatId)

        const header = users[targetId].header ? `/images/${users[targetId].header}.jpg` : null
        const targetName = users[targetId].username

        return (
            <div id="chat-page">
                <NavBar icon={<Icon type='left' />}
                    className='sticky-header'
                    onLeftClick={() => { this.props.history.goBack() }}
                >{targetName}</NavBar>

                <List style={{ marginTop: 50, marginBottom: 50 }}>

                    {msgs.map(msg => {
                        if (meId === msg.to) {
                            return (
                                <Item
                                    key={msg._id}
                                    thumb={<div className="header2"><img src={header} /></div>}
                                >
                                    {msg.content}
                                </Item>
                            )
                        } else {
                            return (
                                <Item
                                    key={msg._id}
                                    className="chat-me"
                                    extra='我'
                                >
                                    {msg.content}
                                </Item>
                            )
                        }
                    })}

                </List>

                <div className="am-tab-bar">
                    <InputItem
                        placeholder="请输入"
                        onChange={val => this.setState({ content: val })}
                        value={this.state.content}
                        onFocus={() => { this.setState({ isShow: false }) }}
                        extra={
                            <span>
                                <span onClick={this.toggleShow} style={{ marginRight: 5 }}>🙂</span>
                                <span onClick={this.handleSend}>发送</span>

                            </span>
                        }>
                    </InputItem>

                    {this.state.isShow ? (<Grid
                        data={this.emojis}
                        columnNum={8}
                        carouselMaxRow={4}
                        isCarousel={true}
                        onClick={(item) => {
                            this.chooseEmoji(item)
                        }}
                    ></Grid>) : null}
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user, chat: state.chat }),
    { sendMsg, readMsg }
)
    (Chat)
