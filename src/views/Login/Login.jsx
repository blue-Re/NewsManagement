import { Form, Input, Button, message } from 'antd'
import React from 'react'
import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';
import './login.css'
import axios from 'axios';

export default function Login(props) {

  const onFinish = (values) => {
    const { username, password } = values
    axios.get(
      `/users?username=${username}&password=${password}&roleState=true&_expand=role`
    ).then(res => {
      if (res.data.length === 0) {
        message.error("用户名密码不匹配")
      } else {
        const token = JSON.stringify(res.data[0])
        localStorage.setItem("token", token)
        props.history.push("/")
      }
    })
  }

  return (
    <div style={{ background: 'rgb(35,39,65)', height: '100%' }}>
      <div className='formContainer'>
        <div className='login-title'>全球新闻发布管理系统</div>
        <Form name='normal_login' className='login-form' onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="username" prefix={<UserOutlined className="site-form-item-icon" />} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input placeholder="password" type='password' prefix={<LockOutlined className="site-form-item-icon" />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
