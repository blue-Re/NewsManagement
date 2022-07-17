import { Button, Table, notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Audit() {
  const [tableData, setTableData] = useState([])
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button type='primary' onClick={() => handleAudit(item, 2, 1)}>通过</Button>
            <Button onClick={() => handleAudit(item, 3, 0)} danger>驳回</Button>
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      setTableData(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ])
    })
    return () => {
    };
  }, [roleId, region, username]);

  const handleAudit = (item, auditState, publishState) => {
    setTableData(tableData.filter(data => data.id !== item.id))
    axios.patch(`news/${item.id}`, {
      auditState,
      publishState,
    }).then(res => {
      notification.info({
        message: '通知',
        description: '你可以到审核列表中查看您的审核状态',
        placement: 'bottomRight'
      })
    })
  };

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
