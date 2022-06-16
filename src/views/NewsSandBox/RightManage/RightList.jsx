import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
const { confirm } = Modal

export default function RightList() {
  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then(res => {
      const { data } = res
      setTableData(data)
    })
    return () => {
    }
  }, [])

  const [tableData, setTableData] = useState([]);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
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
              onClick={() => confirmMethod(item)}
            ></Button>
            <Popover 
              content={<div>
                <Switch checked={item.pagepermisson} onChange={() => switchMethod(item) }></Switch>
              </div>} 
              title="页面配置项" 
              trigger={item.pagepermisson === undefined? '' : 'click'}
              >
                <Button
                  type='primary' 
                  shape='circle' 
                  icon={<EditOutlined />}
                  disabled={item.pagepermisson === undefined}
                >
                </Button>
            </Popover>
          </div>
        )
      }
    },
  ]
  const confirmMethod = (item) => {
    confirm({
      title: '确定要删除嘛？',
      icon: <ExclamationCircleOutlined/>,
      onOk() {
        const data = tableData.filter(tableItem => tableItem.id !== item.id)
        // 删除一级菜单
        if (item.grade === 1) {
          setTableData(data)
          axios.delete(`http://localhost:5000/rights/${item.id}`)
        } else {
          // 删除二级菜单
          const menu = tableData.find(tableItem => tableItem.id === item.rightId)
          menu.children = menu.children.filter(menuItem => menuItem.id !== item.id)
          setTableData([...tableData])
          axios.delete(`http://localhost:5000/children/${item.id}`)
        }

      },
      onCancel() {}
    });
  }
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setTableData([...tableData])
    // 同步一级菜单
    if (item.grade === 1) {
      axios.patch(`http://localhost:5000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      // 同步二级菜单
      axios.patch(`http://localhost:5000/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }
  return (
    <Table
      dataSource={tableData}
      columns={columns}
      pagination={{
        pageSize: 10
      }}
    />
  )
}
