import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout/Layout';

function AppContent() {
  return <Layout />;
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;