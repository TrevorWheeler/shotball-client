<script setup lang="ts">
import Mitt from '@/plugins/mitt';
import { useStore } from '@/store';
import type { GameEnter, GameState } from '@/types/Game';
const store = useStore()
import { onMounted, ref, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const username: Ref<string> = ref("")


async function submit() {
  const gameEnter: GameEnter | null = await joinLobby()

  if (!gameEnter) {
    return;
  }


  store.gameState = gameEnter.gameState
  store.token = gameEnter.token
  router.push({
    name: 'game',
    params: { id: gameEnter.gameState.gameId },
  });
console.log("HIUT")
}


function joinLobby(): Promise<GameEnter | null> {
  let timeout: any;
  return new Promise((resolve, reject) => {
    try {
      store.sendMessage("join_game", { username: username.value, lobbyId: route.params.id })
      // Listen for the response
      Mitt.on('game_enter',
        (gameEnter: GameEnter) => {
          clearTimeout(timeout); // Clear the timeout on successful response
          resolve(gameEnter); // Resolve the promise with the data
          Mitt.off('playerId'); // Remove the event listener
        },
      );
      // Set a timeout to resolve the promise if not resolved within 5 seconds
      const timeout = setTimeout(() => {
        console.log("timing out")
        Mitt.off('game_enter');
        resolve(null);
      }, 5000);
    } catch (error) {
      if (timeout) {
        clearTimeout(timeout); // Clear the timeout in case of an exception
      }
      Mitt.off('game_enter'); // Remove the event listener
      resolve(null); // Resolve with null in case of an exception
    }
  });
}


onMounted(() => {



})
</script>

<template>
  <div class="container-fluid">
    <form @submit.prevent="submit">

      <!-- Markup example 1: input is inside label -->
      <label for="player">
        Gamer Name
        <input type="text" id="player" name="firstname" placeholder="Gamer Name" v-model="username" required>
      </label>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.container-fluid {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;


}

button {
  margin-bottom: 0;
}

form {
  max-width: 500px;
}
</style>
@/types/Game