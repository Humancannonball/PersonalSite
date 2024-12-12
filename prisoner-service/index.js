const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const app = express();

app.get('/run', async (req, res) => {
  const iterations = req.query.iterations;
  delete req.query.iterations;
  const parameters = Object.values(req.query);

  const command = `java -jar GameTheory.jar ${iterations} ${parameters.join(' ')}`;
  try {
    const { stdout } = await exec(command);
    res.send(stdout);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.listen(5000, () => {
  console.log('Prisoner Service listening on port 5000');
});