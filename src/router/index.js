import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = (resolve) => {
  import('@/components/Recommend/Recommend').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('@/components/Singer/Singer').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('@/components/Rank/Rank').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('@/components/Search/Search').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('@/components/SingerDetail/SingerDetail').then((module) => {
    resolve(module)
  })
}

const Disc = (resolve) => {
  import('@/components/Disc/Disc').then((module) => {
    resolve(module)
  })
}

const RankDetail = (resolve) => {
  import('@/components/RankDetail/RankDetail').then((module) => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('@/components/UserCenter/UserCenter').then((module) => {
    resolve(module)
  })
}

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
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
