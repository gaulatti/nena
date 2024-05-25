import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import './App.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { Route, Routes } from 'react-router-dom';

const items = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: <MailOutlined />,
  },
  {
    label: 'Navigation Two',
    key: 'app',
    icon: <AppstoreOutlined />,
    disabled: true,
  }
];
function App() {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <>
      <Authenticator>
        {({ signOut, user }) => (
          <div>
            <nav>
              <button onClick={signOut}>Sign out {JSON.stringify(user)}</button>
            </nav>
            <Routes>
              <Route
                path='/'
                element={
                  <>
                    <Menu onClick={onClick} selectedKeys={[current]} mode='horizontal' items={items} />;
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
                }
              />
            </Routes>
          </div>
        )}
      </Authenticator>
    </>
  );
}

export default App;
