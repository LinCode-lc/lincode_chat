// 选择用户头像的ui

import React, { Component } from 'react'
import { List, Grid } from 'antd-mobile'
import PropTypes from 'prop-types'
import './header-selector.css'
export default class HeaderSelector extends Component {

    static propTypes = {
        setHeader: PropTypes.func.isRequired
    }
    state = {
        icon: null
    }

    constructor(props) {
        super(props)
        this.headerList = []
        for (let i = 0; i < 5; i++) {
            this.headerList.push(
                {
                    text: 'header' + (i + 1),
                    icon: `/images/header${i + 1}.jpg`
                }
            )
        }
    }
    handleClick = ({ text, icon }) => {
        //更新当前状态
        this.setState({ icon })
        //更新父组件状态

        this.props.setHeader(text)
    }
    render() {
        const { icon } = this.state
        const listHeader = icon ? (<div className="selectHeader"><img src={icon}></img></div>) : '请选择头像'
        return (
            <List renderHeader={() => listHeader}>
                <Grid data={this.headerList}
                    columnNum={3} onClick={this.handleClick}></Grid>
            </List>
        )
    }
}
