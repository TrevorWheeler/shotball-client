import type { GameEnter, GameState } from '@/types/Game'
import mitt from 'mitt'

type Events = {
  game_created: string
  playerId: string
  game_enter: GameEnter
  game_update: GameState
  player_death: any
}

const Mitt = mitt<Events>() // inferred as Emitter<Events>

export default Mitt
