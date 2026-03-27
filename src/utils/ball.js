export const INITIAL_SPEED = 370;

export const changeBallSpeed = (ball, newSpeed, currentSpeed) => {
    const vx = ball.body.velocity.x;
    const vy = ball.body.velocity.y;

    const factor = newSpeed / currentSpeed;

    ball.setVelocity(vx * factor, vy * factor);
};
