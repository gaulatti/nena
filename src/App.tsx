import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import { useState } from 'react';
import './App.css';

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(false);

  /**
   * Redirects the user to the sign-in page if they are not signed in.
   */
  fetchAuthSession().then((authSession) => {
    if (!authSession.userSub) {
      signInWithRedirect({ provider: { custom: 'Okta' } });
    } else {
      setAuthenticatedUser(true);
    }
  });

  return (
    authenticatedUser && (
      <div>
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
    )
  );
}

export default App;
