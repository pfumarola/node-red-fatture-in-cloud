module.exports = function(RED) {
	function GeneralNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', async function(msg) {
			msg.payload = await listsupplierss(msg.token);
			node.send(msg);
		});
	}
	RED.nodes.registerType("suppliers",GeneralNode);
	
	async function listsupplierss(accessToken) {
		let OAuth2AuthenticationCodeFlow = defaultClient.authentications['OAuth2AuthenticationCodeFlow'];
    OAuth2AuthenticationCodeFlow.accessToken = accessToken;

		 // Retrieve the first company id
		 let userApiInstance = new fattureInCloudSdk.UserApi();
		 let userCompaniesResponse = await userApiInstance.listUserCompanies();
		 let firstCompanyId = userCompaniesResponse.data.companies[0].id;

		 // Retrieve the list of the supplierss
		 let supplierssApiInstance = new fattureInCloudSdk.supplierssApi();
		 let companysupplierss = await supplierssApiInstance.listsupplierss(firstCompanyId);
		 
		 return JSON.stringify(companysupplierss.data)
	}
}

