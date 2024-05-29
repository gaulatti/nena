import { ResourcesConfig } from 'aws-amplify';
import { AmplifyOutputs, LegacyConfig } from 'aws-amplify/adapter-core';

/**
 * Configuration for the application.
 */
type Config = {
  aws: ResourcesConfig | LegacyConfig | AmplifyOutputs;
};

const config: Config = {
  aws: {
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_txjkNx1Ft',
        userPoolClientId: '4quc7eapin0hta2o3npl9si5f9',
        loginWith: {
          oauth: {
            domain: 'aitana.auth.us-east-1.amazoncognito.com',
            scopes: ['email', 'openid'],
            redirectSignIn: ['https://nena.gaulatti.com/', 'http://localhost:5173/'],
            redirectSignOut: ['https://nena.gaulatti.com/logout', 'http://localhost:5173/logout'],
            responseType: 'code',
          },
        },
      },
    },
  },
};

export { config };
