<template>
  <div class="container-fluid">
    <form @submit.prevent="submit">
      <button type="submit">Create Lobby</button>
    </form>
  </div>
</template>


<script setup lang="ts">
import Mitt from '@/plugins/mitt';
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store';
const store = useStore()
const router = useRouter()
const route = useRoute()
import { ref, type Ref } from 'vue'
import { onTick } from 'vue3-pixi';



async function submit() {
  const gameId: string | null = await createLobby()
  if (!gameId) {
    return;
  }
  router.push({
    name: 'joinGame',
    params: { id: gameId }
  });

}

function createLobby(): Promise<string | null> {
  let timeout: any;
  return new Promise((resolve, reject) => {
    try {
      store.sendMessage("create_game", null)
      // Listen for the response
      Mitt.on('game_created',
        (gameId: string) => {
          clearTimeout(timeout); // Clear the timeout on successful response
          resolve(gameId); // Resolve the promise with the data
          Mitt.off('game_created'); // Remove the event listener
        },
      );
      // Set a timeout to resolve the promise if not resolved within 5 seconds
      const timeout = setTimeout(() => {
        console.log("timing out")
        Mitt.off('game_created');
        resolve(null);
      }, 5000);
    } catch (error) {
      if (timeout) {
        clearTimeout(timeout); // Clear the timeout in case of an exception
      }
      Mitt.off('game_created'); // Remove the event listener
      resolve(null); // Resolve with null in case of an exception
    }
  });
}


// onTick((delta) => {
// console.log(delta)
// })
</script>



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
