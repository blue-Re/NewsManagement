import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../../../hooks/usePublish'

export default function Published() {
  const { tableData, handlePublish } = usePublish(2)
  return (
    <div>
      <NewsPublish tableData={tableData} button={(id) => <Button onClick={() => handlePublish(id)}>下线</Button>} />
    </div>
  )
}
