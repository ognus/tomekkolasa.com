HTTP status codes for RESTful APIs

200 OK - successful GET, POST or HEAD request
201 Created - successful POST request creating a new resource
204 No Content - successful PUT, PATCH or DELETE request when no data returned
400 Bad Request - when request is malformed, e.g. incorrect JSON syntax in the body
401 Unauthorized - not authenticated due to missing, incorrect or expired auth token
403 Forbidded - not authorized to access the resource, e.g. wrong user role
404 Not Found - resource not found
409 Conflict - e.g. resource already updated (PUT) or user already exists (POST)
422 Unprocessable Entity - when validation fails, e.g. incorrect user e-mail
500 Internal Server Error - runtime error, when the API crashes
