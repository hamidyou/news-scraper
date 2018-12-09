$(document).on('click', '#submit', function () {
  // Grab the id associated with the article from the submit button
  const thisId = $(this).attr('data-id')

  $.ajax({
    method: 'POST',
    url: '/articles/' + thisId,
    data: {
      // Value taken from title input
      author: $('#author_' + thisId).val(),
      // Value taken from note textarea
      body: $('#comment_' + thisId).val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      return data
      // Empty the notes section
    })

  // Also, remove the values entered in the input and textarea for note entry
  $('#author_' + thisId).val('')
  $('#comment_' + thisId).val('')
})

$(document).on('click', '#scrape', () => {
  $.ajax({
    method: 'GET',
    url: '/scrape'
  })
    .then(data => {
      console.log(data)
      location.replace('/Articles')
    })
})
