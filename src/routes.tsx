import HomePage from './pages/HomePage';
import MembersPage from './pages/MembersPage';
import GalleryPage from './pages/GalleryPage';
import MessageBoardPage from './pages/MessageBoardPage';
import AboutWebsitePage from './pages/AboutWebsitePage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <HomePage />,
    visible: true
  },
  {
    name: '班级成员',
    path: '/members',
    element: <MembersPage />,
    visible: true
  },
  {
    name: '时光相册',
    path: '/gallery',
    element: <GalleryPage />,
    visible: true
  },
  {
    name: '关于网站',
    path: '/about-website',
    element: <AboutWebsitePage />,
    visible: true
  },
  {
    name: '留言板',
    path: '/message-board',
    element: <MessageBoardPage />,
    visible: false
  }
];

export default routes;
