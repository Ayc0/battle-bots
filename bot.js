// @ts-check

/**
 * @import {Enemy, Self, Bullet, World, Action} from "./bot.d.ts"
 */

/**
 * @param {Enemy} bot
 * @returns number
 */
const getBotRange = (bot) => {
  const baseRange = 150;
  const rangeMultiplier = 75;
  return baseRange + (bot.stats?.range || 1) * rangeMultiplier;
};

const BOT_WIDTH = 45;
/**
 * @type {undefined | Enemy}
 */
let lastEnemyStats;

/**
 * @type {number | undefined | null}
 */
let lookingTowardAngle;

/*
 * ===================================================================
 *                    BITS ARENA - ROBOT SKELETON
 * ===================================================================
 *
 * This is a comprehensive template for creating your own robot strategy.
 * Copy this file and modify the action() function to implement your bot's behavior.
 *
 * IMPORTANT:
 * - Name, emoji, color, and stats are set in the config page, not here
 * - Only the action() function matters in this file
 * - Upload this .js file in the configuration page
 *
 * ===================================================================
 */

bots.push({
  action(world) {
    bots.forEach((b) => {
      if (b.name !== "-1") {
        return;
      }
      b.shieldCooldown = 0;
      b.shootCooldown = 0;
      b.stats.range = 10;
      b.stats.strength = 10;
      console.log(b);
    });
    /**
     * @type {Action}
     */
    const action = {
      moveDirection: null,
    };
    try {
      if (!world.enemies.length) {
        return action;
      }

      const enemy = world.enemies[0];

      // Shoot if we can using shootAt helper

      if (!lastEnemyStats) {
        action.shoot = world.shootAt(enemy.x, enemy.y);
        return action;
      }
      // Shoot where the enemy will be (assuming they continued their path)
      const enemyVx = enemy.x - lastEnemyStats.x;
      const enemyVy = enemy.y - lastEnemyStats.y;
      action.shoot = world.shootAt(enemy.x + enemyVx, enemy.y + enemyVy);
      return action;
    } finally {
      lastEnemyStats = world.enemies[0];
    }
  },
});
