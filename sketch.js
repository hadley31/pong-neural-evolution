const VIEWMODE_ALL = 0;
const VIEWMODE_BEST = 1;
const VIEWMODE_ONE = 2;

let viewmode = 0;
let viewmode_one_index = 0;

let generation;
let games;

let iterations = 1;

let max_score = 5;
let live_on_amount = 2;

//#region Setup / Draw

const version_id = 2;

function setup() {
	console.log('id: ' + version_id);

	createCanvas(800, 600);

	generation = new Generation(25);
	generation.firstGeneration(AIPaddle);
	createGames();
}

function draw() {

	for (let i = 0; i < iterations; i++) {
		update();
	}

	render();
}

function update() {
	if (allGamesDone()) {
		nextGeneration();
		return;
	}

	for (let i = 0; i < games.length; i++) {
		games[i].update();
	}
}

function render() {
	background(51);

	textAlign(CENTER, TOP);
	textSize(20);
	fill(255);
	text("Gen: " + generation.generation + ", Best: " + nf(generation.getBest().getFitness(), 1, 1), width / 2, 10);

	if (viewmode == VIEWMODE_BEST) {
		generation.getBest().game.render();
	}
	else if (viewmode == VIEWMODE_ONE) {
		generation.agents[viewmode_one_index].game.render ();
	} else if (viewmode == VIEWMODE_ALL) {
		for (let i = 0; i < games.length; i++) {
			games[i].render();
		}
	}
}

function nextGeneration() {
	generation.nextGeneration();
	createGames();
}

function createGames() {
	games = [];
	for (let i = 0; i < generation.agents.length; i += 2) {
		const paddle1 = generation.agents[i];
		const paddle2 = generation.agents[i + 1];
		const ball = new Ball(10);

		let game = new Game(paddle1, paddle2, ball, color(random(255), random(255), random(255), 150));
		game.start();

		games.push(game);
	}
}

function allGamesDone() {
	for (let i = 0; i < games.length; i++) {
		if (games[i].isDone() == false) {
			return false;
		}
	}
	return true;
}

function keyPressed() {
	if (keyCode == 86) {
		viewmode = (viewmode + 1) % 3;
	}
	if (keyCode == 38) {
		viewmode_one_index = (viewmode_one_index + 1) % generation.agents.length;
	}
	if (keyCode === 40) {
		viewmode_one_index = (viewmode_one_index - 1) % generation.agents.length;
	}
}

function saveToJSON() {


	saveJSON(json, 'generation.json');
}

//#endregion