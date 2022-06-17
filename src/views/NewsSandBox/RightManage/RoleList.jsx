import React, { useState, useEffect } from 'react'
import { Table, Modal, Button, Tree } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal

export default function RoleList() {
  const [tableData, setTableData] = useState([]);
  const [currenRights, setCurrenRights] = useState([]);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
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
            <Button
              type='primary'
              shape='circle'
              icon={<EditOutlined />}
              onClick={() => {
                setIsModelVisible(true)
                setCurrenRights(item.rights)
                setCurrentId(item.id)
              }}
            >
            </Button>
          </div>
        )
      }
    }
  ]
  const confirmMethod = (item) => {
    confirm({
      title: '确定要删除嘛？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const data = tableData.filter(tableItem => tableItem.id !== item.id)
        // 删除一级菜单
        if (item.grade === 1) {
          setTableData(data)
          axios.delete(`http://localhost:5000/roles/${item.id}`)
        }
      },
      onCancel() { }
    });
  }
  useEffect(() => {
    axios.get("http://localhost:5000/roles").then(res => {
      setTableData(res.data)
    })
    axios.get("http://localhost:5000/rights?_embed=children").then(res => {
      setRightList(res.data)
    })

    return () => {
    };
  }, []);
  const [isModelVisible, setIsModelVisible] = useState(false);
  const handleCancel = () => {
    setIsModelVisible(false)
  }
  const handleOk = () => {
    setIsModelVisible(false)
    setTableData(tableData.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights:currenRights
        }
      }
      return item
    }))
    axios.patch(`http://localhost:5000/roles/${currentId}`, {
      rights: currenRights
    })
  }

  const [rightList, setRightList] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const onCheck = (checkKeys) =>{
    setCurrenRights(checkKeys)
  }
  return (
    <div>
      <Table
        dataSource={tableData}
        columns={columns}
        rowKey={(item) => item.id}
      />
      <Modal 
        title="权限分配" 
        visible={isModelVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkStrictly
          checkedKeys={currenRights}
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
