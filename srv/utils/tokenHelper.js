// srv/utils/tokenHelper.js
const xsenv = require('@sap/xsenv');
const axios = require('axios');

// Load env (default-env.json for local, VCAP_SERVICES on BTP)
xsenv.loadEnv();

async function getXsuaaToken() {
  // Get XSUAA service by its name (must match mta.yaml resource name)
  const services = xsenv.getServices({ xsuaa: { name: 'TravelExpenses-auth' } });
  const credentials = services.xsuaa;

  if (!credentials) {
    throw new Error("❌ XSUAA service 'TravelExpenses-auth' not found. Check mta.yaml or default-env.json.");
  }

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

module.exports = { getXsuaaToken };
