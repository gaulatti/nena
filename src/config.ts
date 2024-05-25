import { ResourcesConfig } from 'aws-amplify';
import { AmplifyOutputs, LegacyConfig } from 'aws-amplify/adapter-core';

type config = {
  aws: ResourcesConfig | LegacyConfig | AmplifyOutputs;
};

const config = {
  aws: {
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_txjkNx1Ft',
        userPoolClientId: '4quc7eapin0hta2o3npl9si5f9',
      },
    },
  },
};

export { config };
