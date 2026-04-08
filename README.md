# Tenant Management Frontend

A premium React dashboard for managing users, roles, and sites.

## Tech Stack
- React (Vite)
- Axios (API Client)
- Lucide React (Icons)
- Context API (State Management)
- Vanilla CSS (Design System)

## Features
- **JWT Authentication**: Secure login/logout flow with auto-redirects.
- **Protected Routes**: Ensuring only authenticated users can access management pages.
- **Dashboard**: Real-time stats and overview.
- **Users**: List, search, paginate, create, edit, and deactivate users.
- **Roles**: Create and manage roles with permission arrays.
- **Sites**: Facility management with status controls.

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```
