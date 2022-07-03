import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Table, Modal } from 'antd'
const { confirm } = Modal

export default function NewsDraft() {
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      const { data } = res
      setTableData(data)
    })
    return () => {
    }
  }, [username])

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
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`} >{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
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
            <Button
              type='primary'
              shape='circle'
              icon={<EditOutlined />}
            >
            </Button>
            <Button
              type='primary'
              shape='circle'
              icon={<UploadOutlined />}
            >
            </Button>
          </div>
        )
      }
    },
  ]
  const confirmMethod = (item) => {
    confirm({
      title: '确定要删除嘛？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const data = tableData.filter(tableItem => tableItem.id !== item.id)
        setTableData(data)
        axios.delete(`/news/${item.id}`)
      }
    });
  }
  return (
    <Table
      dataSource={tableData}
      columns={columns}
      pagination={{
        pageSize: 10
      }}
      rowKey={item => item.id}
    />
  )
}
