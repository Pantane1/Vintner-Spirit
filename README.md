# Vintner & Spirit Pro 🍷

A premium, modern liquor store management and Point of Sale (POS) system designed for high-end retailers. This application combines robust inventory management with cutting-edge AI features powered by Google Gemini.

## ✨ Features

- **Point of Sale (POS):** A streamlined interface for rapid checkouts, featuring category filtering, real-time stock status, and an integrated cart system.
- **AI Sommelier Concierge:** A Gemini-powered assistant that helps staff provide expert recommendations based on natural language customer queries (e.g., "I need a smoky scotch under $100").
- **Smart Dashboard:** Real-time visualization of sales performance using Recharts, coupled with AI-driven inventory insights.
- **AI Inventory Insights:** Automatically identifies low-stock risks, cross-selling opportunities, and market trends based on current inventory data.
- **Inventory Management:** Full visibility into SKU tracking, stock levels, and pricing with a clean, searchable interface.
- **Sales History:** Detailed logs of past transactions for auditing and performance review.

## 🚀 Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS (Premium Dark Slate & Amber palette)
- **Icons:** Lucide React
- **Charts:** Recharts
- **AI Engine:** Google Gemini 3 Flash (`@google/genai`)

## 🤖 AI Integration

The system leverages the `gemini-3-flash-preview` model for two core services:

1.  **Inventory Analysis:** Processes the entire product list to generate structured JSON insights regarding business opportunities and alerts.
2.  **Sommelier Concierge:** Uses a system prompt to transform technical inventory data into elegant, knowledgeable customer-facing recommendations.

## 🛠️ Configuration

The application requires a Google Gemini API Key to enable AI features. The key is accessed via:
`process.env.API_KEY`

## 📂 Project Structure

- `App.tsx`: Main application controller and state management.
- `components/`: UI modules (Dashboard, POS, Inventory, Sidebar).
- `services/`: API integration logic (Gemini).
- `types.ts`: TypeScript interfaces for Products, Sales, and AI Insights.
- `constants.ts`: Mock data and initial configuration.

---
*Built with precision for the modern vintner.*
