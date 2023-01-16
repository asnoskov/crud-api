# Crud api   

This is a simple crud api app with in-memory users database.

## How to start the application

Run 'npm run start:dev' script to run application in development mode (it will watch changes and rebuild app automaticaly).

Value of port on which application is running stored in .env file.

## How to start tests

1. Run 'npm run start:dev' script to start the application from the scratch (to ensure that in-memory
    database is empty before tests running - it is nessesary for tests to work properly).
2. Run 'npm run test' script (in another terminal) to start e2e tests.

## Endpoints description:

Implemented endpoint api/users:

    GET api/users is used to get all persons
    Server should answer with status code 200 and all users records
    GET api/users/{userId}
    Server should answer with status code 200 and and record with id === userId if it exists
    Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
    Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    POST api/users is used to create record about new user and store it in database
    Server should answer with status code 201 and newly created record
    Server should answer with status code 400 and corresponding message if request body does not contain required fields
    PUT api/users/{userId} is used to update existing user
    Server should answer with status code 200 and updated record
    Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
    Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    DELETE api/users/{userId} is used to delete existing user from database
    Server should answer with status code 204 if the record is found and deleted
    Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
    Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

## User format description:

Users are objects that have following properties:
    id — unique identifier (string, uuid) generated on server side
    username — user's name (string, required)
    age — user's age (number, required)
    hobbies — user's hobbies (array of strings or empty array, required)