import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import NewHeader from '../../components/Header'
import NewsMenu from '../../components/Menu'
import Home from './Home/Home'
import UserManage from './UserManage/UserManage'
import RightList from './RightManage/RightList'
import RoleList from './RightManage/RoleList'
import NoPermission from './NoPermission/NoPermission'
import './NewsSandBox.css'
import { Layout } from 'antd';
const { Content } = Layout

export default function NewsSandBox() {
  return (
    <Layout>
      <NewsMenu />

      <Layout className="site-layout">
        <NewHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/user-manage/list" component={UserManage} />
            <Route path="/right-manage/role/list" component={RoleList} />
            <Route path="/right-manage/right/list" component={RightList} />
            <Redirect from='/' to="/home" exact />
            <Route path="*" component={NoPermission} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
