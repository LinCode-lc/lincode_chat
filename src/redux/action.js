import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_MSG,
    RECEIVE_MSG_LIST,
    RECEIVE_USER,
    RECEIVE_USER_LIST,
    RESET_USER,
    MSG_READ
} from './action-types'


//注册和登录是异步的，所以要创建异步action
import {
    reqRegister,
    reqLogin,
    reqUpdataUser,
    reqUser,
    reqUserList,
    reqChatMsgList,
    reqReadMsg
} from '../api'
//引入客户端io
import { io } from 'socket.io-client'
import store from './store'
function initIO(dispatch, userid) {
    // 1创建对象之前：判断对象是否已经创建，没创建才创建
    if (!io.socket) {
        //连接服务器，得到与服务器的连接对象
        io.socket = io("ws://106.53.151.173:3008")
        io.socket.on('receiveMsg', function (chatMsg) {
            console.log("客户端接收到的消息", chatMsg)
            //只有当chatMsg是与当前用户相关的消息，才会去分发同步action
            if (userid === chatMsg.from || userid === chatMsg.to) {
                //如果消息的发送者没在users列表（可能是个新用户），需要向后端请求新的用户列表
                if (!store.getState().chat.users[chatMsg.from]) {
                    getMsgList(dispatch, userid)
                } else {
                    dispatch(receiveMsg(chatMsg, userid))
                }

            }

        })
    }
}

//授权成功的同步action
const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user })
//错误提示的同步action
const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg })
//接收用户的同步action
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
//重置用户的同步action
export const resetUser = (msg) => ({ type: RESET_USER, data: msg })
//获取用户列表的同步action
const receiveUserList = (users) => ({ type: RECEIVE_USER_LIST, data: users })
//获取消息列表的同步action
const receiveMsgList = ({ users, chatMsgs, userid }) => ({ type: RECEIVE_MSG_LIST, data: { users, chatMsgs, userid } })
//接收一个消息的同步action  
const receiveMsg = (chatMsg, userid) => ({ type: RECEIVE_MSG, data: { chatMsg, userid } })
//读取了某个聊天消息的同步action
const msgRead = ({ count, from, to }) => ({ type: MSG_READ, data: { count, from, to } })

//异步获取消息列表数据
async function getMsgList(dispatch, userid) {
    initIO(dispatch, userid)
    const response = await reqChatMsgList()
    const result = response.data
    if (result.code === 0) {
        const { users, chatMsgs } = result.data
        dispatch(receiveMsgList({ users, chatMsgs, userid }))
    }
}
//注册异步action
export const register = (user) => {
    const { username, password, password2, type } = user
    //做表单的前台检查，如果不通过，返回一个errorMsg的同步action
    if (!username) {
        return errorMsg("用户名必须指定")
    }
    else if (password !== password2) {
        return errorMsg("两次密码不一致")
    }
    //表单数据合法，返回一个发ajax请求的异步action
    //异步action返回的是一个函数
    return async dispatch => {
        let result = await reqRegister({ username, password, type })
        result = result.data
        // console.log(result)
        if (result.code === 0) {
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

//登录异步action
export const login = (user) => {
    // console.log(user)
    const { username, password } = user
    //做表单的前台检查，如果不通过，返回一个errorMsg的同步action
    if (!username) {
        return errorMsg("用户名必须指定")
    }
    else if (!password) {
        return errorMsg("密码必须指定")
    }
    //表单数据合法，返回一个发ajax请求的异步action
    //异步action返回的是一个函数
    return async dispatch => {
        const response = await reqLogin(user)
        // console.log(response)
        const result = response.data
        if (result.code === 0) {
            getMsgList(dispatch, result.data._id)
            // console.log(result.data)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

//更新用户信息
export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdataUser(user)
        const result = response.data
        if (result.code === 0) {
            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}

//获取用户异步action
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser()
        const result = response.data

        if (result.code === 0) {

            getMsgList(dispatch, result.data._id)


            dispatch(receiveUser(result.data))
        } else {
            dispatch(resetUser(result.msg))
        }
    }
}

//获取用户列表的异步action
export const getUserList = (type) => {
    return async dispatch => {
        const response = await reqUserList(type);

        const result = response.data
        console.log("aaa")
        console.log(result)
        if (result.code === 0) {
            dispatch(receiveUserList(result.data))
        }
    }
}

//发送消息的异步action
export const sendMsg = ({ from, to, content }) => {
    return async dispatch => {

        io.socket.emit('sendMsg', { from, to, content })
    }
}

//读取消息的异步action
export const readMsg = (from, to) => {
    return async dispatch => {
        const response = await reqReadMsg(from)
        const result = response.data
        const count = result.data
        if (result.code === 0) {
            dispatch(msgRead({ count, from, to }))
        }
    }
}