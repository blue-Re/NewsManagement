import React, { useState, useEffect } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, notification } from 'antd'
import axios from 'axios'
import style from './News.module.css'
import { useRef } from 'react'
import NewsEditor from '../../../components/NewsEditor'
const { Step } = Steps
const { Option } = Select


export default function NewsUpdate(props) {
  const NewsForm = useRef(null)
  const [current, setCurrent] = useState(0);
  const [formInfo, setFormInfo] = useState({});
  const [content, setContent] = useState("");
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error);
      })
    } else {
      setCurrent(current + 1)
    }
  };
  const handlePrevious = () => {
    setCurrent(current - 1)
  };

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  }

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
    return () => {
    };
  }, []);

  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      let { title, categoryId, content } = res.data
      NewsForm.current.setFieldsValue({
        title,
        categoryId,
      })
      setContent(content)
    })
    return () => {
    };
  }, [props.match.params.id]);

  const handleSave = (auditState) => {
    axios.patch(`/news/${props.match.params.id}`, {
      ...formInfo,
      content,
      auditState,
    }).then(res => {
      props.history.push(auditState === 0 ? "/news-manage/draft" : "audit-manage-list")
      notification.info({
        message: '通知',
        description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: 'bottomRight'
      })
    })
  };


  return (
    <div>
      <PageHeader
        className='site-page-header'
        title="更新新闻"
        subTitle="这个是新闻的title"
        onBack={() => props.history.goBack()}
      />
      <Steps
        current={current}
      >
        <Step title="基本信息" description="新闻标题，新闻内容" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.active}>
          <Form ref={NewsForm} {...layout} name="basic">
            <Form.Item label="新闻标题" name="title" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input placeholder='请输入用户名' />
            </Form.Item>
            <Form.Item label="新闻分类" name="categoryId" rules={[{ required: true, message: '请输入用户名' }]}>
              <Select>
                {
                  categoryList.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>{item.title}</Option>
                    )
                  })
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.active}>
          <NewsEditor content={content} getContent={(value) => {
            setContent(value)
          }} />
        </div>
        <div className={current === 2 ? '' : style.active}>

        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        {
          current === 2 &&
          <span>
            <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={handlePrevious}>上一步</Button>
        }
      </div>
    </div>
  )
}
