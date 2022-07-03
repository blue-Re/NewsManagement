import React from 'react';
import { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom'
import axios from 'axios';


import Home from '../views/NewsSandBox/Home/Home'
import UserManage from '../views/NewsSandBox/UserManage/UserManage'
import RightList from '../views/NewsSandBox/RightManage/RightList'
import RoleList from '../views/NewsSandBox/RightManage/RoleList'
import NoPermission from '../views/NewsSandBox/NoPermission/NoPermission'

import NewsAdd from '../views/NewsSandBox/NewsManage/NewsAdd'
import NewsDraft from '../views/NewsSandBox/NewsManage/NewsDraft'
import NewsCategory from '../views/NewsSandBox/NewsManage/NewsCategory'
import NewsPreview from '../views/NewsSandBox/NewsManage/NewsPreview'

import Audit from '../views/NewsSandBox/AuditManage/Audit'
import AuditList from '../views/NewsSandBox/AuditManage/AuditList'

import Unpublished from '../views/NewsSandBox/PublishManage/Unpublished'
import Published from '../views/NewsSandBox/PublishManage/Published'
import Sunset from '../views/NewsSandBox/PublishManage/Sunset'


const NewsRouter = () => {
  const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserManage,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
  }

  const [BackRouterList, setBackRouterList] = useState([]);
  useEffect(() => {
    Promise.all([
      axios.get("/rights"),
      axios.get("/children")
    ]).then(res => {
      setBackRouterList([...res[0].data, ...res[1].data])
    })
    return () => {
    };
  }, []);

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  };
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  };



  return (
    <Switch>
      {
        BackRouterList.map(item => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return (
              <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
            )
          }
          return null
        })
      }
      {/* <Route path="/home" component={Home} />
      <Route path="/user-manage/list" component={UserManage} />
      <Route path="/right-manage/role/list" component={RoleList} />
      <Route path="/right-manage/right/list" component={RightList} /> */}
      <Redirect from='/' to="/home" exact />
      {
        BackRouterList.length && <Route path="*" component={NoPermission} />
      }

    </Switch>
  );
}

export default NewsRouter;
