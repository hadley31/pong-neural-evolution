class Game
{
	constructor (paddle1, paddle2, ball, rgb)
	{
		this.paddle_one = paddle1;
		this.paddle_one.game = this;
		this.paddle_one.x = 20;

		this.paddle_two = paddle2;
		this.paddle_two.game = this;
		this.paddle_two.x = width - 20;

		this.ball = ball;
		this.ball.game = this;

		this.running = false;
		this.xStart = -1;

		this.rgb = rgb || 190;
	}

	start ()
	{
		this.ball.reset ();


		this.resume ();
	}

	stop ()
	{
		this.running = false;
	}

	stopShowing ()
	{
		this.showing = false;
	}

	stopAll ()
	{
		this.stop ();
		this.stopShowing ();
	}

	resume ()
	{
		this.running = true;
		this.showing = true;
	}

	update ()
	{
		if (this.running)
		{
			this.paddle_one.update ();
			this.paddle_two.update ();
			this.ball.update ();
		}
	}

	render ()
	{
		if (this.showing)
		{
			this.paddle_one.render (this.rgb);
			this.paddle_two.render (this.rgb);
			this.ball.render (this.rgb);
		}
	}

	isDone ()
	{
		return this.paddle_one.goals >= 5 || this.paddle_two.goals >= 5;
	}
}