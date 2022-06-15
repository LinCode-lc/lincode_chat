// 包含n个reducers函数：根据老的state和指定的action返回一个新的state

//合并reducer
import { combineReducers } from "redux";
// import laobanInfo from "../containers/laoban-info/laoban-info";
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RESET_USER,
    RECEIVE_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    MSG_READ
} from './action-types'
import { getRedirectTo } from "../utils";
const initUser = {
    username: '',
    type: '',
    msg: '',
    redirectTo: ''//需要重定向的路径
}
const initUserList = []
const initChat = {
    users: {},
    chatMsgs: [],
    unReadCount: 0 //总的未读数量
}
//产生user的reducer
function user(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            const { type, header } = action.data
            return { ...action.data, redirectTo: getRedirectTo(type, header) }
        case ERROR_MSG:
            return { ...state, msg: action.data }
        case RECEIVE_USER:
            return action.data
        case RESET_USER:
            return { ...initUser, msg: action.data }
        default: return state
    }

}

//产生userlist的reducer
function userList(state = initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

//产生与当前用户有关的聊天
function chat(state = initChat, action) {
    switch (action.type) {
        case RECEIVE_MSG_LIST:
            const { users, chatMsgs, userid } = action.data
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && msg.to === userid ? 1 : 0), 0)
            }
        case RECEIVE_MSG:
            const { chatMsg } = action.data
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to === action.data.userid ? 1 : 0)
            }
        case MSG_READ:
            const { count, from, to } = action.data

            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if (msg.from === from && msg.to === to) {
                        return { ...msg, read: true }
                    }
                    return msg
                }),
                unReadCount: state.unReadCount - count
            }
        default: return state
    }
}
// redirectTo有四种情况
//  /dashen  /laoban /dasheninfo /laobanInfo
// 用header判断用不用去信息完善页面
// 用type判断用户类型
// function getRedirectTo(type, header) {
//     let path = ''
//     if (type === 'laoban') {
//         path = '/laoban'
//     } else {
//         path = '/dashen'
//     }

//     if (!header) {
//         path += 'info'
//     }
//     return path
// }
// function yyy(state = 0, action) {
//     return state

// }

export default combineReducers({
    user,
    userList,
    chat
})
//向外暴漏的状态结构为：{user:{},userList:[]}