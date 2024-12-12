const express = require('express');
const app = express();
const util = require('util');
const exec = util.promisify(require('child_process').exec);

app.use(express.json());

app.post('/run', async (req, res) => {
  const { tape, program } = req.body;
  const command = `java -jar TuringMachine.jar "${tape}" "${program.replace(/\n/g, '\\n')}"`;
  try {
    const { stdout } = await exec(command);
    res.send({ output: stdout });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.listen(5001, () => {
  console.log('Turing Service listening on port 5001');
});