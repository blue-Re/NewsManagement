import { Tag, Button, Table, notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function AuditList(props) {
  const [tableData, setTableData] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"))
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ["", "orange", "red", "green"]
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"]
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            {
              item.auditState === 1 && <Button onClick={() => handleRevert(item)} danger>撤销</Button>
            }
            {
              item.auditState === 2 && <Button onClick={() => handlePublish(item)} type='primary'>发布</Button>
            }
            {
              item.auditState === 3 && <Button onClick={() => handleUpdate(item)} type='primary'>更新</Button>
            }
          </div>
        )
      }
    }
  ]
  useEffect(() => {
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setTableData(res.data)
    })
    return () => {
    };
  }, [username]);

  const handleRevert = (item) => {
    setTableData(tableData.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, { auditState: 0 }).then(res => {
      notification.info({
        message: '通知',
        description: '你可以到草稿箱中查看您的新闻',
        placement: 'bottomRight'
      })
    })
  };

  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  };

  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      publishState:2,
      publishTime: Date.now(),
    }).then(res => {
      props.history.push('/publish-manage/published')
      notification.info({
        message: '通知',
        description: `您可以到发布管理中的已发布中查看您的新闻`,
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
