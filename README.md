# Aura - Aesthetic Treatment Discovery Platform

A modern, full-stack application designed to help users discover and inquire about aesthetic treatments for their skin and hair concerns. Built with Next.js, MongoDB, and a completely custom UI.

---

## ✨ Features

-   **Dynamic Concern Search**: A case-insensitive, flexible search to find treatments based on user concerns.
-   **Discoverable Treatments**: The homepage dynamically loads and displays all available treatment concerns from the database.
-   **Detailed Package Information**: View and compare treatment packages offered by various clinics, including pricing.
-   **Seamless Enquiry System**: Users can submit an enquiry for any package through a clean, validated form.
-   **Admin Dashboard**: A dedicated page for administrators to view and manage all customer enquiries in a clear, tabular format.
-   **Dynamic Homepage**: Features a beautiful, fading image slideshow for a professional and engaging user experience.

---

## 🛠 Tech Stack

-   **Framework**: Next.js (Pages Router)
-   **Frontend**: React, Tailwind CSS
-   **Backend**: Next.js API Routes
-   **Database**: MongoDB with Mongoose
-   **Schema Validation**: Zod for robust backend and frontend validation
-   **UI/UX**: React Hot Toast for user notifications

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   A free MongoDB Atlas account and a connection string (URI)

### Local Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git)
    cd YOUR_REPOSITORY
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add your MongoDB connection string:
    ```
    MONGODB_URI="mongodb+srv://..."
    ```

4.  **Seed the database:**
    First, start the development server (`npm run dev`), then run the following command in a new terminal to populate the database with sample data:
    ```bash
    curl -X POST http://localhost:3000/api/seed
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📡 API Endpoints

The application uses the following API endpoints to manage data:

| Method | Endpoint             | Description                                       |
| :----- | :------------------- | :------------------------------------------------ |
| `GET`  | `/api/concerns`      | Fetches a list of all available concerns.         |
| `GET`  | `/api/search`        | Searches for treatments and packages by concern.  |
| `POST` | `/api/enquiries`     | Submits a new customer enquiry.                   |
| `GET`  | `/api/enquiries`     | Fetches all enquiries for the admin dashboard.    |
| `POST` | `/api/seed`          | (For development) Seeds the database.             |

