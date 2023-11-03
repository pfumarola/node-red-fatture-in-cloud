const fattureInCloudSdk = require("@fattureincloud/fattureincloud-js-sdk");
const common = require("../common");

module.exports = function (RED) {
  function CustomersNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on("input", async function (msg) {
      
      let token = common.getAccessToken(node, config, msg);

      try {
        node.status({ fill: "blue", shape: "dot", text: "Requesting" });
        msg.payload = await listCustomers(token, msg.opts);
        node.status({});
      } catch (error) {
        common.handleErrors(node, error, msg);
        return;
      }
      node.send(msg);
    });
  }
  RED.nodes.registerType("customers", CustomersNode);

  async function listCustomers(accessToken, opts) {
    let defaultClient = fattureInCloudSdk.ApiClient.instance;
    let OAuth2AuthenticationCodeFlow =
      defaultClient.authentications["OAuth2AuthenticationCodeFlow"];
    OAuth2AuthenticationCodeFlow.accessToken = accessToken;

    // Retrieve the first company id
    let userApiInstance = new fattureInCloudSdk.UserApi();
    let userCompaniesResponse = await userApiInstance.listUserCompanies();
    let firstCompanyId = userCompaniesResponse.data.companies[0].id;

    // Retrieve the list of the customers
    let clientsApiInstance = new fattureInCloudSdk.ClientsApi();
    let companyClients = await clientsApiInstance.listClients(
      firstCompanyId,
      opts || {}
    );

    return companyClients;
  }
};
