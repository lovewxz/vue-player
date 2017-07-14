import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/Recommend/Recommend'
import Singer from '@/components/Singer/Singer'
import Rank from '@/components/Rank/Rank'
import Search from '@/components/Search/Search'
import SingerDetail from '@/components/SingerDetail/SingerDetail'
import Disc from '@/components/Disc/Disc'
import RankDetail from '@/components/RankDetail/RankDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
