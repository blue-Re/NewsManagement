import React from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux'

const { Header } = Layout;

function NewsHeader(props) {
  const changeCollapsed = () => {
    // setCollapsed(!collapsed)
    props.changeCollapsed()
  }

  const loginOut = () => {
    localStorage.removeItem("token")
    props.history.replace("/login")
  }

  const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))

  const menu = (
    <Menu>
      <Menu.Item>
        {roleName}
      </Menu.Item>
      <Menu.Item danger onClick={() => loginOut()}>退出</Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}

      <div style={{ float: "right" }}>
        <span>欢迎<span style={{color: 'red'}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = (state) => {
  return {
    isCollapsed: state.collapsedReducers.isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'changeCollapsed',
      payload: {}
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewsHeader))