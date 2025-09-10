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

      // =============================================================
      //                    STRATEGY IMPLEMENTATION
      // =============================================================

      // Check for incoming bullets
      /**
       * @type {{ bullet: Bullet, distance: number} | undefined}
       */
      let dangerousBullet;

      world.bullets.forEach((bullet) => {
        const distance = world.getDistanceToTarget(bullet.x, bullet.y);

        const bulletTotalDistance = bullet.traveledDistance + distance;
        const botRange = getBotRange(world.enemies[0]);

        if (bulletTotalDistance > botRange) {
          return;
        }

        const dx = bullet.x - world.self.x;
        const dy = bullet.y - world.self.y;

        // Check if bullet is heading towards us
        const bulletAngle = Math.atan2(-bullet.vy, -bullet.vx);
        const angleToUs = Math.atan2(dy, dx);
        const angleDiff = Math.abs(bulletAngle - angleToUs);

        if (angleDiff > 0.5) {
          return;
        }

        dangerousBullet = { bullet, distance };
      });

      if (dangerousBullet) {
        if (world.self.canShield) {
          // Block at the last second
          if (
            dangerousBullet.distance - dangerousBullet.bullet.speed <
            BOT_WIDTH
          ) {
            action.shield = true;
            return action;
          }
        } else {
          if (
            dangerousBullet.distance >
            BOT_WIDTH + world.self.stats.speed / 2 - dangerousBullet.distance
          ) {
            // Dodge perpendicular to bullet
            const dodgeAngle =
              Math.atan2(dangerousBullet.bullet.vy, dangerousBullet.bullet.vx) +
              Math.PI / 2;
            action.moveDirection = dodgeAngle;
            return action;
          }
        }
      }

      // Use the getDistanceToTarget helper method
      const distance = world.getDistanceToTarget(enemy.x, enemy.y);

      // Keep optimal distance
      if (distance > world.self.range) {
        action.moveDirection = world.directionTo(enemy.x, enemy.y);
        return action;
      }

      // Shoot if we can using shootAt helper
      if (world.self.canShoot && distance <= world.self.range) {
        if (!lastEnemyStats) {
          action.shoot = world.shootAt(enemy.x, enemy.y);
          return action;
        }
        // Shoot where the enemy will be (assuming they continued their path)
        const enemyVx = enemy.x - lastEnemyStats.x;
        const enemyVy = enemy.y - lastEnemyStats.y;
        action.shoot = world.shootAt(enemy.x + enemyVx, enemy.y + enemyVy);
        return action;
      }

      // =============================================================
      //                    RETURN YOUR ACTION
      // =============================================================
      return action;
    } finally {
      lastEnemyStats = world.enemies[0];

      if (action.moveDirection != null) {
        lookingTowardAngle = action.moveDirection;
      }

      if (action.shoot != null && lookingTowardAngle != null) {
        const diffAngle = (lookingTowardAngle - action.shoot) % (Math.PI * 2);
        if (diffAngle >= Math.PI / 2 || diffAngle <= -Math.PI / 2) {
          action.moveDirection = action.shoot;
          lookingTowardAngle = action.moveDirection;
          delete action.shoot;
        }
      }
    }
  },
});
