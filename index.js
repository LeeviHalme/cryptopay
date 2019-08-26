// Require Dependencies
const axios = require("axios");
const crypto = require("crypto");

// Main Class
class CryptopayClient {
  constructor({ apiKey, apiSecret, sandbox }) {
    if (!apiKey || !apiSecret)
      throw new Error(
        "Missing apiKey or apiSecret parameter(s). These are required."
      );

    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.sandbox = sandbox || false;
    this.apiURL = this.sandbox
      ? "https://business-sandbox.cryptopay.me"
      : "https://business.cryptopay.me";
  }

  // Helper to make the signature
  async generateSignature(method, endpoint, content) {
    return new Promise(resolve => {
      const contentStr = content === {} ? "" : JSON.stringify(content);
      const contentMd5 = crypto
        .createHash("md5")
        .update(contentStr)
        .digest("hex");
      const date = new Date(Date.now()).toUTCString();
      const signStr =
        method +
        "\n" +
        contentMd5 +
        "\n" +
        "application/json" +
        "\n" +
        date +
        "\n" +
        endpoint;

      // Create verification signature
      const signature = crypto
        .createHmac("sha1", this.apiSecret)
        .update(signStr)
        .digest()
        .toString("base64");

      resolve({ signature, date });
    });
  }

  // Helper to make the request
  async request(method, endpoint, content) {
    return new Promise(async (resolve, reject) => {
      try {
        const { signature, date } = await this.generateSignature(
          method,
          endpoint,
          content
        );

        // Make the request to Cryptopay API
        const response = await axios({
          method,
          url: this.apiURL + endpoint,
          data: content,
          headers: {
            Authorization: `HMAC ${this.apiKey}:${signature}`,
            Date: date,
            "Content-Type": "application/json"
          }
        });

        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Function to get all crypto rates
  async getAllRates() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request("GET", "/api/rates", {});

        console.log(response.data);
        resolve();
      } catch (error) {
        console.log(
          "There was an error while contacting Cryptopay API:",
          error.message
        );
        reject(error.response ? error.response : error);
      }
    });
  }
}

// Export class
module.exports = CryptopayClient;
