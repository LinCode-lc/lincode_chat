import React, { Component } from 'react'
import { TabBar } from 'antd-mobile'
import PropsType from 'prop-types'
import { withRouter } from 'react-router'  //让非路由组件可以用路由组件的api

class NavFooter extends Component {
    static propsType = {
        navList: PropsType.array.isRequired
    }
    render() {
        let { navList, unReadCount } = this.props
        navList = navList.filter(nav => !nav.hide)
        //因为该组件不是路由组件，所以没办法拿到location
        // icon={{ uri: require(`./images/${val.icon}.svg`) }}
        const path = this.props.location.pathname
        return (
            <TabBar>

                {
                    navList.map((val) =>
                        <TabBar.Item
                            key={val.path}
                            badge={val.path === '/message' ? unReadCount : 0}
                            title={val.text}
                            icon={{ uri: `/images/${val.icon}.svg` }}
                            selectedIcon={{ uri: `/images/${val.icon}-selected.svg` }}
                            selected={val.path === path}
                            onPress={() => this.props.history.replace(val.path)}
                        />




                    )
                }
            </TabBar>
        )
    }
}
export default withRouter(NavFooter)