import ajax from './ajax'

export const reqRegister = (user) => ajax('/register', user, 'POST')
export const reqLogin = ({ username, password }) => ajax('/login', { username, password }, 'POST')
export const reqUpdataUser = (user) => ajax('/update', user, 'POST')
export const reqUser = () => ajax('/user')
export const reqUserList = (type) => ajax('/userlist', { type })
//获取当前用户的聊天信息列表
export const reqChatMsgList = () => ajax('/msglist')
//修改指定消息为已读
export const reqReadMsg = (from) => ajax('/readmsg', { from }, 'POST')