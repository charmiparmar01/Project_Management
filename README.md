# Project Management System

A full-stack web application for managing projects, tasks with role-based access control.

## Features

- **User Management**: Create, edit, and manage users with different roles
- **Project Management**: Create and manage projects
- **Task Management**: Create, assign, and track tasks with status updates
- **Role-Based Access Control**: Different access levels for Admin, Manager, and Employee roles
- **Authentication**: Secure JWT-based authentication system
- **Modern UI**: Built with React, Material-UI, and Redux Toolkit

## Tech Stack

### Frontend (Client)
- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Vite** - Build tool

### Backend (Server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation & Setup

### Prerequisites
- Node.js 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
```

### 2. Backend Setup

#### Navigate to server directory
```bash
cd server
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
Create a `.env` file in the `server` directory with the following content:

```env
# Database Configuration
DATABASE_URL=your_mongodb_url
# JWT Configuration
ACCESS_TOKEN=your_super_secret_access_token_key_here
REFRESH_TOKEN=your_super_secret_refresh_token_key_here

# Server Configuration
PORT=port_number
```

**Important**: 
- Replace the JWT token values with your own secure random strings

#### Seed the database
```bash
npm run seed
```
### Note:
- To log in as an Admin, you must run the admin seeder before starting the server:

```bash
npm run seed:admin
```

This will create a default Admin user in the database.

#### Start the development server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 3. Frontend Setup

#### Navigate to client directory (in a new terminal)
```bash
cd client
```

#### Install dependencies
```bash
npm install
```

#### Start the development server
```bash
npm run dev
```

The client will start on `http://localhost:5173`

## Database Seeding

The application includes seeders to populate the database with initial data:

- **Roles**: Admin, Manager, Employee roles
- **Modules**: System modules for permission management
- **Role Permissions**: Default permissions for each role
- **Admin User**: Default admin user with credentials

Run the following commands to seed specific data:

```bash
# Seed all data
npm run seed

# Seed roles only
npm run seed:roles

# Seed modules only
npm run seed:modules

# Seed role permissions only
npm run seed:permissions

# Seed admin user only
npm run seed:admin
```

## Default Users

After seeding, you can create users through the application interface. The system supports three roles:

- **Admin**: Full system access
- **Manager**: Project and team management
- **Employee**: Task management and updates

### Default Admin Credentials
- **Email**: admin@mail.com
- **Password**: Admin@123

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

