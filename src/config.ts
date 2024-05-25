import { ResourcesConfig } from 'aws-amplify';
import { AmplifyOutputs, LegacyConfig } from 'aws-amplify/adapter-core';

type config = {
  aws: ResourcesConfig | LegacyConfig | AmplifyOutputs;
};

const config = {
  aws: {
    Auth: {
      Cognito: {
        userPoolId: 'your-user-pool-id',
        userPoolClientId: 'your-app-client-id',
      },
    },
  },
};

export { config };
