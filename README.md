This is a side project of mine built to run with Firebase Realtime Database.

Set up to solve the problem of having a way of remotely voting on stories without seeing each others votes before voting is complete.

[See my hosted version](https://storyvotes.web.app)

# Overview

Create an account to be able to add teams and stories to vote on. 

Create a team

Create stories by simply naming them (e.g. scrum ticket name or number), 
setting max number of voters, set voting mode (Fibonacci, Days, T-Shirt or YesNo)

Share the team access link (shown in your teams list or the url on your team page) with voters, 
voters do not need to create an account to vote.

Voters can register to vote on any story they can see that is open for registration. Voters cannot see stories from
teams they do not have access to. Voters can have access to many teams.

Once a voter has registered they are able to vote in secret straight away.

Once all voters have registered for a story the registration will close.

The owner of the story can close registration at any point after at least one voter has registered.

Voters will not see each other's votes until all votes have been cast.

Anyone with team access can see the voting in progress, and the final votes cast.

The app will make a recommendation on the option voted for most frequently, or highlight joint candidates if it's a tie.

# To run on your own Firebase project

Clone this repository bearing in mind it will not have a firebase project to connect to automatically, you need to use your own!

## Firebase credentials

You will need your own Firebase credentials, populate a .env file with the creds from your Firebase console

### `npm install`

You will need to run this first

## `firebase init`

### `npm start`

Should launch into a browser and will try and connect to firebase using your creds

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the create-react-app section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.