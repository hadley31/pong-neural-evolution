class Paddle {
	constructor(x, w, h, speed) {
		this.x = x;
		this.width = w;
		this.height = h;
		this.speed = speed;

		this.reset();
	}

	reset() {
		this.y = height / 2;

		this.hits = 0;
		this.goals = 0;
		this.goalsAgainst = 0;
	}

	update() {
		if (this == this.game.paddle_one) {
			if (keyIsDown(87)) {
				this.move(1);
			} else if (keyIsDown(83)) {
				this.move(-1);
			}
		} else {
			if (keyIsDown(38)) {
				this.move(1);
			}
			if (keyIsDown(40)) {
				this.move(-1);
			}
		}
	}

	move(direction) {
		this.y -= this.speed * Math.sign(direction);

		if (this.y > height - this.height / 2) {
			this.y = height - this.height / 2;
		} else if (this.y < this.height / 2) {
			this.y = this.height / 2;
		}
	}

	render(col) {
		rectMode(CENTER);
		stroke(0);
		strokeWeight(1);
		fill(col || 190);
		rect(this.x, this.y, this.width, this.height);
	}

	otherPaddle() {
		if (this == this.game.paddle_one) {
			return this.game.paddle_two;
		} else if (this == this.game.paddle_two) {
			return this.game.paddle_one;
		}

		return null;
	}
}

const PADDLE_CONFIG = {
	x: 20,
	w: 10,
	h: 100,
	speed: 3
}

class AIPaddle extends Paddle {
	constructor(config) {
		super(config.x, config.w, config.h, config.speed);
		this.config = config;
		this.brain = config.brain || new NeuralNetwork(4, 10, 2);
	}

	update() {
		let ball = this.game.ball;

		let inputs = [abs (this.x - ball.x), ball.y - this.y, ball.velocity.x, ball.velocity.y];

		//* Sync

		let result = this.brain.predictSync(inputs);
		let dir = 0;

		if (result[0] > result[1] && result[0] > 0.5) {
			dir = 1;
		} else if (result[1] > result[0] && result[1] > 0.5) {
			dir = -1;
		}

		this.move(dir);

		/*/

		//* Async

		this.brain.predict(inputs).then(
			(result) => {
				let dir = 0;

				if (result[0] > result[1] && result[0] > 0.5) {
					dir = 1;
				} else if (result[1] > result[0] && result[1] > 0.5) {
					dir = -1;
				}

				this.move(dir);
			}
		);

		//*/




	}

	render(rgb) {
		super.render(rgb);
		textAlign(CENTER, CENTER);
		textSize(10);
		fill(255);
		text(nf(this.getFitness(), 1, 1), this.x, this.y);
	}

	clone() {
		let config = Object.assign({}, this.config);

		let newPaddle = new AIPaddle(config);
		newPaddle.brain.dispose();
		newPaddle.brain = this.brain.clone();

		return newPaddle;
	}

	crossover(other, childCount) {
		childCount = childCount || 1;
		let children = [];

		let parentA_hid_dna = this.brain.hidden_weights.dataSync();
		let parentA_out_dna = this.brain.output_weights.dataSync();
		let parentB_hid_dna = other.brain.hidden_weights.dataSync();
		let parentB_out_dna = other.brain.output_weights.dataSync();

		for (let i = 0; i < childCount; i++) {
			let mid = Math.floor(Math.random() * parentA_hid_dna.length);
			let child_hid_dna = [...parentA_hid_dna.slice(0, mid), ...parentB_hid_dna.slice(mid, parentB_hid_dna.length)];
			let child_out_dna = [...parentA_out_dna.slice(0, mid), ...parentB_out_dna.slice(mid, parentB_out_dna.length)];

			let child = this.clone();
			let hidden_shape = this.brain.hidden_weights.shape;
			let output_shape = this.brain.output_weights.shape;

			child.brain.dispose();

			child.brain.hidden_weights = tf.tensor(child_hid_dna, hidden_shape);
			child.brain.output_weights = tf.tensor(child_out_dna, output_shape);

			child.mutate();

			children.push(child);
		}

		return children;
	}

	mutate() {
		function fn(x) {
			if (random(1) < 0.1) {
				let offset = randomGaussian() * 0.5;
				let newx = x + offset;
				return newx;
			} else {
				return x;
			}
		}

		let hid = this.brain.hidden_weights.dataSync().map(fn);
		let hid_shape = this.brain.hidden_weights.shape;
		this.brain.hidden_weights.dispose();
		this.brain.hidden_weights = tf.tensor(hid, hid_shape);

		let out = this.brain.output_weights.dataSync().map(fn);
		let out_shape = this.brain.output_weights.shape;
		this.brain.output_weights.dispose();
		this.brain.output_weights = tf.tensor(out, out_shape);
	}

	getFitness() {
		let counter = this.goalsAgainst != 0 ? this.goalsAgainst * 2 : 0.5;
		return this.hits / counter;
	}
}