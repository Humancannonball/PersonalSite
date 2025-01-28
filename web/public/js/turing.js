$(document).ready(function() {
  $('form').on('submit', function(event) {
    event.preventDefault();
  
    $.ajax({
      url: '/runTuring',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        tape: $('#tape').val(),
        program: $('#program').val()
      }),
      success: function(data) {
        $('#output').text(data.output);
      },
      error: function(err) {
        $('#output').text('Error: ' + (err.responseJSON.error || 'Execution failed'));
      }
    });
  });

  $('#binaryPalindromeChecker').on('click', function() {
    $('#tape').val('1001001');
    $('#program').val(
`0 0 _ R 1o
0 1 _ R 1i
0 _ _ * accept
1o _ _ L 2o
1o * * R 1o
1i _ _ L 2i
1i * * R 1i
2o 0 _ L 3
2o _ _ * accept
2o * * * reject
2i 1 _ L 3
2i _ _ * accept
2i * * * reject
3 _ _ * accept
3 * * L 4
4 * * L 4
4 _ _ R 0
accept * : R accept2
accept2 * ) * halt-accept
reject _ : R reject2
reject * _ L reject
reject2 * ( * halt-reject`
    );
  });
  $('#binaryToDecimalConverter').on('click', function() {
    $('#tape').val('10110');
    $('#program').val(
`0 * * * 1
1 _ _ R 1
1 * * R 1a
1a * * R 1a
1a _ _ L 2
1b _ _ R 1
1b * * R 1b
2 1 0 L 3
2 0 1 L 2
2 _ _ R 20
3 * * L 3
3 _ _ L 4
4 0 1 R 1b
4 1 2 R 1b
4 2 3 R 1b
4 3 4 R 1b
4 4 5 R 1b
4 5 6 R 1b
4 6 7 R 1b
4 7 8 R 1b
4 8 9 R 1b
4 9 0 L 4
4 _ 1 R 1b
20 _ _ L 21
20 * _ R 20
21 _ _ L 21
21 * * L 21a
21a * * L 21a
21a _ _ R halt`
    );
  });
});