import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserList from '../../components/user-list/user-list'
import { getUserList } from '../../redux/action'
class Laoban extends Component {

    componentDidMount() {

        this.props.getUserList('dashen')
    }
    render() {
        const userList = this.props.userList
        return (
            <div>
                <UserList userList={userList}></UserList>
            </div>
        )
    }
}
export default connect(
    state => ({

        userList: state.userList
    }),
    { getUserList }
)(Laoban)
