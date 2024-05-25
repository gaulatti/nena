import { Button } from 'antd';
import { useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './auth/login';

function App() {
  const signOut = useCallback(() => {
    console.log('signout');
  }, []);

  return (
    <div>
      <nav>
        <Button onClick={signOut}>Sign out</Button>
      </nav>

      <>
        <iframe
          width='560'
          height='315'
          src='https://www.youtube.com/embed/Fp2K-z-9nMQ?si=UKSfFg_Q02lsy7rl'
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
        ></iframe>
      </>
    </div>
  );
}

export default App;
