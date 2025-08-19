

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
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktMDA5MzA4ZWU5ZiIsInR5cCI6IkpXVCIsImppZCI6ICJ3VjBZekZ2N2ljTE9iRDd1alNqZWoxamd2aWNZNVBhWDJUSzFEY055OUY4PSJ9.eyJqdGkiOiIyNWJjNTc3ODdiNmE0YTY1YTE0MzY3MmVmMDkyZjRlMCIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI0MzhjMTVkNS01ZTdhLTQwNWUtODIzYS0wZTcwYmRjMjM4MDMiLCJ6ZG4iOiI4M2YzNTdhMHRyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiJmMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkifSwic3ViIjoic2ItZjIwN2M2OTYtZmE5ZC00NTQxLTk2OTUtOTkwMDRjZmU3ZWE5IWI0OTgyNzN8eHN1YWEhYjQ5MzkwIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sInNjb3BlIjpbInVhYS5yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJjaWQiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJhenAiOiJzYi1mMjA3YzY5Ni1mYTlkLTQ1NDEtOTY5NS05OTAwNGNmZTdlYTkhYjQ5ODI3M3x4c3VhYSFiNDkzOTAiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjMwMDIwZmQwIiwiaWF0IjoxNzU1NTg4NjI1LCJleHAiOjE3NTU2MzE4MjUsImlzcyI6Imh0dHBzOi8vODNmMzU3YTB0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiNDM4YzE1ZDUtNWU3YS00MDVlLTgyM2EtMGU3MGJkYzIzODAzIiwiYXVkIjpbInVhYSIsInNiLWYyMDdjNjk2LWZhOWQtNDU0MS05Njk1LTk5MDA0Y2ZlN2VhOSFiNDk4MjczfHhzdWFhIWI0OTM5MCJdfQ.eGYj_hFYv9lGa4V77Ctmd8uvUfG5AAoSesGqrp4ww6rqSEaAeTx7HoaY9ndVxaFI37K1AGqnyQ5eP7vWpTI9TV0i1BWSh9cLZf85-xv5o0z8j8-yx9T0Hbe1Q4w_W7fpkS3vrgvR1KHyXe-5zu77GH3BjyWvxFvrv2FsYdHKe4UN9HqQujVduvqEgm_IY2DBRcev5lAfF83JFV58HDdC-d5aLIODJLzwN4sRCI2n5LOSxs3jnSHQW9YCtBhkJnFOltamaCj-xNVn6dqQD9SKlFWErf7sATlaNOhL9uKDJkUuWntKXFLP_Rqnq6M9dFNRMdngkM9v6aTK9yEiee6HRw'
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

};

