const express = require('express');
const app = express();
const { spawn } = require('child_process');

app.use(express.json());

app.post('/run', (req, res) => {
  const { tape, program } = req.body;

  const process = spawn('java', ['-jar', 'TuringMachine.jar', tape, program]);

  let output = '';
  process.stdout.on('data', (data) => {
    output += data.toString();
  });

  process.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  process.on('close', (code) => {
    if (code === 0) {
      res.send({ output });
    } else {
      res.status(500).send({ error: 'Execution failed' });
    }
  });
});

app.listen(5001, () => {
  console.log('Turing Service listening on port 5001');
});