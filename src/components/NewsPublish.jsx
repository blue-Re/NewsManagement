import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, } from 'antd'
const { confirm } = Modal

export default function NewsPublish(props) {

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
        return <div >{category.title}</div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            {props.button(item.id)}
          </div>
        )
      }
    },
  ]
  return (
    <Table
      dataSource={props.tableData}
      columns={columns}
      pagination={{
        pageSize: 10
      }}
      rowKey={item => item.id}
    />
  )
}
