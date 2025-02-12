const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express(); // Added


app.use(express.json());

app.post('/runTuring', (req, res) => {
  const { tape, program } = req.body;
  const jarPath = path.join(__dirname, 'TuringMachine.jar');
  const process = spawn('java', ['--enable-preview', '-cp', jarPath, 'TuringMachineDriver', tape, program]);
  let output = '';
  process.stdout.on('data', (data) => { output += data.toString(); });
  process.stderr.on('data', (data) => { console.error(`Error: ${data}`); });

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
