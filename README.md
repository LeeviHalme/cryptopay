# Cryptopay

The unofficial Node.js library for the [Cryptopay API](https://developers.cryptopay.me).

## Credentials

In order to use the Cryptopay API, you need to register on their website. After registration, you can create API keys. Create one and provide the details from that to the constructor function.

## Usage

### Installation

```
npm i cryptopay
```

### Setup

```javascript
const CryptopayClient = require("cryptopay");

const client = new CryptopayClient({
  apiKey: "api key here", // Your Cryptopay API Key
  apiSecret: "api secret here", // Your Cryptopay API Secret
  sandbox: false // Uses sandbox/development endpoints if true
});
```

## Methods

### getAllRates()

Get all public rates for cryptocurrencies.

#### Parameters

None

#### Returns

- Promise (Multiple Objects with `buy_rate` and `sell_rate` keys)

#### Example

```javascript
client.getAllRates().then(rates => {
  //...do something with the rates
});
```

### getPairRate()

Get rate for a specific cryptocurrency pair.

#### Parameters

| Parameter | Type   | Required | Description               |
| --------- | ------ | :------: | ------------------------- |
| Pair      | string |    +     | Currency pair e.g. BTCEUR |

#### Returns

- Promise (Object with `buy_rate` and `sell_rate` keys)

#### Example

```javascript
client.getPairRate("BTCEUR").then(rate => {
  //...do something with the rate
});
```

### getAccounts()

Get all user created accounts.

#### Parameters

None

#### Returns

- Promise (Array of `AccountObject`'s)

#### Example

```javascript
client.getAccounts().then(accounts => {
  //...do something with the accounts
});
```

### getAccountTransactions()

Get all account transactions.

#### Parameters

| Parameter  | Type   | Required | Description               |
| ---------- | ------ | :------: | ------------------------- |
| Account ID | string |    +     | Account ID from cryptopay |

#### Returns

- Promise (Array of `TransactionObject`'s)

#### Example

```javascript
client
  .getAccountTransactions("91202339-52e2-432d-8078-12d49d96ce02")
  .then(transactions => {
    //...do something with the transactions
  });
```

### createChannel()

Create channel and crypto address for the user

#### Parameters

| Parameter         | Type   | Required | Description                                                       |
| ----------------- | ------ | :------: | ----------------------------------------------------------------- |
| pay_currency      | string |    +     | The cryptocurrency which you want to accept                       |
| receiver_currency | string |    +     | The currency which all incoming transactions will be converted to |
| custom_id         | string |    +     | Custom ID to indentify channel                                    |
| name              | string |          | Channel name                                                      |
| description       | string |          | Channel description                                               |

#### Returns

- Promise (`ChannelObject`)

#### Example

```javascript
client
  .createChannel({
    pay_currency: "BTC",
    receiver_currency: "EUR",
    custom_id: "123456",
    name: "Deposit",
    description: "Deposit Address for User X"
  })
  .then(channel => {
    //...do something with the channel
  });
```

### getAllChannels()

Get all channels created

#### Parameters

None

#### Returns

- Promise (Array of `ChannelObject`'s)

#### Example

```javascript
client.getAllChannels().then(channels => {
  //...do something with the channels
});
```

### getChannelPayments()

Get all specific channel payments

#### Parameters

| Parameter  | Type   | Required | Description |
| ---------- | ------ | :------: | ----------- |
| Channel ID | string |    +     | Channel ID  |

#### Returns

- Promise (Array of `PaymentObject`'s)

#### Example

```javascript
client
  .getChannelPayments("50eb5775-f77e-4c64-870b-dc93624b5967")
  .then(channels => {
    //...do something with the channels
  });
```

### createCoinPayment()

Create a coin withdrawal payment

#### Parameters

| Parameter         | Type   | Required | Description                                           |
| ----------------- | ------ | :------: | ----------------------------------------------------- |
| charged_currency  | string |    +     | An account currency to send a transaction from        |
| received_currency | string |    +     | Cryptocurrency type                                   |
| charged_amount    | number |    +     | All applicable fees will be deducted from this amount |
| address           | string |    +     | A recipient's cryptocurrency wallet address           |
| custom_id         | string |    +     | Payment reference ID in your system                   |

#### Returns

- Promise (`PaymentObject`)

#### Example

```javascript
client
  .createCoinPayment({
    charged_currency: "EUR",
    received_currency: "BTC",
    charged_amount: 10,
    address: "2N122JKRz52gokTmaVYNiMA43qvdSqnhLGV",
    custom_id: "123456"
  })
  .then(payment => {
    //...do something with the payment
  });
```

### commitCoinPayment()

Commit a coin withdrawal payment

#### Parameters

| Parameter  | Type   | Required | Description |
| ---------- | ------ | :------: | ----------- |
| Payment ID | string |    +     | Payment ID  |

#### Returns

- Promise (`PaymentObject`)

#### Example

```javascript
client
  .commitCoinPayment("50eb5775-f77e-4c64-870b-dc93624b5967")
  .then(payment => {
    //...do something with the payment
  });
```

## Objects

### AccountObject

| Parameter  | Type   | Description                                                                                  |
| ---------- | ------ | -------------------------------------------------------------------------------------------- |
| id         | string | Account ID                                                                                   |
| balance    | string | Account balance                                                                              |
| currency   | string | Account currency                                                                             |
| project_id | string | Project ID which the account belongs to. [Learn more](https://bit.ly/33XgI9q) about projects |

### TransactionObject

| Parameter      | Type   | Description                           |
| -------------- | ------ | ------------------------------------- |
| id             | string | Account transaction ID                |
| custom_id      | string | Transaction custom_id                 |
| amount         | string | Transaction amount                    |
| currency       | string | Transaction currency                  |
| balance        | string | Account subtotal                      |
| fee            | string | Transaction fee details               |
| fee_currency   | string | Transaction fee currency              |
| referecnce_id  | string | Transaction reference ID in Cryptopay |
| reference_type | string | Transaction type                      |
| description    | string | Transaction description               |
| status         | string | Transaction status                    |
| status_context | string | Transaction status context            |
| created_at     | string | Transaction creation date and time    |

### ChannelObject

| Parameter         | Type   | Description                                                       |
| ----------------- | ------ | ----------------------------------------------------------------- |
| id                | string | Channel ID                                                        |
| name              | string | Channel name                                                      |
| description       | string | Channel description                                               |
| receiver_currency | string | The currency which all incoming transactions will be converted to |
| pay_currency      | string | The cryptocurrency which you want to accept                       |
| address           | string | Channel cryptocurrency address                                    |
| project_id        | string | Project ID. [Learn more](https://bit.ly/33XgI9q) about projects   |
| custom_id         | string | The channel reference ID in your system                           |
| uri               | string | Channel URI. May be used for generating a QR code                 |
| hosted_page_url   | string | Channel hosted page that renders channel details                  |

### PaymentObject

| Parameter          | Type   | Description                                                                                   |
| ------------------ | ------ | --------------------------------------------------------------------------------------------- |
| id                 | string | Channel payment ID                                                                            |
| paid_amount        | string | Cryptocurrency transaction amount that was received                                           |
| paid_currency      | string | Cryptocurrency type                                                                           |
| received_amount    | string | Amount credited to your Cryptopay account                                                     |
| received_currency  | string | Account currency                                                                              |
| fee                | string | Processing fee                                                                                |
| fee_currency       | string | Processing fee currency                                                                       |
| txid               | string | Cryptocurrency transaction ID on the blockchain                                               |
| exchange           | object | Exchange details                                                                              |
| -pair              | string | Currency pair                                                                                 |
| -rate              | string | Exchange rate                                                                                 |
| -fee               | string | Exchange fee                                                                                  |
| -fee_currency      | string | Exchange fee currency                                                                         |
| status             | string | Channel payment status. Refer to [a list of channel payment statuses](https://bit.ly/2Nt0peO) |
| custom_id          | string | Channel payment `custom_id` value inherited from its parent channel                           |
| channel_id         | string | Channel ID                                                                                    |
| address            | string | Channel cryptocurrency address                                                                |
| risk               | Object | Cryptocurrency transaction risk level details                                                 |
| -score             | number | Transaction risk score                                                                        |
| -level             | string | Transaction risk level. `low`, `medium` or `high` depending on the score value                |
| -resource_name     | string | A resource name the transaction has been received from e.g. `Bitstamp`                        |
| -resource_category | string | A resource category the transaction has been received from e.g. `Exchange`                    |
| created_at         | string | Channel payment creation date and time                                                        |
