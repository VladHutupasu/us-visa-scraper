# 🗓️ Appointment Availability Checker

This script is a Node.js application that uses Puppeteer to automate the process of checking for appointment availability on a website. It logs into the website, navigates to the appointment page, and checks if there are any appointments available. If appointments are available, it sends a message to a specified Telegram channel with the payment URL.

## 🚀 Getting Started

Before running the script, you need to fill in the `config.js` file with the necessary values. Here's an example of what the `config.js` file should look like:

```javascript
module.exports = {
    BOT_API_KEY: 'your-telegram-bot-api-key',
    BOT_CHAT_ID_CHANNEL: 'your-telegram-chat-id',
    URL_SIGN_IN: 'website-sign-in-url',
    URL_PAYMENT: 'website-payment-url',
    EMAIL: 'your-email',
    PASSWORD: 'your-password',
    NO_APPOINTMENTS: 'text-indicating-no-appointments',
};
```

Replace the placeholders with your actual values. For example, `your-telegram-bot-api-key` should be replaced with your actual Telegram bot API key.

## 📦 Installation
Before running the script, you need to install the necessary dependencies. Navigate to the directory containing the script in your terminal and run the following command:

```console
npm install
```

## 🏃‍♀️ Running the Script
To run the script, navigate to the directory containing the script in your terminal and run the following command:

```console
node script.js
```

This will start the script. It will log into the website, check for appointment availability, and then continue to check every 5 minutes.

## 🚧 Error Handling
If an error occurs during the fetch operation, the error will be logged to the console and a message will be sent to the Telegram channel. If the error occurred on the sign in page, the script will attempt to log in again.

## 📚 Dependencies
This script uses the following Node.js packages:

- `puppeteer`: For automating browser actions
- `node-telegram-bot-api`: For sending messages to a Telegram channel