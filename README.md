# 🌐 AI-Based Multilingual Customer Support App

An intelligent customer support assistant that **understands any language**, detects **user sentiment and intent**, matches it with FAQs, generates **human-like responses**, provides **text-to-speech (TTS)** responses, and **notifies the manager on negative sentiment**. The app even supports **image input analysis**, making it a complete multilingual AI-driven support system.

---

## 🚀 Problem Statement

In a global digital marketplace, customers reach out in various languages, using mixed media such as text and images. Support teams struggle with:

- **Language barriers**
- **Delayed responses**
- **Lack of sentiment detection**
- **Manual escalation for negative experiences**
- **No voice output for visually impaired users**

---

## 🤖 Our AI-Powered Solution

This application leverages **Google Gemini Pro** and other modern APIs to build a **multilingual, smart, and interactive support system** that works with **text and images**.

---

## 🧠 AI Features

### 🈂️ Language Detection
- Automatically detects the World any language of the customer message using **Gemini Pro**.
- Supports **All languages in world**, including regional and low-resource languages.

### 🔁 Real-time Translation
- Converts non-English input into **English** for internal processing.
- Translates the AI-generated response **back into the original language**.

### 5. **Real-Time Admin Dashboard**
The **Admin Dashboard** provides real-time insights into the performance of the customer support system. Admins can view:
- **Real-time data**: Up-to-date customer interactions and feedback.
- **Sentiment Analysis**: A chart showing positive, negative, and neutral sentiments of customer queries.
- **Intent Breakdown**: Visual representation of the most common types of queries (delivery, refund, product info, etc.).

The dashboard uses **charts** and **data visualizations** to help admins track performance, identify trends, and improve the system.

### 📦 Intent Detection
- Determines the customer's intent from the query:
  - `delivery`
  - `refund`
  - `product info`
  - `account issue`

### 😊 Sentiment Analysis
- Classifies the sentiment as:
  - `Positive`
  - `Neutral`
  - `Negative`
- Triggers manager notifications for **Negative** sentiment.

### 📚 FAQ Matching
- Matches the input with the **closest FAQ** to provide helpful and accurate responses.

### 💬 AI-Powered Response Generation
- Generates **polite**, **context-aware**, and **human-like** responses using **Gemini's LLM**.

### 🔊 Text-to-Speech (TTS)
- Converts the final response into **audio** using `google-tts-api`.
- Great for users who prefer listening or have visual impairments.

### ✉️ Manager Notification (Email Alerts)
- Uses **Nodemailer** to automatically alert managers if a customer sends a **negative message**.
- Email contains: Original message, intent, and detected sentiment.

### 🖼️ Image Support (Optional)
- Upload images for AI processing (e.g., damaged products).
- Gemini handles **image + text** prompts to understand visual complaints (requires additional setup).

### 💾 Chat Logging
- All messages, detected data, and responses are saved to **MongoDB** for analytics and support history.

---

## 💡 Technologies Used

- 🔮 **Google Generative AI (Gemini Pro)**
- 📧 **Nodemailer**
- 🛠️ **Node.js & Express.js**
- 🧪 **MongoDB & Mongoose**
- 📸 **Image Support with Hugging face model (Extendable)**
- 🌐 **RESTful API Design**

---

## ⚙️ How to Run the Project

### 📁 Prerequisites

- Node.js (v18 or later)
- MongoDB (local or cloud e.g., MongoDB Atlas)
- Google Generative AI API Key
- Gmail account for sending email alerts

### 🔐 Create `.env` File

Create a `.env` file in your root directory and add:

```env
PORT=3000
GEMINI_API_KEY=your_google_generative_ai_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
MANAGER_EMAIL=manager_email@gmail.com
MONGO_URI=your_mongodb_connection_string
