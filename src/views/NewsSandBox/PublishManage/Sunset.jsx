import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../../../hooks/usePublish'

export default function Sunset() {
  const { tableData, handleSunset } = usePublish(3)
  return (
    <div>
      <NewsPublish tableData={tableData}  button={(id) =><Button onClick={() => handleSunset(id)} danger>删除</Button>}/>
    </div>
  )
}
