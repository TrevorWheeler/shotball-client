<template>
  <div class="home-container">
    <div class="welcome-message">
      <h1>Welcome to Shotball!</h1>
      <p>Get ready to play and create a lobby to get started!</p>
    </div>
    <form @submit.prevent="submit" class="lobby-form">
      <button type="submit" class="create-lobby-btn">Create Lobby</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import Mitt from '@/plugins/mitt';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '@/store';
const store = useStore();
const router = useRouter();
const route = useRoute();
import { ref } from 'vue';

async function submit() {
  const gameId: string | null = await createLobby();
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
      store.sendMessage("create_game", null);
      Mitt.on('game_created', (gameId: string) => {
        clearTimeout(timeout);
        resolve(gameId);
        Mitt.off('game_created');
      });

      timeout = setTimeout(() => {
        console.log("timing out");
        Mitt.off('game_created');
        resolve(null);
      }, 5000);
    } catch (error) {
      clearTimeout(timeout);
      Mitt.off('game_created');
      resolve(null);
    }
  });
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.welcome-message h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.welcome-message p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.lobby-form {
  display: flex;
  justify-content: center;
}
</style>