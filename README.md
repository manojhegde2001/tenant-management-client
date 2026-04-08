# Tenant Management Frontend

A premium, high-fidelity React dashboard for the Ada Lovelace Technologies Tenant Management System. Built with speed and aesthetics in mind, this frontend provides an intuitive interface for managing digital identities and site infrastructure.

---

## ✨ Key Features

- **Premium UI/UX**: Modern design system utilizing **Glassmorphism**, custom gradients, and the **Inter** typeface for a professional look.
- **Micro-Animations**: Smooth transitions and entry animations (fade-in/slide) powered by custom CSS and Tailwind v4.
- **State-of-the-Art Forms**: Robust input handling with real-time feedback and validation.
- **Authentication**: Seamless JWT integration with contextual routing (Protected Routes).
- **Responsive Layout**: Fluid design optimized for mobile, tablet, and desktop viewing.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using the new `@theme` configuration)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Navigation**: [React Router v7](https://reactrouter.com/)

---

## 📁 Folder Structure

- **`src/pages`**: Full-page components (Dashboard, Users, Roles, Site management).
- **`src/components`**: Reusable UI components (Layout, Cards, Inputs, Buttons).
- **`src/services`**: API client abstraction using Axios.
- **`src/context`**: Global state management (Auth state).
- **`src/styles`**: Design system tokens and global CSS.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Development Mode
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
```

---

## 🌐 Deployment

This application is ready for deployment on **Vercel**.
- The `vercel.json` ensures Spa-friendly routing (handling 404s and rewrites).
- Environment variables must be configured in the Vercel Project Settings.

---

*Designed and Developed by Ada Lovelace Technologies.*
