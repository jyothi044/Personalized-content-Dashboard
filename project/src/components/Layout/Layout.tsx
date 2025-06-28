import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentFeed from '../Content/ContentFeed';
import SettingsPanel from '../Settings/SettingsPanel';
import { loadUserData } from '../../store/slices/userSlice';
import { initializeTheme } from '../../store/slices/uiSlice';

const Layout: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserData());
    dispatch(initializeTheme());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 overflow-auto">
            <ContentFeed />
          </main>
        </div>
      </div>
      <SettingsPanel />
    </div>
  );
};

export default Layout;