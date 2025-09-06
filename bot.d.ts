type Stat = {
  speed: number; //   1-10: Movement speed multiplier
  strength: number; //   1-10: Bullet damage
  health: number; //   1-10: Max HP
  range: number; //   1-10: Shooting range multiplier
};

type Enemy = {
  x: number;
  y: number;
  hp: number;
  stats: Stat;
};

type Bullet = {
  // Array of bullets
  x: number; //   Bullet X position
  y: number; //   Bullet Y position
  vx: number; //   Bullet X velocity
  vy: number; //   Bullet Y velocity
  damage: number; //   Bullet damage
  maxRange: number; //   Maximum bullet range
  traveledDistance: number; // Distance traveled so far
  life: number; //   Remaining bullet lifetime
  speed: number; //   Bullet speed
};

type Map = {
  // Arena boundaries
  width: number; //   Arena width
  height: number; //   Arena height
  x: number; //   Arena left edge
  y: number; //   Arena top edge
};

export type World = {
  self: {
    x: number;
    y: number;
    hp: number;
    canShoot: boolean;
    canShield: boolean;
    shootingState: string;
    stats: Stat;
    range: number; // Actual shooting range in pixels
  };

  enemies: Enemy[];

  bullets: Bullet[];

  map: Map;

  tick: number; // Current game time

  /**
   * Helper method to calculate distance from your robot to a target
   * @returns Euclidean distance as a number
   */
  getDistanceToTarget: (targetX: number, targetY: number) => number;

  /**
   * Helper method to calculate shooting angle towards a target
   * @returns Angle in radians to aim at the target
   */
  shootAt: (targetX: number, targetY: number) => number;

  /**
   * Helper method to calculate direction angle to move towards a target
   * @returns Angle in radians to move toward the target
   */
  directionTo: (targetX: number, targetY: number) => number;

  /**
   * Helper method to calculate direction angle to move away from a target
   * @param targetX
   * @param targetY
   * @returns Angle in radians to move away from the target
   */
  directionAwayFrom: (targetX: number, targetY: number) => number;
};

export type Action = {
  /**
   * angle in radians, or null to stay still
   */
  moveDirection: number | null;
  /**
   * boolean, activates 360-degree protection
   */
  shield?: boolean;
  /**
   * angle in radians, or undefined/null to not shoot
   */
  shoot?: number | null;
};

type Bot = {
  action: (world: World) => Action;
};

declare global {
  declare const bots: Bot[];
}
