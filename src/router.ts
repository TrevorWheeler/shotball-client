import {
  type RouteLocationNormalized,
  type RouteRecordRaw,
  RouterView,
  createRouter,
  createWebHistory
} from 'vue-router'
import Home from '@/views/game.vue'
import JoinGame from '@/views/join_game.vue'
import Game from '@/views/game.vue'
import CreateGame from '@/views/create_game.vue'
import { useStore } from '@/store'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  strict: true,
  routes: [
    {
      path: '/',
      name: 'home',
      component: CreateGame
    },
    {
      path: '/:id',
      name: 'joinGame',
      component: JoinGame
    },
    {
      path: '/:id/play',
      name: 'game',
      component: Game,
    }
  ]
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const store = useStore()
  window.document.title = store.siteName as string
  console.log('Route -> ' + from.name?.toString() + ' ' + to.name?.toString())
  // if (
  //   !store.username &&
  //   to.name?.toString() !== 'login'
  // ) {
  //   router.push('/login')
  // }
  return true
})

// const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

// // remove trailing slashes
// router.beforeEach((to) => {
//   if (/.\/$/.test(to.path)) {
//     to.meta.redirectCode = 301;
//     return to.path.replace(/\/$/, "");
//   }
// });

// router.beforeEach(async (to) => {
//   // console.log(`Guard from ${from.fullPath} to ${to.fullPath}`)
//   if (to.params.id === "no-name") return false;

//   const time = Number(to.query.delay);
//   if (time > 0) {
//     console.log("⏳ waiting " + time + "ms");
//     to.meta.waitedFor = time;
//     await delay(time);
//   }
// });

// router.beforeEach(() => {
//   if (globalState.cancelNextNavigation) return false;
// });

// router.afterEach((to, from) => {
//   if (to.name === from.name && to.name === "repeat") {
//     const toDepth = to.path.split("/").length;
//     const fromDepth = from.path.split("/").length;
//     to.meta.transition = toDepth < fromDepth ? "slide-right" : "slide-left";
//   }
// });

// router.afterEach((to, from) => {
//   // console.log(
//   //   `After guard: from ${from.fullPath} to ${
//   //     to.fullPath
//   //   } | location = ${location.href.replace(location.origin, '')}`
//   // )
// });

// router.beforeEach((to) => {
//   // console.log('second guard')
//   if (typeof to.query.to === "string" && to.query.to) return to.query.to;
// });

export default router
