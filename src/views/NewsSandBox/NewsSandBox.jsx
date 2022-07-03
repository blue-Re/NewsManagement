import React from 'react'

import { useEffect } from 'react'
import NewHeader from '../../components/Header'
import NewsMenu from '../../components/Menu'

import './NewsSandBox.css'
import { Layout } from 'antd';
import NewsRouter from '../../components/NewsRouter';

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
          <NewsRouter/>
        </Content>
      </Layout>
    </Layout>
  )
}
