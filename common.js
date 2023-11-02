function getAccessToken(node, config) {
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

exports.getAccessToken = getAccessToken;