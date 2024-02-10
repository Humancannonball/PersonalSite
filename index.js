const express = require('express');
const { exec } = require('child_process');
const java = require('java');
const path = require('path');
const app = express();
const port = 3000;

java.options.push('--enable-preview');
java.classpath.push('TuringMachine.jar');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Prisoner's Dilemma page route
app.get('/prisoner', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'prisoner.html'));
});

// Turing Machine page route
app.get('/turing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'turing.html'));
});
app.get('/runTuring', (req, res) => {
  const tape = req.query.tape;
  const program = req.query.program.replace(/\r\n/g, '\n');

  java.newInstance('TuringMachine', (err, machine) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: err.toString() });
    }

    try {
      machine.setInputSync(tape);
      machine.loadStatesSync(program);
      machine.loadProgramSync(program);

      machine.runSync();

      const output = machine.getOutputSync();

      res.send({ output });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.toString() });
    }
  });
});
app.get('/runJava', (req, res) => {
  let parameters = [];
  const iterations = req.query.iterations;
  delete req.query.iterations;

  for (let param in req.query) {
    parameters.push(req.query[param]);
  }

  const command = `java -jar GameTheory.jar ${iterations} ${parameters.join(' ')}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send(stdout);
  });
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});