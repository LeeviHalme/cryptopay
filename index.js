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

  // Helper to parse errors into a more user-friendly format
  async errorParser(error) {
    console.log(
      "There was an error while contacting Cryptopay API:",
      error.message,
      error.response &&
        error.response.data &&
        error.response.data.error &&
        `(${error.response.data.error.message})`
    );

    return error.response.data;
  }

  // Function to get all crypto rates
  async getAllRates() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request("GET", "/api/rates", {});

        resolve(response.data.data);
      } catch (error) {
        reject(this.errorParser(error));
      }
    });
  }

  // Function to get crypto pair rates
  async getPairRate(pair) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request("GET", `/api/rates/${pair}`, {});

        resolve(response.data.data);
      } catch (error) {
        reject(this.errorParser(error));
      }
    });
  }

  // Function to get user accounts
  async getAccounts() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request("GET", "/api/accounts", {});

        resolve(response.data.data);
      } catch (error) {
        reject(this.errorParser(error));
      }
    });
  }

  // Function to get user account transactions
  async getAccountTransactions(accountId) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request(
          "GET",
          `/api/accounts/${accountId}/transactions`,
          {}
        );

        resolve(response.data.data);
      } catch (error) {
        reject(this.errorParser(error));
      }
    });
  }

  // Function to create payment channel (deposit address)
  async createChannel({
    pay_currency,
    receiver_currency,
    custom_id,
    name = "",
    description = ""
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request("POST", "/api/channels", {
          pay_currency,
          receiver_currency,
          custom_id,
          name,
          description
        });

        resolve(response.data.data);
      } catch (error) {
        reject(this.errorParser(error));
      }
    });
  }

  // Function to get all user's payment channels
  async getAllChannels() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request("GET", "/api/channels", {});

        resolve(response.data.data);
      } catch (error) {
        reject(this.errorParser(error));
      }
    });
  }

  // Function to get all channel's payments
  async getChannelPayments(channelId) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request(
          "GET",
          `/api/channels/${channelId}/payments`,
          {}
        );

        resolve(response.data.data);
      } catch (error) {
        reject(this.errorParser(error));
      }
    });
  }

  // Function to create a coin payment
  async createCoinPayment({
    charged_currency,
    received_currency,
    charged_amount,
    address,
    custom_id
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request("POST", "/api/coin_withdrawals", {
          charged_currency,
          received_currency,
          charged_amount,
          address,
          custom_id
        });

        resolve(response.data.data);
      } catch (error) {
        reject(this.errorParser(error));
      }
    });
  }

  // Function to commit a coin payment
  async commitCoinPayment(paymentId) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request(
          "POST",
          `/api/coin_withdrawals/${paymentId}/commit`,
          {}
        );

        resolve(response.data.data);
      } catch (error) {
        reject(this.errorParser(error));
      }
    });
  }
}

// Export class
module.exports = CryptopayClient;
