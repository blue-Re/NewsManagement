import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../../../hooks/usePublish'

export default function UnPublished() {
  const { tableData, handleDelete } = usePublish(1)
  return (
    <div>
      <NewsPublish tableData={tableData} button={(id) =><Button onClick={() => handleDelete(id)} type='primary'>发布</Button>}/>
    </div>
  )
}
