export type AmplifyDependentResourcesAttributes = {
  api: {
    redditclonemain: {
      GraphQLAPIEndpointOutput: "string";
      GraphQLAPIIdOutput: "string";
      GraphQLAPIKeyOutput: "string";
    };
  };
  auth: {
    redditclonemaind7158d75: {
      AppClientID: "string";
      AppClientIDWeb: "string";
      IdentityPoolId: "us-east-2:63118e0c-9b59-4e87-80bf-58d60d9cd32a";
      IdentityPoolName: "redditclonemaind7158d75_identitypool_d7158d75__dev";
      UserPoolArn: "arn:aws:cognito-idp:us-east-2:592063341171:userpool/us-east-2_dELujpKk4";
      UserPoolId: "us-east-2_dELujpKk4";
      UserPoolName: "redditclonemaind7158d75_userpool_d7158d75-dev";
    };
  };
  storage: {
    S3test: {
      BucketName: "string";
      Region: "string";
    };
  };
};
