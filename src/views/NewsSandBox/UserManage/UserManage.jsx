import React, { useState, useEffect, useRef } from 'react'
import { Table, Switch, Button, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/UserForm';
const { confirm } = Modal


export default function UserManage() {
  const [tableData, setTableData] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [current, setCurrent] = useState(null);
  const addForm = useRef(null)
  const updateForm = useRef(null)

  const columns = [
    {
      title: "区域",
      dataIndex: 'region',
      render: (region) => {
        return <b>{region || "全球"}</b>
      },
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: "全球",
          value: "全球",
        }
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === ""
        }
        return item.region === value
      }
    },
    {
      title: "角色名称",
      dataIndex: 'role',
      render: role => role.roleName
    },
    {
      title: "用户名",
      dataIndex: 'username',
    },
    {
      title: "用户状态",
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handleChange(item)}
          >
          </Switch>
        )
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape='circle'
              icon={<DeleteOutlined />}
              disabled={item.default}
              onClick={() => confirmMethod(item)}
            ></Button>
            <Button
              type='primary'
              shape='circle'
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => handleUpdate(item)}
            >
            </Button>
          </div>
        )
      }
    }
  ]
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get("/users?_expand=role").then(res => {
      const list = res.data
      setTableData(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ])
    })
  }, [roleId, region, username])
  useEffect(() => {
    axios.get("/regions").then(res => {
      setRegionList(res.data)
    })
    axios.get("/roles").then(res => {
      setRoleList(res.data)
    })
    return () => {
    }
  }, [])
  const confirmMethod = (item) => {
    confirm({
      title: '确定要删除嘛？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const data = tableData.filter(tableItem => tableItem.id !== item.id)
        setTableData(data)
        axios.delete(`/users/${item.id}`)
      },
      onCancel() { }
    });
  }
  const handleChange = (item) => {
    item.roleState = !item.roleState
    setTableData([...tableData])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  const handleUpdate = (item) => {
    setTimeout(() => {
      setIsUpdateVisible(true)
      if (item.roleId === 1) {
        setIsUpdateDisabled(true)
      } else {
        setIsUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0);
    setCurrent(item)
  }
  return (
    <div>
      <Button type='primary' onClick={() => {
        setIsAddVisible(true)
      }} >添加用户</Button>
      <Table
        dataSource={tableData}
        columns={columns}
        rowKey={(item) => item.id}
      />
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false)
        }}
        onOk={() => {
          addForm.current.validateFields().then(value => {
            setIsAddVisible(false)
            // 先post到后端，生成id，在更行页面
            axios.post("/users", {
              ...value,
              "roleState": true,
              "default": false,
            }).then(res => {
              setTableData([...tableData, {
                ...res.data,
                role: roleList.find(item => item.id === value.roleId)
              }])
            })
            addForm.current.resetFields()
          }).catch(err => {
            console.log(err);
          })
        }}
      >
        <UserForm ref={addForm} roleList={roleList} regionList={regionList} />
      </Modal>
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => {
          updateForm.current.validateFields().then(value => {
            setIsUpdateVisible(false)
            setTableData(tableData.map(item => {
              if (item.id === current.id) {
                return {
                  ...item,
                  ...value,
                  role: roleList.find(data => data.id === value.roleId)
                }
              }
              return item
            }))
            setIsUpdateDisabled(!isUpdateDisabled)
            axios.patch(`/users/${current.id}`, value)
            updateForm.current.resetFields()
          }).catch(err => {
            console.log(err);
          })
        }}
      >
        <UserForm ref={updateForm} isUpdate={true} roleList={roleList} regionList={regionList} isUpdateDisabled={isUpdateDisabled} />
      </Modal>
    </div>
  )
}
