class Ball {
	constructor(r) {
		this.radius = r;
		this.speed = 7;

		this.x = width / 2;
		this.y = height / 2;
	}

	randomizeDirection(xDir, yDir) {

		angleMode(DEGREES);

		const angle = random(60.0);

		let x = cos(angle) * (random () < 0.5 ? 1 : -1);
		let y = sin(angle) * (random () < 0.5 ? 1 : -1);

		if (xDir != undefined)
		{
			x = Math.sign (xDir) * abs (x);
		}

		if (yDir != undefined)
		{
			y = Math.sign (yDir) * abs (y);
		}

		this.setDirection(x, y);
	}

	setDirection(x, y) {
		this.direction = createVector(x, y);
		this.direction.normalize();



		this.velocity = this.direction.mult(this.speed);
	}

	reset(dir) {

		this.x = width / 2;
		this.y = height / 2;

		this.randomizeDirection(dir);
	}

	update() {
		if (this.x < this.radius) {
			this.onScore(this.game.paddle_two);
			this.reset(1);
		} else if (this.x > width - this.radius) {
			this.onScore(this.game.paddle_one);
			this.reset(-1);
		}

		// If the ball is touching the edge, reflect on the y
		if ((this.y < this.radius && this.velocity.y < 0) || (this.y > height - this.radius && this.velocity.y > 0)) {
			this.velocity.y = -this.velocity.y;
		}

		// IF the ball is touching a paddle, reflect on the x
		if (intersects(this, this.game.paddle_one) && this.velocity.x < 0 || intersects(this, this.game.paddle_two) && this.velocity.x > 0) {

			let paddle = this.velocity.x < 0 ? this.game.paddle_one : this.game.paddle_two;

			paddle.hits++;

			let x = -this.velocity.x;
			let y = this.velocity.y;
			if (random () < 0.85)
			{
				y = map ((this.y - paddle.y) * 1.2, -paddle.height / 2, paddle.height / 2, -abs(x) , abs(x));
			}

			this.setDirection (x, y);
		}

		if (abs (this.velocity.y) < 0.2)
		{
			this.velocity.y += 0.5;
		}

		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}

	render(col) {
		stroke(0);
		strokeWeight(1);
		fill(col || 190);
		ellipseMode(RADIUS);
		ellipse(this.x, this.y, this.radius);
	}

	onScore(paddle) {
		let other = paddle.otherPaddle();

		paddle.goals++;
		other.goalsAgainst++;

		if (paddle.goals >= 5) {
			this.game.stopAll ();
		}
	}
}




function intersects(ball, paddle) {
	// The distance we are calculating is the from the center of the ball to the center of the paddle
	let distX = abs(paddle.x - ball.x);
	let distY = abs(paddle.y - ball.y);

	if (distX <= paddle.width / 2 && distY <= paddle.height / 2) {
		return true;
	}

	// Here we are getting points on the edge of the paddle, closest to where the ball is
	let px = clamp(ball.x, paddle.x - paddle.width / 2, paddle.x + paddle.width / 2);
	let py = clamp(ball.y, paddle.y - paddle.height / 2, paddle.y + paddle.height / 2);

	// The distance we are now calculating is from the center of the ball to the point on the edge of the paddle
	distX = ball.x - px;
	distY = ball.y - py;

	return distX * distX + distY * distY <= ball.radius * ball.radius;
}

function clamp(x, min, max) {
	if (x < min) {
		return min;
	}
	if (x > max) {
		return max;
	}

	return x;
}

function clamp01 (x)
{
	return clamp (x, 0, 1);
}