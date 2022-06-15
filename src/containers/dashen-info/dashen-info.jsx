// 大神信息完善的路由容器组件
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import HeaderSelector from '../../components/header-selector/header-selector'
import { updateUser } from '../../redux/action'
import { Redirect } from 'react-router-dom'
class DashenInfo extends Component {
    state = {
        header: '',
        post: '',
        info: '',

    }
    save = () => {
        this.props.updateUser(this.state)
    }
    setHeader = (header) => {
        this.setState({
            header
        })

    }
    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })

    }
    render() {
        const { header, type } = this.props.user
        if (header) {  //信息已经完善
            const path = type === 'dashen' ? '/dashen' : 'laoban'
            return <Redirect to={path} />
        }
        return (
            <div>
                <NavBar>大神信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <InputItem placeholder="请输入求职岗位" onChange={val => { this.handleChange('post', val) }}>求职岗位</InputItem>
                <TextareaItem title="个人介绍:" rows={3} onChange={val => { this.handleChange('info', val) }}></TextareaItem>



                <Button type="primary" onClick={this.save}>保&nbsp;&nbsp;&nbsp;&nbsp;存</Button>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { updateUser }
)(DashenInfo)