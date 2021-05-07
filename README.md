# Quiz Overflow

This app will test your developer knowledge by presenting you with multiple choice questions.

Get as many right as possible.

## Installation

Install all packages.

```
npm install
```

Create and populate the database.

```
psql -d <'Your Postgres URI> -f quiz_overflow_postgres_create.sql
```

Create a `.env` file in the root directory of the project to store your Postgres URI and JSON Web Token Private Key.

```
PG_URI='Your Postgres URI'
JWT_PRIVATE_KEY='Your JWT Key'
```

Compile all files and start the server.

```
npm run build
npm run start
```

## Database Schema

Full database schema and population scripts will be provided in the next release.
