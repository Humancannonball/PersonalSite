const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const java = require('java');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

java.options.push('--enable-preview');
java.classpath.push('TuringMachine.jar');
java.newInstancePromise = util.promisify(java.newInstance);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/prisoner', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'prisoner.html'));
});

app.get('/turing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'turing.html'));
});

app.get('/runTuring', async (req, res) => {
  const tape = req.query.tape;
  const program = req.query.program.replace(/\r\n/g, '\n');

  try {
    const machine = await java.newInstancePromise('TuringMachine');
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

app.get('/runGameTheory', async (req, res) => {
  let parameters = [];
  const iterations = req.query.iterations;
  delete req.query.iterations;

  for (let param in req.query) {
    parameters.push(req.query[param]);
  }

  const command = `java -jar GameTheory.jar ${iterations} ${parameters.join(' ')}`;
  try {
    const { stdout } = await exec(command);
    console.log(`stdout: ${stdout}`);
    res.send(stdout);
} catch (error) {
    console.error(`exec error: ${error}`);
    res.status(500).send({ error: error.toString() });
}
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});