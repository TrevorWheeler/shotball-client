import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import type { Token } from '@/types/Token'
import { type UseWebSocketReturn, useWebSocket } from '@vueuse/core'
import Mitt from '@/plugins/mitt'
import type { WsRequest } from './types/WsRequest'
import type { GameState } from './types/Game'
export const useStore = defineStore('store', () => {
  const siteName: Ref<String> = ref(import.meta.env.VITE_SITE_NAME)
  const serverURL: Ref<String> = ref(
    import.meta.env.VITE_NODE_ENV === 'development'
      ? import.meta.env.VITE_DEV_SERVER_URL
      : import.meta.env.VITE_PROD_SERVER_URL
  )
  const ws: UseWebSocketReturn<any> = useWebSocket<any>('ws://localhost:3000/ws', {
    onMessage(_ws: any, event: any) {
      if (event.data === 'pong') {
        console.log(event.data)
        return
      }

      // console.log('Received message:', JSON.parse(event.data))
      const message: any = JSON.parse(event.data)
      Mitt.emit(message.id, message.data)
    },
    onConnected(_ws: any) {
      console.log('CONNECTED')
    },
    onDisconnected(ws, event) {
      console.log(ws)
      console.log(event)
      console.log('disconnected')
    },
    onError(ws, event) {
      console.log('ERROR')
    }
    // autoReconnect: {
    //   retries: 3,
    //   delay: 1000,
    //   onFailed() {
    //     console.log('Failed to connect WebSocket after 3 retries')
    //   }
    // },
    // autoClose: false,
    // immediate: false,
    // heartbeat: {
    //   message: 'ping',
    //   interval: 1000,
    //   pongTimeout: 1000
    // }
  })

  function sendMessage(id: string, data: any) {
    const request: WsRequest = {
      token: token.value,
      id,
      data
    }
    ws.send(JSON.stringify(request))
  }

  function getUsername(): string {
    // return 'steve';
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return ''
      }
      const decoded: Token | null = jwtDecode(token)
      return decoded?.username ?? ''
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  // function logout() {
  //   localStorage.removeItem('token');
  //   username.value = '';
  //   agreement.value = false;
  //   isAuthenticated.value = false;
  //   router.push({ name: 'login' });
  // }

  // function reset() {
  //   localStorage.removeItem('token');
  //   router.push('/agreement');
  // }

  const username: Ref<string> = ref(getUsername())

  const gameState: Ref<GameState> = ref({ gameId: '', players: [], projectiles: [] })

  const token: Ref<string> = ref('')

  return { siteName, serverURL, ws, username, sendMessage, gameState, token }
})
