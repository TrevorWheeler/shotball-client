export interface GameState {
  gameId: string;
  players: Player[]
  projectiles: Projectile[]
}

export interface Player {
  playerId: string;
  username: string;
  positionX: number;
  positionY: number;
  // controls: PlayerDirection
  angle: number
}


export interface GameEnter {
  token: string;
  gameState: GameState
}

export interface PlayerCapturedControls {
  up: boolean;
  left: boolean;
  right: boolean;
  down: boolean;
  mousePositionY: number;
  mousePositionX: number
}

export interface Projectile {
  projectileId: string;
  playerId: string;
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
}