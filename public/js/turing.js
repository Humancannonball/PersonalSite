$(document).ready(function() {
  $('form').on('submit', function(event) {
    event.preventDefault();

    $.ajax({
      url: '/runTuring',
      type: 'get',
      data: $(this).serialize(),
      success: function(data) {
        $('#output').text(data.output);
      },
      error: function(err) {
        $('#output').text('Error: ' + err.responseJSON.error);
      }
    });
  });

  $('#binaryPalindromeChecker').on('click', function() {
    $('#tape').val('1001001');
    $('#program').val(
`0 0 _ r 1o
0 1 _ r 1i
0 _ _ * accept
1o _ _ l 2o
1o * * r 1o
1i _ _ l 2i
1i * * r 1i
2o 0 _ l 3
2o _ _ * accept
2o * * * reject
2i 1 _ l 3
2i _ _ * accept
2i * * * reject
3 _ _ * accept
3 * * l 4
4 * * l 4
4 _ _ r 0
accept * : r accept2
accept2 * ) * halt-accept
reject _ : r reject2
reject * _ l reject
reject2 * ( * halt-reject`
    );
  });
  $('#binaryToDecimalConverter').on('click', function() {
    $('#tape').val('10110');
    $('#program').val(
`0 * * * 1
1 _ _ r 1
1 * * r 1a
1a * * r 1a
1a _ _ l 2
1b _ _ r 1
1b * * r 1b
2 1 0 l 3
2 0 1 l 2
2 _ _ r 20
3 * * l 3
3 _ _ l 4
4 0 1 r 1b
4 1 2 r 1b
4 2 3 r 1b
4 3 4 r 1b
4 4 5 r 1b
4 5 6 r 1b
4 6 7 r 1b
4 7 8 r 1b
4 8 9 r 1b
4 9 0 l 4
4 _ 1 r 1b
20 _ _ l 21
20 * _ r 20
21 _ _ l 21
21 * * l 21a
21a * * l 21a
21a _ _ r halt`
    );
  });
});