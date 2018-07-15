class Generation {
	constructor(population) {

		this.population = population;
		this.generation = 0;
		this.agents = [];

	}

	firstGeneration(Type) {
		for (let i = 0; i < this.population; i++) {
			const paddle1 = new Type(PADDLE_CONFIG);
			const paddle2 = new Type(PADDLE_CONFIG);

			this.agents.push(paddle1);
			this.agents.push(paddle2);
		}

		this.generation = 1;
	}

	orderAgents() {
		var minIdx, temp, len = this.agents.length;
		for (let i = 0; i < len; i++) {
			minIdx = i;
			for (let j = i + 1; j < len; j++) {
				if (this.agents[j].getFitness() < this.agents[minIdx].getFitness()) {
					minIdx = j;
				}
			}

			temp = this.agents[i];
			this.agents[i] = this.agents[minIdx];
			this.agents[minIdx] = temp;
		}

		this.agents = this.agents.reverse();
	}

	getBest() {
		let best = this.agents[0];

		for (let i = 1; i < this.agents.length; i++) {
			if (this.agents[i].getFitness() > best.getFitness()) {
				best = this.agents[i];
			}
		}

		return best;
	}

	pickOne ()
	{
		let r = random ();
		let index = floor (this.agents.length * (1 - r * r));
		return this.agents[index];
	}

	nextGeneration() {
		if (this.generation == 0) {
			console.log("You must do firstGeneration first! (hence the name)");
			return;
		}

		console.log("Generation " + this.generation + " Complete");

		let nextGen = [];

		this.orderAgents();

		console.log("Highest fitness: " + nf(this.agents[0].getFitness(), 1, 1));

		let top = this.agents.slice(0, 4);

		for (let i = 0; i < top.length; i++) {
			nextGen.push(top[i].clone());
		}

		for (let i = 0; nextGen.length < this.agents.length; i++) {
			let p1 = this.pickOne ();
			let p2 = this.pickOne ();

			let child = p1.crossover(p2, 1)[0];
			
			nextGen.push(child);
		}

		for (let i = 0; i < this.agents.length; i++) {
			this.agents[i].brain.dispose();
		}

		this.agents = nextGen;

		this.generation++;
	}
}