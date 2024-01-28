<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
const router = useRouter()
const route = useRoute()
import { useStore } from '@/store'
import type { GameState, PlayerCapturedControls, Player, Projectile } from '@/types/Game'
const store = useStore()
import { Application, onTick } from 'vue3-pixi'

import { onKeyStroke } from '@vueuse/core'
import Mitt from '@/plugins/mitt'
import type { Token } from '@/types/Token'


const gameState: Ref<GameState> = ref({ gameId: '', players: [], projectiles: [] })

const playerId: Ref<string> = ref('')

onMounted(() => {
  gameState.value = JSON.parse(JSON.stringify(store.gameState))
  const decoded = jwtDecode<Token>(store.token)
  playerId.value = decoded?.id ?? ''
  window.addEventListener('keydown', updateKeyState)
  window.addEventListener('keyup', updateKeyState)
  listenGameUpdate()
})

function listenGameUpdate() {
  Mitt.on('game_update', (gameStateUpdate: GameState) => {
    // const gameStatePlayersMap = new Map(gameState.value.players.map(player => [player.playerId, player]));

    // // Iterate and update players
    // for (const updatedPlayer of gameStateUpdate.players) {
    //   if (gameStatePlayersMap.has(updatedPlayer.playerId)) {
    //     const frontendPlayer = gameStatePlayersMap.get(updatedPlayer.playerId);
    //     if (frontendPlayer) {
    //       frontendPlayer.positionX = updatedPlayer.positionX;
    //       frontendPlayer.positionY = updatedPlayer.positionY;
    //       frontendPlayer.angle = updatedPlayer.angle;
    //     }
    //   }
    // }

    // // Create a map for quick lookup of current frontend players
    // const gameStatePlayersMap = new Map(gameState.value.players.map(player => [player.playerId, player]));

    // // Update existing players and add new players
    // gameState.value.players = gameStateUpdate.players.map(updatedPlayer => {
    //   const frontendPlayer = gameStatePlayersMap.get(updatedPlayer.playerId);
    //   if (frontendPlayer) {
    //     // Update existing player
    //     return { ...frontendPlayer, ...updatedPlayer };
    //   } else {
    //     // Add new player
    //     return updatedPlayer;
    //   }
    // });

    // Remove players that no longer exist
    //     const updatedPlayersMap = new Map(gameStateUpdate.players.map(player => [player.playerId, player]));
    // gameState.value.players = gameState.value.players.filter(player => updatedPlayersMap.has(player.playerId));

    // Create a map for quick lookup of current frontend players
    const gameStatePlayersMap = new Map(gameState.value.players.map(player => [player.playerId, player]));

    // Iterate and update or add players
    gameStateUpdate.players.forEach(updatedPlayer => {
      const frontendPlayer = gameStatePlayersMap.get(updatedPlayer.playerId);
      if (frontendPlayer) {
        // Update existing player properties explicitly
        frontendPlayer.positionX = updatedPlayer.positionX;
        frontendPlayer.positionY = updatedPlayer.positionY;
        frontendPlayer.angle = updatedPlayer.angle;
      } else {
        // Add new player to the map and the gameState value
        gameStatePlayersMap.set(updatedPlayer.playerId, updatedPlayer);
        gameState.value.players.push(updatedPlayer);
      }
    });

    // Filter out players that no longer exist
    const updatedPlayersMap = new Map(gameStateUpdate.players.map(player => [player.playerId, player]));
    gameState.value.players = gameState.value.players.filter(player => updatedPlayersMap.has(player.playerId));



    // Create maps for quick lookup
    const gameStateProjectilesMap = new Map(gameState.value.projectiles.map(proj => [proj.projectileId, proj]));
    const gameStateUpdateProjectilesMap = new Map(gameStateUpdate.projectiles.map(proj => [proj.projectileId, proj]));

    // Update and Add Projectiles
    for (const [id, projectile] of gameStateUpdateProjectilesMap) {
      if (gameStateProjectilesMap.has(id)) {
        const frontendProjectile = gameStateProjectilesMap.get(id);
        if (frontendProjectile) {
          frontendProjectile.positionX = projectile.positionX;
          frontendProjectile.positionY = projectile.positionY;
        }

      } else {
        gameState.value.projectiles.push(projectile);
      }
    }

    // Remove Non-Existing Projectiles
    gameState.value.projectiles = gameState.value.projectiles.filter(proj => gameStateUpdateProjectilesMap.has(proj.projectileId));
  })
}


// function getGame(): Promise<Lobby | null> {
//   let timeout: any;
//   return new Promise((resolve, reject) => {
//     try {
//       store.sendMessage("get_game", { playerId: route.query.playerId })
//       // Listen for the response
//       Mitt.on('lobby_init',
//         (lobby: Lobby) => {
//           console.log(lobby)
//           clearTimeout(timeout); // Clear the timeout on successful response
//           resolve(lobby); // Resolve the promise with the data
//           Mitt.off('playerId'); // Remove the event listener
//         },
//       );
//       // Set a timeout to resolve the promise if not resolved within 5 seconds
//       const timeout = setTimeout(() => {
//         console.log("timing out")
//         Mitt.off('lobby_init');
//         resolve(null);
//       }, 5000);
//     } catch (error) {
//       if (timeout) {
//         clearTimeout(timeout); // Clear the timeout in case of an exception
//       }
//       Mitt.off('lobby_init'); // Remove the event listener
//       resolve(null); // Resolve with null in case of an exception
//     }
//   });
// }

const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)

const mousePosition = ref({ x: 0, y: 0 })
const keysPressed: Ref<any> = ref({
  w: false,
  a: false,
  s: false,
  d: false
})


function updateKeyState(event: any) {
  const key = event.key.toLowerCase()
  if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
    keysPressed.value[key] = event.type === 'keydown'
  }
}

function updateMousePosition(event: any) {
  const bounds = event.target.getBoundingClientRect()
  mousePosition.value = {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top
  }
}

onTick((delta) => {
  const playerUpdate: PlayerCapturedControls = {
    up: keysPressed.value.w,
    down: keysPressed.value.s,
    left: keysPressed.value.a,
    right: keysPressed.value.d,
    mousePositionY: mousePosition.value.y,
    mousePositionX: mousePosition.value.x
  }

  store.sendMessage('player_update_position', playerUpdate)
})


function shootProjectile() {
  store.sendMessage('player_shoot_projectile', { gameId: gameState.value.gameId })
}



</script>

<template>
  <main>
    <div class="game-stats">
      {{ keysPressed }}
      height:{{ canvasHeight }} width: {{ canvasWidth }}
    </div>

    <div @mousemove="updateMousePosition" @click="shootProjectile">
      <Application :width="canvasWidth" :height="canvasHeight">
        <container>
          <graphics v-for="(player, index) in gameState.players" :x="player.positionX" :y="player.positionY" @render="(graphics) => {
            graphics.clear()
            graphics.lineStyle(2, 0xff00ff, 1)
            graphics.beginFill(0xde3249)
            graphics.rotation = player.angle
            graphics.drawPolygon([0, -20, 20, 20, -20, 20])
            graphics.endFill()
          }
            " />
          <graphics v-for="(projectile, index) in gameState.projectiles" :key="index" :x="projectile.positionX"
            :y="projectile.positionY" @render="(graphics) => {
              graphics.clear()
              graphics.beginFill(0xde3249)
              graphics.drawCircle(0, 0, 4)
              graphics.endFill()
            }
              " />
        </container>
      </Application>
    </div>
  </main>
</template>
<style>
.game-stats {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>

