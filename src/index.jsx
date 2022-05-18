import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { UserProvider } from './utils/context/context'
import { CommentsProviter } from './utils/context/context'
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <UserProvider>
    <CommentsProviter>
      <App />
    </CommentsProviter>
  </UserProvider>
)
