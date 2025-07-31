//This is a code for destination connection for workflow call
// const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

// module.exports = async function (srv) {
//   srv.on('startTravelWorkflow', async (req) => {
//     try {
//       const travelData = JSON.parse(req.data.travelData);

//       const response = await executeHttpRequest(
//         { destinationName: 'BPA_API_DEST' }, // Your destination name
//         {
//           method: 'POST',
//           url: '/workflow/rest/v1/workflow-instances',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           data: {
//             definitionId: "us10.6440fac5trial.travelexpenses.tavelExpensesProcess",
//             context: travelData
//           }
//         }
//       );

//       return `Workflow triggered. ID: ${response.data.id}`;
//     } catch (err) {
//       console.error("BPA Trigger Error:", err.message);
//       return `Error: ${err.message}`;
//     }
//   });
// };

const axios = require('axios');

module.exports = async function (srv) {
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
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vNjQ0MGZhYzV0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktZjUzZGQxYTE4YyIsInR5cCI6IkpXVCIsImppZCI6ICJENUZZOWZyRDljY2lKV1I1NUR4Y24xM1BLQW05akJKVTh5VXNyMXdsK3hVPSJ9.eyJqdGkiOiI4OTVlYWI1NDQ3ZDI0NjUwYjlhYTJjYmYzZDI0MWU1ZiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiJmY2VhNWY1OS02ZDIwLTQ1YTUtYjBhZS1hYTQ5NmZjMDkxYzciLCJ6ZG4iOiI2NDQwZmFjNXRyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiIxNzQ5MzQwYy03NjJhLTQ5YTktYTczNi0wNDQyMTg3MjRmOTAifSwic3ViIjoic2ItMTc0OTM0MGMtNzYyYS00OWE5LWE3MzYtMDQ0MjE4NzI0ZjkwIWI0NDYzNjh8eHN1YWEhYjQ5MzkwIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sInNjb3BlIjpbInVhYS5yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJzYi0xNzQ5MzQwYy03NjJhLTQ5YTktYTczNi0wNDQyMTg3MjRmOTAhYjQ0NjM2OHx4c3VhYSFiNDkzOTAiLCJjaWQiOiJzYi0xNzQ5MzQwYy03NjJhLTQ5YTktYTczNi0wNDQyMTg3MjRmOTAhYjQ0NjM2OHx4c3VhYSFiNDkzOTAiLCJhenAiOiJzYi0xNzQ5MzQwYy03NjJhLTQ5YTktYTczNi0wNDQyMTg3MjRmOTAhYjQ0NjM2OHx4c3VhYSFiNDkzOTAiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjdiMWVjMWIiLCJpYXQiOjE3NTM5NDA2NjMsImV4cCI6MTc1Mzk4Mzg2MywiaXNzIjoiaHR0cHM6Ly82NDQwZmFjNXRyaWFsLmF1dGhlbnRpY2F0aW9uLnVzMTAuaGFuYS5vbmRlbWFuZC5jb20vb2F1dGgvdG9rZW4iLCJ6aWQiOiJmY2VhNWY1OS02ZDIwLTQ1YTUtYjBhZS1hYTQ5NmZjMDkxYzciLCJhdWQiOlsidWFhIiwic2ItMTc0OTM0MGMtNzYyYS00OWE5LWE3MzYtMDQ0MjE4NzI0ZjkwIWI0NDYzNjh8eHN1YWEhYjQ5MzkwIl19.P3IA-KtRxPIJPuHM4B79UQJszio98PO89CNhSBlktz_kHN9TiVLYa9z5ZE0uxh-nODWrAZUadOmUmbuC6CnO_xUVFk-CWjdDJEhyBN83hIeum38dwwPp_g850hz0WXn6C-Sqm1LA2YyTywS6CHxo1S682f67ogZ89c2LcF75XyVt3G1Gem-cL-SNjNbX60VDmTdW1UyFbmsiVuEvYOcN2NL2k-bnu5mJPrSAQxcN-1jI329bK60eXR6f2E8MKUlUv3W-pVD0vId6ZStfjN-jLpJ7XbvWb7P4ukSx7CIB3m952UP1JDB4Y8rc_J6WDuUHxCj8HvHOhvRc-yv7SS-rEQ'
          }
        }
      );

      return `Workflow started with ID: ${response.data.id}`;
    } catch (err) {
      console.error("Workflow trigger error:", err.response?.data || err.message);
      return `Error: ${err.message}`;
    }
  });
};

