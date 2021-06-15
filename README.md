# URL shortener

# Concept:
Live demo: https://url-shortener-julienmcoding.herokuapp.com/

# User story:

1> You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}

2> When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.

3> If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }
