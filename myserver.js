const express = require("express");
const calc = require('@smogon/calc');
const app = express();

const { Generations, Pokemon, Move, calculate } = require('@smogon/calc');


app.listen(3000, () => {
	console.log("Server running on port 3000");
});

// parse application/json
app.use(express.json())

app.post("/calculate",(req, res, next) => {
    // Print request information
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('Params:', req.params);

    if (!calc || !calc.Generations) {
        throw new Error("calc or calc.Generations is not defined");
    }

    // Extract data from the request body
    const generation = req.body.gen;
    const attackerName = req.body.attackingPokemon;
    const defenderName = req.body.defendingPokemon;
    const moveName = req.body.moveName;

    // Check if the required data is provided
    if (!generation || !attackerName || !defenderName || !moveName) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        // Use the provided data in the calculation
        const gen = Generations.get(generation);
        const result = calculate(
            gen,
            new Pokemon(gen, attackerName),
            new Pokemon(gen, defenderName),
            new Move(gen, moveName)
        );

        console.log(result.desc())

        // Send the result back as a response
        res.json(result);
    } catch (error) {
        // Handle any errors that might occur
        res.status(500).json({ error: error.message });
    }
})

app.use(express.static('dist'))
