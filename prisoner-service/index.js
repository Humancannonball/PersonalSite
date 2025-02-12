const express = require('express');
const { spawn } = require('child_process');
const app = express();

app.get('/run', (req, res) => {
  const iterations = req.query.iterations;
  const parameters = Object.keys(req.query)
    .filter(key => key !== 'iterations')
    .map(key => req.query[key]);

  const args = ['-jar', 'GameTheory.jar', iterations, ...parameters];

  const process = spawn('java', args);

  let output = '';
  process.stdout.on('data', (data) => {
    output += data.toString();
  });

  process.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  process.on('close', (code) => {
    if (code === 0) {
      res.send(output);
    } else {
      res.status(500).send({ error: 'Execution failed' });
    }
  });
});

app.listen(5000, () => {
  console.log('Prisoner Service listening on port 5000');
});
