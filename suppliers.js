const fattureInCloudSdk = require("@fattureincloud/fattureincloud-js-sdk");

module.exports = function(RED) {
	function GeneralNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', async function(msg) {
			node.status({fill:"blue",shape:"dot",text:"Requesting"});
			try {
				msg.payload = await listsuppliers(msg.token);
				node.status({})
			} catch (error) {
				node.status({fill:"red",shape:"ring",text:"Error"});
				msg.payload = error
			}
			node.send(msg);
		});
	}
	RED.nodes.registerType("suppliers",GeneralNode);
	
	async function listsuppliers(accessToken) {
		let defaultClient = fattureInCloudSdk.ApiClient.instance;
		let OAuth2AuthenticationCodeFlow = defaultClient.authentications['OAuth2AuthenticationCodeFlow'];
    OAuth2AuthenticationCodeFlow.accessToken = accessToken;

		 // Retrieve the first company id
		 let userApiInstance = new fattureInCloudSdk.UserApi();
		 let userCompaniesResponse = await userApiInstance.listUserCompanies();
		 let firstCompanyId = userCompaniesResponse.data.companies[0].id;

		 // Retrieve the list of the suppliers
		 let suppliersApiInstance = new fattureInCloudSdk.suppliersApi();
		 let companysuppliers = await suppliersApiInstance.listsuppliers(firstCompanyId);
		 
		 return JSON.stringify(companysuppliers.data)
	}
}

