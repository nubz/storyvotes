This is a side project of mine built with React and Semantic-UI to run with Firebase Realtime Database.

Set up to solve the problem of having a free way of remotely voting on stories without seeing each others votes before 
voting is complete. Previous solutions, tried since Covid-19 lockdown began, included video conference countdowns to entering a score into a spreadsheet or slack channel with quite mixed results. Voters could often see how others had voted before casting their own, much against the scrum principle.

# Overview

## Usage

Create an account to be able to add teams and stories to vote on. 

Create a team with team name and avatar

Create stories by choosing which of your teams it belongs to, naming them (e.g. scrum ticket name or number), 
setting max number of voters and set the voting mode (Fibonacci, Days, T-Shirt or YesNo)

Share the team access link (shown in your teams list or the url on your team page) with voters, 
voters do not need to create an account to vote - the link contains the access code

Voters:

* can register to vote on any story they can see that is open for registration
* cannot see stories from teams they do not have access to
* can have access to many teams.

Once a voter has registered they are able to vote in secret straight away.

Once all voters have registered for a story the registration will close.

The owner of the story can close registration at any point after at least one voter has registered.

Voters will not see each other's votes until all votes have been cast.

Anyone with team access can see who has voted (but not how they voted), and once all voters have voted then see the 
final votes cast.

The app will make a recommendation on the option voted for most frequently, or highlight joint candidates if it's a tie.

# To run on your own Firebase project

No doubt, if you want to use this tool, you will want to own the data, domain, and in particular the email addresses of 
team owners. 

Clone this repository, bearing in mind it will not have a firebase project to connect to automatically, you need to use 
your own!

[Create a firebase project](https://firebase.google.com/) with realtime database, storage (for avatars) and, optionally, 
hosting

## Firebase credentials

You will need your own Firebase credentials, populate a `.env` file with the creds from your Firebase console

Your `.env` file should live in the root of the project and contain values for these keys (available from your firebase 
console)

    REACT_APP_API_KEY=<your api key>
    REACT_APP_AUTH_DOMAIN=<your app auth domain>
    REACT_APP_DATABASE_URL=<your app database url>
    REACT_APP_PROJECT_ID=<your project id>
    REACT_APP_STORAGE_BUCKET=<your storage bucket>
    REACT_APP_MESSAGING_SENDER_ID=<your messaging sender id>
    REACT_APP_ID=<your app id>

## Add Firebase SDK

[Guide](https://firebase.google.com/docs/web/setup) to setting up the sdk and tools you will need.

## Install the packages from this repo

### `$: npm install`

All packages will be installed and that includes the firebase package.

### `$: firebase init`

This will set up the firebase integration, choose `build` as the target directory to publish, and when challenged about 
any existing `rules` files choose `not to overwrite` so that you can use the ones in this repo.

## Run the app

### `$: npm start`

Should launch into a browser and will try and connect to firebase using your creds

## Build and deploy

### `$: npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.<br />
Your app is ready to be deployed!

Either use `firebase deploy` or see the `create-react-app` section about 
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
