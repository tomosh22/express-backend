# StuBank

StuBank is a web app for student banking, built using React, Express and Node.

## Installation

1. Unzip the source code.
2. Install [npm](https://www.npmjs.com/).
3. Install [yarn](https://classic.yarnpkg.com/en/docs/install/).
4. Open a terminal in the folder location.
5. Run `yarn install` in `react-app` to install all of the needed dependencies.
6. Run `npm install` in `express-backend` to install all of the needed dependencies.
7. Navigate to `express-backend/database`, run `docker build -t stubank .` to build the docker image for the database (ensure you don't forget the `.` at the end of the command.
8. Run `npm run dockerStart` in the same location to run the docker image.
9. *If running on Mac, change line 26 of `react-app/package.json` to `"start": "PORT=3001 react-scripts start",`*
10. Run `yarn start` in `react-app`. If it does not automatically launch, navigate to [http://localhost:3001/](http://localhost:3001/) and move onto the next step.
11. Run `npm start` in `express-backend`. Verify the server is running by checking for “Server is ready to take messages” in terminal.

The app is now fully running and ready to go.

To try it on mobile, navigate to the IP that is provided in the terminal after running `yarn start`. Alternatively, use browser dev tools to simulate a mobile device with device mode.

## Usage
The web app allows you to create a StuBank account, sign in, create accounts and move money. For more information, view the FAQ page on the web app.

To test admin functionality, navigate to /admin and use the following details:

Username: admin\
Password: Pass1234