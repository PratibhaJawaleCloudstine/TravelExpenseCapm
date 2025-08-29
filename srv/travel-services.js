

const axios = require('axios');

module.exports = async function (srv) {
  const { TravelRequests } = srv.entities;

  srv.on('startTravelWorkflow', async (req) => {
    try {
      const payload = JSON.parse(req.data.travelData);

      const response = await axios.post(
        'https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances',
        {
          definitionId: "us10.6440fac5trial.travelexpenses.tavelExpensesProcess",
          context: payload
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktMDA5MzA4ZWU5ZiIsInR5cCI6IkpXVCIsImppZCI6ICJ6a1V4bnNWU2JsbDlIenlXYmp1cm9tTXp4OVh5TWk1d2MxOE12eEJEWDFFPSJ9.eyJqdGkiOiJkOTZiZTc0ZGMyYjk0OGNmOThiZDczODdjZWJkOGEwMiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI0MzhjMTVkNS01ZTdhLTQwNWUtODIzYS0wZTcwYmRjMjM4MDMiLCJ6ZG4iOiI4M2YzNTdhMHRyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiJmMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkifSwic3ViIjoic2ItZjIwN2M2OTYtZmE5ZC00NTQxLTk2OTUtOTkwMDRjZmU3ZWE5IWI0OTgyNzN8eHN1YWEhYjQ5MzkwIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sInNjb3BlIjpbInVhYS5yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJjaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJhenAiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjMwMDIwZmQwIiwiaWF0IjoxNzU2NDUxNjA1LCJleHAiOjE3NTY0OTQ4MDUsImlzcyI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiNDM4YzE1ZDUtNWU3YS00MDVlLTgyM2EtMGU3MGJkYzIzODAzIiwiYXVkIjpbInVhYSIsInNiLWYyMDdjNjk2LWZhOWQtNDU0MS05Njk1LTk5MDA0Y2ZlN2VhOSFiNDk4MjczfHhzdWFhIWI0OTM5MCJdfQ.RigTBX4jgvM1i2Sy23jdREY82-bUcglXO5-dvAN-KeiVtgXvcYIovCpiLM-1qJAVTrhkpu4DMBrQL9HQ_b-74Im6EHr0RFaah-yqqY776XSFgn2Qeb80PHQaFRp8-fdVhIeAOItTtyUiGZsN-0GTJxAEII6MIEeLd6AtGm7K-8KMbX7OLSG60h0i_GoFlObgQRHDz6yxoR0ljIm1keRm8l_bp_uzPJ68gt3D3nOipEm8WqPT0L4EH0rvHONx-0Lzvtd47K4BWGQnoG-qDMe9rbOOoLvEK3oy2JfdZbLolVpYJtIrczAwKHcI4NZNWsS32j6ZglvNzjttFSvKOmV2bA'
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

