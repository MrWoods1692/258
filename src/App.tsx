import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import routes from './routes';
import { ThemeProvider } from 'next-themes';
import { ClickEffect } from './components/common/ClickEffect';

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <ClickEffect />
      </Router>
    </ThemeProvider>
  );
};

export default App;
