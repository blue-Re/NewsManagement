import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
  VideoCameraOutlined,
  MailOutlined,
  SettingOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import './index.css'

const { Sider } = Layout
const { SubMenu } = Menu

const iconList = {
  "/home": <VideoCameraOutlined />,
  "/user-manage": <SettingOutlined />,
  "/user-manage/list": <SettingOutlined />,
  "/right-manage": <MailOutlined />,
  "/right-manage/role/list": <MailOutlined />,
  "/right-manage/right/list": <PieChartOutlined />
}

function NewsMenu(props) {
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      const { data } = res
      setMenuList(data)
    })
    return () => {

    };
  }, []);
  const [menuList, setMenuList] = useState([]);
  const renderMenu = (menuList) => {
    return menuList.map(menuItem => {
      if (menuItem.children?.length && pagePermission(menuItem)) {
        return (
          <SubMenu
            key={menuItem.key}
            icon={iconList[menuItem.key]}
            title={menuItem.title}
          > {renderMenu(menuItem.children)}
          </SubMenu>
        )
      }
      return (
        pagePermission(menuItem)
        &&
        <Menu.Item
          key={menuItem.key}
          icon={iconList[menuItem.key]}
          onClick={() => goToPath(menuItem.key)}
        >
          {menuItem.title}
        </Menu.Item>
      )
    })
  }
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const pagePermission = (menuItem) => {
    return menuItem.pagepermisson && rights.includes(menuItem.key)
  }
  const goToPath = (path) => {
    props.history.push(path)
  }
  const { pathname } = props.location
  const openKeys = pathname.split("/")[1]
  return (
    <Sider style={{ overflowY: 'auto' }} trigger={null} collapsible collapsed={props.isCollapsed}>
      <div className="logo">全球新闻发布管理系统</div>
      <Menu
        theme="dark" 
        mode="inline" 
        selectedKeys={[pathname]} 
        defaultOpenKeys={[`/${openKeys}`]}
      >
        {renderMenu(menuList)}
      </Menu>
    </Sider>
  )
}

const mapStateToProps = (state) => {
  return {
    isCollapsed: state.collapsedReducers.isCollapsed
  }
};

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps,mapDispatchToProps )(withRouter(NewsMenu))
