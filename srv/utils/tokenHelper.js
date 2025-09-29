// srv/utils/tokenHelper.js
const xsenv = require('@sap/xsenv');
const xssec = require('@sap/xssec');
const util = require('util');
const axios = require('axios');

xsenv.loadEnv(); // loads default-env.json automatically

/**
 * Get a client-credentials token for XSUAA
 */
async function getXsuaaToken() {
  const services = xsenv.getServices({ uaa: { tag: 'xsuaa' } });
  const credentials = services.uaa;

  const options = {
    url: `${credentials.url}/oauth/token`,
    method: 'POST',
    auth: {
      username: credentials.clientid,
      password: credentials.clientsecret
    },
    params: {
      grant_type: 'client_credentials'
    }
  };

  const response = await axios(options);
  return response.data.access_token;
}

module.exports = { getXsuaaToken };
