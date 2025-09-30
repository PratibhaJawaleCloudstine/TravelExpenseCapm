
const cds = require('@sap/cds');
const axios = require('axios');
const { getXsuaaToken } = require('./utils/tokenHelper'); 

// Get CDS entities
const { TravelRequests } = cds.entities;

module.exports = async function (srv) {
// === Action: Trigger Workflow ===
  srv.on('startTravelWorkflow', async (req) => {
    try {
      const payload = JSON.parse(req.data.travelData);

      // 🔑 Fetch token dynamically from tokenHelper
      const token = await getXsuaaToken();

      // Workflow REST API URL (can be set in default-env.json as WORKFLOW_REST_URL)
      const workflowUrl =
        process.env.WORKFLOW_REST_URL ||
        'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1';

      const response = await axios.post(
        `${workflowUrl}/workflow-instances`,
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

