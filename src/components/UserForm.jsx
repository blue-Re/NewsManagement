import React, { forwardRef, useState, useEffect } from 'react';
import { Form, Input, Select } from 'antd'
const { Option } = Select


const UserForm = forwardRef((props, ref) => {
  const { roleList, regionList, isUpdateDisabled, isUpdate } = props
  const [isDisabled, setIsDisabled] = useState(false)
  useEffect(() => {
    setIsDisabled(isUpdateDisabled)
    return () => {
    }
  }, [isUpdateDisabled])

  const { roleId, region } = JSON.parse(localStorage.getItem("token"))
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor"
  }
  const checkRoleDisabled = (item) => {
    if (isUpdate) {
      if (roleObj[roleId] === "superadmin") {
        return false
      }else {
        return true
      }
    }else {
      if (roleObj[roleId] === "superadmin") {
        return false
      }else {
        return roleObj[item.id] !== "editor"
      }
    }
  }
  const checkRegionDisabled = (item) => {
    if (isUpdate) {
      if (roleObj[roleId] === "superadmin") {
        return false
      }else {
        return true
      }
    }else {
      if (roleObj[roleId] === "superadmin") {
        return false
      }else {
        return item.value !== region
      }
    }
  }

  return (
    <Form
      ref={ref}
      layout="vertical"
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[{
          required: true,
          messages: '请输入用户名'
        }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{
          required: true,
          messages: '请输入密码'
        }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={isDisabled ? [] : [{
          required: true,
          messages: '请输入区域'
        }]}
      >
        <Select disabled={isDisabled}>
          {
            regionList.map(item => {
              return <Option disabled={checkRegionDisabled(item)} value={item.value} key={item.id}>{item.title}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
      >
        <Select onChange={(value) => {
          if (value === 1) {
            setIsDisabled(true)
            ref.current.setFieldsValue({
              region: ""
            })
          } else {
            setIsDisabled(false)
          }
        }}>
          {
            roleList.map(item => {
              return <Option disabled={checkRoleDisabled(item)} value={item.id} key={item.id}>{item.roleName}</Option>
            })
          }
        </Select>
      </Form.Item>
    </Form>
  );
})

export default UserForm;
