import React from 'react'
import { render } from '@testing-library/react'
import './index.css'
import App from './components/App'
import Firebase, { FirebaseContext } from './components/Firebase'

test('renders story votes link', () => {
  const { getByText } = render(
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>)
  const linkElement = getByText(/StoryVotes/i);
  expect(linkElement).toBeInTheDocument();
});
