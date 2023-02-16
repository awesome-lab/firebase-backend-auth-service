## 🐎 FIREBASE BACKEND AUTH SERVICE

This is a simple service to authenticate with googleapis.

### _Configuration_

The service is configued thorugh a config.ts file. You can find a config.sample.ts file in the root of the project. Replace the values with your own.

#### Installation

```bash
npm install googleapis-auth-service
```

#### Development Usage

```javascript
npm run dev
```

#### Production Usage

```javascript
npm run build
npm start
```

DOCKER -> use the DockerFile to build a docker image

## More Info ℹ️

1°) Use **signInWithPassword** to log in at initial stage

```bash
curl 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]' \
-H 'Content-Type: application/json' \
--data-binary '{"email":"[user@example.com]","password":"[PASSWORD]","returnSecureToken":true}'
```

2°) Store the credentials into a backend service such as (node-persist, redis, etc.)

3°) use the **refreshToken** to get a new token with the following command

```bash
curl 'https://securetoken.googleapis.com/v1/token?key=[API_KEY]' \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data 'grant_type=refresh_token&refresh_token=[REFRESH_TOKEN]'
```

## Other 🚧

**IMPORTANT**: The refresh token is valid for 1 hour, so you need to store it in a backend service and refresh it every hour.

**DO NOT** call **signInWithPassword** endpoint for each request, spaming will get you a quota error limit.

**DO NOT** use the auth code into the browser or any direct front-end solution, it's only for the server side. You'll risk to expose your personnal credentials such as email, password and API_KEY.

### License [MIT](https://choosealicense.com/licenses/mit/)

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
