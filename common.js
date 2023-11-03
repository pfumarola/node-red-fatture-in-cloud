function getAccessToken(node, config, msg) {
  switch (config.accessTokenSourceType) {
    case "msg":
      token = msg[config.accessTokenSource];
      break;
    case "flow":
      token = node.context().flow.get(config.accessTokenSource);
      break;
    case "global":
      token = node.context().global.get(config.accessTokenSource);
      break;
    case "env":
      token = env.get(config.accessTokenSource);
      break;

  }
  return token;
}

function handleErrors(node, error, msg) {
  node.status({ fill: "red", shape: "ring", text: "Error" });
  switch (error.status) {
    case 401:
      node.error("Unauthorized. Please provide a valid access token.", msg);
      break;
    case 403:
      node.error("Forbidden. Please ensure to grant the right permissions to this resource inside your Fatture in Cloud instance.", msg);
      break;
  
    default:
      node.error(error, msg);
      break;
  }
}

exports.getAccessToken = getAccessToken;

exports.handleErrors = handleErrors;