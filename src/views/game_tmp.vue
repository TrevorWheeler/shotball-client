<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { Application, onTick } from 'vue3-pixi'
interface A {
  up: boolean;
  left: boolean;
  right: boolean;
  down: boolean;
}
import { onKeyStroke } from '@vueuse/core'
// WebSocket URL
const wsUrl = 'ws://localhost:3000/ws' // Update with your WebSocket URL

const playerDirection: Ref<A> = ref({
  up: false,
  left: false,
  down: false,
  right: false
})
let webSocket: Ref<any> = ref({})
let connected = ref(false);

// // Function to initialize WebSocket
// function initWebSocket() {
//   console.log(wsUrl)
//   webSocket.value = new WebSocket(wsUrl)

//   // webSocket.value.onmessage = (event: any) => {
//   //   // Handle incoming messages
//   //   // console.log(event)

//   //   const keys = JSON.parse(JSON.stringify(event.data))


//   //   playerDirection.value.up = keys.up
//   //   playerDirection.value.down = keys.down
//   //   playerDirection.value.left = keys.left
//   //   playerDirection.value.right = keys.right

//   // }
//   webSocket.value.onmessage = (event: any) => handleMessage(event)

//   webSocket.value.onopen = () => {
//     console.log('WebSocket connected')
//     connected.value = true;

//   }

//   webSocket.value.onerror = (error: any) => {
//     console.error('WebSocket error:', error)
//   }

//   webSocket.value.onclose = () => {
//     console.log('WebSocket disconnected')
//   }


// }

function handleMessage(event: any) {
  const keys: A = JSON.parse(event.data)
console.log(keys)

  playerDirection.value.up = keys.up
  playerDirection.value.down = keys.down
  playerDirection.value.left = keys.left
  playerDirection.value.right = keys.right
}

// Function to send a message
// function sendMessage() {
//   if (webSocket && webSocket.readyState === WebSocket.OPEN) {
//     webSocket.send(message.value)
//     message.value = '' // Clear the input after sending
//   }
// }

onMounted(() => {
  // initWebSocket()
  window.addEventListener('keydown', updateKeyState)
  window.addEventListener('keyup', updateKeyState)

})

onUnmounted(() => {
  if (webSocket.value) {
    webSocket.value.close()
  }
})
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)
const velocity = ref({ x: 0, y: 0 })
const x = ref(120)
const y = ref(120)
const projectiles = ref([])
const mousePosition = ref({ x: 0, y: 0 })
const angle = ref(0)
const targetVelocity = ref({ x: 0, y: 0 })
const keysPressed: Ref<any> = ref({
  w: false,
  a: false,
  s: false,
  d: false
})


function updateKeyState(event) {
  const key = event.key.toLowerCase()
  if (keysPressed.value.hasOwnProperty(key)) {
    console.log(key)
    console.log(event.type)
    keysPressed.value[key] = event.type === 'keydown'
const result = JSON.stringify({ up: keysPressed.value.w, down: keysPressed.value.s, left: keysPressed.value.a, right: keysPressed.value.d })
console.log(result)
    webSocket.value.send(result)
  }
}

onKeyStroke(
  [' '],
  (e) => {
    e.preventDefault()
    console.log(e.key)
    if (e.key === ' ') {
      shootProjectile()
    }
  },
  { keydown: false, keyup: false }
)

function calculateRotationAngle(triangleX, triangleY, mouseX, mouseY) {
  const dy = mouseY - triangleY
  const dx = mouseX - triangleX
  // `Math.atan2` gives the angle from the x-axis, so subtract 90 degrees (in radians)
  // to align the triangle's top with the cursor
  return Math.atan2(dy, dx) - Math.PI / 2 + Math.PI
}

onTick((delta) => {
  const acceleration = 9
  const smoothing = 5 // Adjust for smoother or sharper turns

  // Update target velocity based on key presses
  if (playerDirection.value.up) {
    targetVelocity.value.y = -acceleration;

  } else if (playerDirection.value.down) {
    targetVelocity.value.y = acceleration
  } else {
    targetVelocity.value.y = 0
  }

  if (playerDirection.value.left) {
    targetVelocity.value.x = -acceleration
  } else if (playerDirection.value.right) {
    targetVelocity.value.x = acceleration
  } else {
    targetVelocity.value.x = 0
  }

  // Smoothly interpolate towards the target velocity
  velocity.value.y += (targetVelocity.value.y - velocity.value.y) * smoothing * delta
  velocity.value.x += (targetVelocity.value.x - velocity.value.x) * smoothing * delta

  // Update position
  x.value += velocity.value.x * delta
  y.value += velocity.value.y * delta

  // Clamp values to prevent going off-screen
  x.value = Math.max(0, Math.min(x.value, canvasWidth.value))
  y.value = Math.max(0, Math.min(y.value, canvasHeight.value))

  // Update projectiles
  // ... (your existing projectile logic)
  // Assuming x and y are the coordinates of the triangle's center
  const xCenter = x.value // Replace with your actual center x-coordinate
  const yCenter = y.value // Replace with your actual center y-coordinate
  // const angle = angle.value // Replace with your actual rotation angle in radians

  // Update rotation
  angle.value = calculateRotationAngle(
    x.value,
    y.value,
    mousePosition.value.x,
    mousePosition.value.y
  )
  // console.log(angle)
  const vertices = [
    { x: 0, y: -20 }, // Vertex 1 (top)
    { x: 20, y: 20 }, // Vertex 2 (bottom right)
    { x: -20, y: 20 } // Vertex 3 (bottom left)
  ].map((vertex) => rotateAndTranslate(vertex, angle.value, xCenter, yCenter))

  // console.log(vertices)
  projectiles.value.forEach((projectile) => {
    const circle = { x: projectile.x, y: projectile.y, radius: 4 }
    // console.log("Triangle vertices:", vertices);
    // console.log("Projectile position:", { x: projectile.x, y: projectile.y });

    // Check each vertex
    const vertexInCircle = vertices.some((vertex) => isPointInCircle(vertex, circle))
    console.log(vertexInCircle)

    // Check each edge
    const edgeIntersectsCircle =
      isEdgeIntersectingCircle(vertices[0], vertices[1], circle) ||
      isEdgeIntersectingCircle(vertices[1], vertices[2], circle) ||
      isEdgeIntersectingCircle(vertices[2], vertices[0], circle)

    if (vertexInCircle || edgeIntersectsCircle) {
      console.log('Collision detected')
      // Handle collision
    }

    projectile.x += projectile.velocity.x * delta
    projectile.y += projectile.velocity.y * delta
  })
  // Remove projectiles that go off-screen
  projectiles.value = projectiles.value.filter((projectile) => {
    // Check if the projectile is within the vertical boundaries
    const withinVerticalBounds = projectile.y >= 0 && projectile.y <= canvasHeight.value
    // Check if the projectile is within the horizontal boundaries
    const withinHorizontalBounds = projectile.x >= 0 && projectile.x <= canvasWidth.value
    return withinVerticalBounds && withinHorizontalBounds
  })
})
function rotateAndTranslate(point, angle, centerX, centerY) {
  // Rotate around the center (0, 0)
  let rotatedX = Math.cos(angle) * point.x - Math.sin(angle) * point.y
  let rotatedY = Math.sin(angle) * point.x + Math.cos(angle) * point.y

  // Then translate the point to its actual position
  return { x: rotatedX + centerX, y: rotatedY + centerY }
}

function shootProjectile() {
  // const speed = 5 // Set the speed of the projectile
  // const velocity = calculateProjectileVelocity(
  //   x.value,
  //   y.value,
  //   mousePosition.value.x,
  //   mousePosition.value.y,
  //   speed
  // )
  //
  // projectiles.value.push({
  //   x: x.value, // Starting position (same as main graphic)
  //   y: y.value, // Starting position (same as main graphic)
  //   velocity: velocity
  // }


  //   // Calculate the position of the top vertex of the triangle
  // const topVertex = rotateAndTranslate({ x: 0, y: -20 }, angle.value, x.value, y.value);
  //
  // // Calculate the velocity of the projectile towards the mouse position
  // const projectileVelocity = calculateProjectileVelocity(
  //   topVertex.x,
  //   topVertex.y,
  //   mousePosition.value.x,
  //   mousePosition.value.y,
  //   5 // Speed of the projectile
  // );
  //
  // // Create the projectile at the top vertex position
  // projectiles.value.push({
  //   x: topVertex.x,
  //   y: topVertex.y,
  //   velocity: projectileVelocity
  // });
  // Calculate the position of the top vertex of the triangle
  const topVertex = rotateAndTranslate({ x: 0, y: -20 }, angle.value, x.value, y.value);

  // Calculate a small offset to move the starting position of the projectile
  const offset = calculateOffset(angle.value, 0, -5); // Adjust the value 10 as needed

  // Starting position of the projectile, slightly outside the top vertex
  const startPosition = {
    x: topVertex.x + offset.x,
    y: topVertex.y + offset.y
  };

  // Calculate the velocity of the projectile towards the mouse position
  const projectileVelocity = calculateProjectileVelocity(
    startPosition.x,
    startPosition.y,
    mousePosition.value.x,
    mousePosition.value.y,
    13// Speed of the projectile
  );

  // Create the projectile at the adjusted starting position
  projectiles.value.push({
    x: startPosition.x,
    y: startPosition.y,
    velocity: projectileVelocity
  });
}

// function calculateOffset(angle, distance) {
//   return {
//     x: Math.cos(angle) * distance,
//     y: Math.sin(angle) * distance
//   };
// }
function calculateOffset(angle, distance, perpendicularDistance) {
  return {
    x: Math.cos(angle) * distance - Math.sin(angle) * perpendicularDistance,
    y: Math.sin(angle) * distance + Math.cos(angle) * perpendicularDistance
  };
}


function calculateProjectileVelocity(originX, originY, targetX, targetY, speed) {
  const dx = targetX - originX
  const dy = targetY - originY
  const angle = Math.atan2(dy, dx)

  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed
  }
}
function isPointInCircle(point, circle) {
  const dx = point.x - circle.x
  const dy = point.y - circle.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < circle.radius
}
function isEdgeIntersectingCircle(edgeStart, edgeEnd, circle) {
  const edgeLength = Math.sqrt(
    Math.pow(edgeEnd.x - edgeStart.x, 2) + Math.pow(edgeEnd.y - edgeStart.y, 2)
  )
  const dot =
    ((circle.x - edgeStart.x) * (edgeEnd.x - edgeStart.x) +
      (circle.y - edgeStart.y) * (edgeEnd.y - edgeStart.y)) /
    Math.pow(edgeLength, 2)

  const closestPoint = {
    x: edgeStart.x + dot * (edgeEnd.x - edgeStart.x),
    y: edgeStart.y + dot * (edgeEnd.y - edgeStart.y)
  }

  const onSegment = dot > 0 && dot < 1
  const distance = Math.sqrt(
    Math.pow(circle.x - closestPoint.x, 2) + Math.pow(circle.y - closestPoint.y, 2)
  )

  return distance < circle.radius && onSegment
}
// Reset velocity on key release
window.addEventListener('keyup', (e) => {
  if (['w', 's', 'a', 'd'].includes(e.key)) {
    velocity.value = { x: 0, y: 0 }
  }
})
function updateMousePosition(event) {
  const bounds = event.target.getBoundingClientRect()
  mousePosition.value = {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top
  }
}
</script>

<template>
  <main>
    <div class="game-stats">
      {{ keysPressed }}
      {{ playerDirection }}
      {{ projectiles.length }}
      height:{{ canvasHeight }} width: {{ canvasWidth }}
      <!-- <button @click="sendMessage">click</button> -->
    </div>
    <div @mousemove="updateMousePosition" @click="shootProjectile" v-if="connected">
      <Application :width="canvasWidth" :height="canvasHeight">
        <container>
          <graphics :x="x" :y="y" @render="(graphics) => {
            graphics.clear()
            graphics.lineStyle(2, 0xff00ff, 1)
            graphics.beginFill(0xde3249)
            graphics.rotation = angle
            graphics.drawPolygon([0, -20, 20, 20, -20, 20])
            graphics.endFill()
          }
            " />
          <graphics v-for="(projectile, index) in projectiles" :key="index" :x="projectile.x" :y="projectile.y" @render="(graphics) => {
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
