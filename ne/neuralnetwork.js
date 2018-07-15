class NeuralNetwork
{
	constructor (input_nodes, hidden_nodes, output_nodes)
	{
		this.input_nodes = input_nodes;
		this.hidden_nodes = hidden_nodes;
		this.output_nodes = output_nodes;


		this.hidden_weights = tf.randomNormal ([this.input_nodes, this.hidden_nodes]);
		this.output_weights = tf.randomNormal ([this.hidden_nodes, this.output_nodes]);

		// this.hidden_biases = tf.randomNormal ([this.input_nodes]);
		// this.output_biases = tf.randomNormal ([this.hidden_nodes]);
	}


	predict (user_input)
	{
		let output;

		tf.tidy
		(
			() => 
			{
				let input_layer = tf.tensor (user_input, [1, this.input_nodes]);
				let hidden_layer = input_layer.matMul (this.hidden_weights).sigmoid ();
				let output_layer = hidden_layer.matMul (this.output_weights).sigmoid ();

				output = output_layer.data ();
			}
		)

		return output;
	}

	predictSync (user_input)
	{
		let output;

		tf.tidy
		(
			() => 
			{
				let input_layer = tf.tensor (user_input, [1, this.input_nodes]);
				let hidden_layer = input_layer.matMul (this.hidden_weights).sigmoid ();
				let output_layer = hidden_layer.matMul (this.output_weights).sigmoid ();

				output = output_layer.dataSync ();
			}
		)

		return output;
	}

	clone ()
	{
		let newClone = new NeuralNetwork (this.input_nodes, this.hidden_nodes, this.output_nodes);

		newClone.dispose ();

		newClone.hidden_weights = tf.clone (this.hidden_weights);
		newClone.output_weights = tf.clone (this.output_weights);

		return newClone;
	}

	dispose ()
	{
		this.hidden_weights.dispose ();
		this.output_weights.dispose ();
	}

	toJSON ()
	{
		let json = {};
		
		json.hidden_layer = network.hidden_layer.dataSync();
		json.output_layer = network.output_layer.dataSync();

		return json;
	}
}