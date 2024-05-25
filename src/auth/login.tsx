import { Button } from 'antd';

const Login = () => {
  const loginWithGoogle = () => {
    // do signin with google
  };

  return (
    <div>
      <Button onClick={loginWithGoogle}>Sign in with Google</Button>
    </div>
  );
};

export { Login };
