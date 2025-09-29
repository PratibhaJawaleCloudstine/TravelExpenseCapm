

const axios = require('axios');
const xsenv = require('@sap/xsenv');


module.exports = async function (srv) {
  const { TravelRequests } = srv.entities;

    // Helper function to fetch token from XSUAA
  async function getXsuaaToken() {
    const services = xsenv.getServices({ uaa: { tag: 'xsuaa' } });
    const credentials = services.uaa;

    const response = await axios({
      url: `${credentials.url}/oauth/token`,
      method: 'POST',
      auth: {
        username: credentials.clientid,
        password: credentials.clientsecret
      },
      params: {
        grant_type: 'client_credentials'
      }
    });

    return response.data.access_token;
  }

  srv.on('startTravelWorkflow', async (req) => {
    try {
      const payload = JSON.parse(req.data.travelData);

      
      // 🔹 Fetch fresh JWT from XSUAA
      const token = await getXsuaaToken();
      console.log("token : "+token);

      const response = await axios.post(
        'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances',
        {
          definitionId: "us10.6440fac5trial.travelexpenses.tavelExpensesProcess",
          context: payload
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      return `Workflow started with ID: ${response.data.id}`;
    } catch (err) {
      console.error("Workflow trigger error:", err.response?.data || err.message);
      return `Error: ${err.message}`;
    }
  });

   // ✅ New action to update TravelRequests table
  srv.on('updateTravelStatus', async (req) => {
    const { ID, Approvedstatus } = req.data;
    console.log("Updating Travel Request:", ID, Approvedstatus);
    if (!ID || !Approvedstatus) {
      return "Error: ID and Approvedstatus are required.";
    }

    try {
      const result = await UPDATE(TravelRequests)
        .set({ Approvedstatus: Approvedstatus })
        .where({ ID });

      if (result === 0) {
        return `No record found for ID ${ID}`;
      }
      return `Status updated to '${Approvedstatus}' for travel request ${ID}`;
    } catch (err) {
      console.error("DB update error:", err);
      return `Error updating travel request: ${err.message}`;
    }
  });

  srv.on('read', 'MyEntity', async (req) => {
    const userId = req.user.id;
    const firstName = req.req.authInfo.getGivenName();
    const lastName = req.req.authInfo.getFamilyName();
    const email = req.req.authInfo.getEmail();

   console.log(userId);
   console.log(firstName);
   console.log(lastName);
   console.log(email);

     // Return this data as entity response
    return [{
      ID: userId,
      name: `${firstName} ${lastName}`,
      createdAt: new Date()
    }];
    
});

};

