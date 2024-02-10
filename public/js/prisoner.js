// Generate the checkboxes
const params = [
  { name: 'RandomPlayer', description: 'This player makes random moves.' },
  { name: 'TitForTat', description: 'This player replicates the opponent\'s last move.' },
  { name: 'TitForTwoTats', description: 'This player replicates the opponent\'s last two moves.' },
  { name: 'Pavlov', description: 'This player cooperates if both players made the same move in the last round, otherwise defects.' },
  { name: 'Unforgiving', description: 'This player cooperates until the opponent defects, then always defects.' },
  { name: 'Naive', description: 'This player always cooperates.' },
  { name: 'Abusive', description: 'This player always defects.' },
  { name: 'param20', description: 'This is a custom player.' }
];
params.forEach(param => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = param.name;
  checkbox.name = param.name;
  checkbox.value = param.name;

  const label = document.createElement('label');
  label.htmlFor = param.name;
  label.title = param.description; // Add the tooltip text
  label.appendChild(document.createTextNode(param.name));

  document.getElementById('paramForm').appendChild(checkbox);
  document.getElementById('paramForm').appendChild(label);
  document.getElementById('paramForm').appendChild(document.createElement('br'));
});
// Function to sort the table
function sortTable(table, columnIndex, isAlphabetical) {
  const rows = Array.from(table.rows).slice(1); // Get all rows except the header
  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent;
    const cellB = rowB.cells[columnIndex].textContent;
    return isAlphabetical ? cellA.localeCompare(cellB) : Number(cellA) - Number(cellB);
  });
  rows.forEach(row => table.appendChild(row)); // Append the sorted rows back into the table
}
function getSummaryScores(table) {
  const scores = {};
  const rows = Array.from(table.rows).slice(1); // Get all rows except the header
  rows.forEach(row => {
    const name = row.cells[0].textContent; // 'Player 1'
    const score = Number(row.cells[2].textContent); // 'Score'
    scores[name] = (scores[name] || 0) + score;
  });
  return scores;
}
function createSummaryTable(scores) {
  const table = document.createElement('table');

  // Add a header row
  const headerRow = document.createElement('tr');
  ['Player', 'Total Score'].forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Add a row for each player
  Object.entries(scores).forEach(([player, score]) => {
    const row = document.createElement('tr');
    const tdPlayer = document.createElement('td');
    tdPlayer.textContent = player;
    const tdScore = document.createElement('td');
    tdScore.textContent = score;
    row.appendChild(tdPlayer);
    row.appendChild(tdScore);
    table.appendChild(row);
  });

  return table;
} 

document.getElementById('paramForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the iteration number
  const iterations = document.getElementById('iterations').value;
  // Start building the URL with the iterations parameter first
  let url = `http://localhost:3000/runJava?iterations=${iterations}&`;

  let counter = 0;

  params.forEach(param => {
    const checkbox = document.getElementById(param.name);
    if (checkbox.checked) {
      url += `${param.name}=${checkbox.value}&`;
      counter++;
    }
  });

  if (counter < 2) {
    alert('Please select at least two parameters.');
    return;
    
  }
// Create a sort button for score
const sortButtonScore = document.createElement('button');
sortButtonScore.textContent = 'Sort by Score';
sortButtonScore.addEventListener('click', () => sortTable(2, false)); // Sort by 'Score' column

// Create a sort button for first name
const sortButtonName = document.createElement('button');
sortButtonName.textContent = 'Sort by First Name';
sortButtonName.addEventListener('click', () => sortTable(0, true)); // Sort by 'Player 1' column

// Append the sort buttons to the buttonsOutput element
const buttonsOutput = document.getElementById('buttonsOutput');
buttonsOutput.textContent = ''; // Clear the buttonsOutput element
buttonsOutput.appendChild(sortButtonScore);
buttonsOutput.appendChild(sortButtonName);

  fetch(url)
    .then(response => response.text())
    .then(data => {
      // Split the output into lines
      const lines = data.trim().split('\n');

      // Create a table
      const table = document.createElement('table');

      // Add a header row
      const headerRow = document.createElement('tr');
      ['Player 1', 'Player 2', 'Score'].forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.addEventListener('click', () => sortTable(index));
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
    // Create a sort button for score
    const sortButtonScore = document.createElement('button');
    sortButtonScore.textContent = 'Sort by Score';
    sortButtonScore.addEventListener('click', () => sortTable(table, 2, false)); // Sort by 'Score' column

    // Create a sort button for first name
    const sortButtonName = document.createElement('button');
    sortButtonName.textContent = 'Sort by First Name';
    sortButtonName.addEventListener('click', () => sortTable(table, 0, true)); // Sort by 'Player 1' column

    // Append the sort buttons to the buttonsOutput element
    const buttonsOutput = document.getElementById('buttonsOutput');
    buttonsOutput.textContent = ''; // Clear the buttonsOutput element
    buttonsOutput.appendChild(sortButtonScore);
    buttonsOutput.appendChild(sortButtonName);

      // Add a row for each line of output
      lines.forEach(line => {
        const [player1, player2, score] = line.split(',');
        const row = document.createElement('tr');
        [player1, player2, score].forEach(text => {
          const td = document.createElement('td');
          td.textContent = text;
          row.appendChild(td);
        });
        table.appendChild(row);
      });

      const output = document.getElementById('output');
      output.textContent = ''; // Clear the output element
      
      // Append the main table to the output element
      output.appendChild(table);
      
      // Get the summary scores and create the summary table
      const scores = getSummaryScores(table);
      const summaryTable = createSummaryTable(scores);
      
      // Append the summary table to the output element
      output.appendChild(summaryTable);

    });
});