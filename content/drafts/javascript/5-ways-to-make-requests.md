## XHR

```javascript
const data = { email: "goku@capsule.corp", password: "kamehameha" };

const xhr = new XMLHttpRequest();

xhr.onload = () => {
    // print JSON response
    if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        const response = JSON.parse(xhr.responseText);
        console.log(response);
    }
};

// prepare and send the request
xhr.open('POST', 'https://example.com/login');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify(json));
```

## Fetch API

POST:

```javascript
const data = { email: "goku@capsule.corp", password: "kamehameha" };

const response = await fetch("https://example.com/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

// 200 - 299
if (response.ok) {
  const { token } = await response.json();
} else if (response.status < 400) {
  console.log("redirect");
}

```

## Axios

## ?

## request-promise
