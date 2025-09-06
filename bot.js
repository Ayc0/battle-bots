// @ts-check

/**
 * @import {World, Action} from "./bot.d.ts"
 */

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

    // =============================================================
    //                    STRATEGY IMPLEMENTATION
    // =============================================================

    // Check for incoming bullets
    const dangerousBullets = world.bullets.filter((bullet) => {
      const dx = bullet.x - world.self.x;
      const dy = bullet.y - world.self.y;

      // Use the getDistanceToTarget helper method
      const distance = world.getDistanceToTarget(bullet.x, bullet.y);

      // Check if bullet is heading towards us
      const bulletAngle = Math.atan2(bullet.vy, bullet.vx);
      const angleToUs = Math.atan2(dy, dx);
      const angleDiff = Math.abs(bulletAngle - angleToUs);

      return distance < 120 && angleDiff < 0.5;
    });

    if (dangerousBullets.length > 0) {
      if (world.self.canShield) {
        // Use shield if available
        action.shield = true;
      } else {
        // Dodge perpendicular to bullet
        const bullet = dangerousBullets[0];
        const dodgeAngle = Math.atan2(bullet.vy, bullet.vx) + Math.PI / 2;
        action.moveDirection = dodgeAngle;
      }
    } else if (world.enemies.length > 0) {
      // Attack when safe
      const enemy = world.enemies[0];

      // Use the getDistanceToTarget helper method
      const distance = world.getDistanceToTarget(enemy.x, enemy.y);

      console.log({
        distance,
        range: world.self.range,
      });

      // Keep optimal distance
      if (distance > world.self.range * 0.8) {
        action.moveDirection = world.directionTo(enemy.x, enemy.y);
      } else if (distance < world.self.range * 0.3) {
        // Move away from enemy using directionAwayFrom helper
        action.moveDirection = world.directionAwayFrom(enemy.x, enemy.y);
      } else {
        console.log("other");
      }

      // Shoot if we can using shootAt helper
      if (world.self.canShoot && distance <= world.self.range) {
        action.shoot = world.shootAt(enemy.x, enemy.y);
      }
    }

    // console.log(world, action);

    // =============================================================
    //                    RETURN YOUR ACTION
    // =============================================================
    return action;
  },
});
