# URL Shortner Assignment
URL shortener service that will accept a URL as an argument over a REST API and return a shortened URL as a result.

The code have following features:
*  If you again ask for the same URL, it will give you the same URL as it gave before instead
of generating a new one.
* If the user clicks on the short URL then he will be redirected to the original URL.

### How to test:

1. Build the Code
```
npm i
```

2. Start the Server

```
node server.js
```

3. Send a POST Request to shorten a URL from the terminal

```
curl -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com"}' http://localhost:3000/shorten
```

4. Get the Shortened URL: The response from the server will contain a JSON object with a shortcode field, which represents the shortened URL. Copy this shortcode.

5. Access the Shortened URL: Paste the shortcode into your browser's address bar preceded by http://localhost:3000/ (assuming your server is running on localhost at port 3000). For example, if the shortcode is abcd1234, you would access http://localhost:3000/abcd1234. This should redirect you to the original URL.

6. Retrieve Metrics:

```
curl http://localhost:3000/metrics
```

### Docker

```
docker pull pankajchaudhary/assignment:0.0.1.RELEASE
```

Run the docker image

```
docker container run -d -p 3000:3000 pankajchaudhary/assignment:0.0.1.RELEASE
```
