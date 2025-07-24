import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import './styles/globals.css';
import './styles/utilities/utilities.css';
import './styles/utilities/animations.css';
import './styles/utilities/responsive.css';
import './styles/components/buttons.css';
import './styles/components/forms.css';
import './styles/components/cards.css';
import './styles/layouts/layout.css';
import './styles/pages/assessment.css';
import './App.css';

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
