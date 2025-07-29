// // srv/triggerBPA.js
const axios = require("axios");

module.exports = async function (req, res) {
  const { travelData } = req.data;

  try {
    const result = await axios.post(
      "https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances",
      {
        definitionId: "us10.6440fac5trial.travelexpenses.tavelExpensesProcess",
        context: travelData
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vNjQ0MGZhYzV0cmlhbC5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJkZWZhdWx0LWp3dC1rZXktZjUzZGQxYTE4YyIsInR5cCI6IkpXVCIsImppZCI6ICJmbTM0a0FKWGlSdTRBa2xJVG1RTmltaEZBR3hmNmF4b0hmYWtOODJsd3A4PSJ9.eyJqdGkiOiJhZmYwMGVlOWVmYzE0NjI1OGQ1YWQxZmRmNjdhMWM1ZCIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiJmY2VhNWY1OS02ZDIwLTQ1YTUtYjBhZS1hYTQ5NmZjMDkxYzciLCJ6ZG4iOiI2NDQwZmFjNXRyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiIxNzQ5MzQwYy03NjJhLTQ5YTktYTczNi0wNDQyMTg3MjRmOTAifSwic3ViIjoic2ItMTc0OTM0MGMtNzYyYS00OWE5LWE3MzYtMDQ0MjE4NzI0ZjkwIWI0NDYzNjh8eHN1YWEhYjQ5MzkwIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIl0sInNjb3BlIjpbInVhYS5yZXNvdXJjZSJdLCJjbGllbnRfaWQiOiJzYi0xNzQ5MzQwYy03NjJhLTQ5YTktYTczNi0wNDQyMTg3MjRmOTAhYjQ0NjM2OHx4c3VhYSFiNDkzOTAiLCJjaWQiOiJzYi0xNzQ5MzQwYy03NjJhLTQ5YTktYTczNi0wNDQyMTg3MjRmOTAhYjQ0NjM2OHx4c3VhYSFiNDkzOTAiLCJhenAiOiJzYi0xNzQ5MzQwYy03NjJhLTQ5YTktYTczNi0wNDQyMTg3MjRmOTAhYjQ0NjM2OHx4c3VhYSFiNDkzOTAiLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwicmV2X3NpZyI6IjdiMWVjMWIiLCJpYXQiOjE3NTM0MjI0MjcsImV4cCI6MTc1MzQ2NTYyNywiaXNzIjoiaHR0cHM6Ly82NDQwZmFjNXRyaWFsLmF1dGhlbnRpY2F0aW9uLnVzMTAuaGFuYS5vbmRlbWFuZC5jb20vb2F1dGgvdG9rZW4iLCJ6aWQiOiJmY2VhNWY1OS02ZDIwLTQ1YTUtYjBhZS1hYTQ5NmZjMDkxYzciLCJhdWQiOlsidWFhIiwic2ItMTc0OTM0MGMtNzYyYS00OWE5LWE3MzYtMDQ0MjE4NzI0ZjkwIWI0NDYzNjh8eHN1YWEhYjQ5MzkwIl19.dhBGWU8OLNsiDJjZq4mr9rxRHyZd_XCZDO-kS_bn7lGTwr2vEODGn127ec-L1D_P0kVWaYJk0r-MEu9PGgfHS5scNqoGgY2FRh8hisF37MiNvYB2m7_ZhyVmFjKkN5vMHBxrmhU6V82rhRr2NSquKtguKJ_y-ec1BYzNl7AwadzqJiQgaATvSi5u_ldaiCD2NTttnYeRdAU3TFk4995iH1pUObBfmcPtDRqYpKUvbgNAy_g0P-aZB1sLWqWNhI_s6EazHhp9wXCAbpIoUaiGborVcJAmnTdGqi8SgpiU2cIgFakjnxBCiVxRhW422lBixSe8_VT8GERcBMknfG8ZAg` // secure in .env or xsenv
        }
      }
    );

    return result.data;
  } catch (error) {
    console.error("Error triggering BPA:", error.response?.data || error.message);
    return res.status(500).send("BPA Trigger Failed");
  }
};
