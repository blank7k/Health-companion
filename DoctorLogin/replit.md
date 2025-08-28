# Hospital Discharge Management System

## Overview

This is a full-stack web application designed for hospital discharge management. The system provides an AI-powered chat interface for healthcare professionals to manage patient discharges efficiently. It features role-based authentication, patient dashboards, discharge approval workflows, and comprehensive UI components for healthcare operations.

The application is built as a modern single-page application (SPA) with a React frontend and Express backend, designed to streamline the complex process of hospital patient discharge coordination between doctors, nurses, billing staff, and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent, accessible design
- **State Management**: React Context API for authentication state, React Hook Form for form management
- **Data Fetching**: TanStack Query (React Query) for server state management and caching
- **Routing**: Client-side routing handled within the main App component with conditional rendering

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for enhanced developer experience and type safety
- **Development**: Hot reload and middleware setup for efficient development workflow
- **API Structure**: RESTful API design with `/api` prefix for all endpoints
- **Error Handling**: Centralized error handling middleware for consistent error responses

### Authentication & Authorization
- **Mock Authentication**: Demo implementation with role-based access control
- **Roles**: Four distinct user roles (Doctor, Nurse, Billing Staff, Admin) with specific permissions
- **Session Management**: JWT token-based authentication with role and permission validation
- **Context Provider**: React Context for managing authentication state across components

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Fallback Storage**: In-memory storage interface for development and testing

### UI Component System
- **Design System**: shadcn/ui with Radix UI primitives for accessibility
- **Theme**: Dark theme with CSS custom properties for consistent styling
- **Components**: Comprehensive set of reusable UI components (buttons, forms, dialogs, etc.)
- **Icons**: Lucide React icon library for consistent iconography
- **Responsive Design**: Mobile-first approach with responsive breakpoints

### Core Features
- **Chat Interface**: AI-powered conversational interface for discharge management queries
- **Patient Dashboard**: Comprehensive view of patient information, admission details, and discharge status
- **Discharge Management**: Workflow system for discharge requests, approvals, and status tracking
- **Role-Based Navigation**: Dynamic navigation based on user permissions and roles
- **Real-time Updates**: Component state management for live data updates

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support

### Development Tools
- **Vite Plugins**: React plugin, runtime error overlay, and Replit cartographer for development
- **TypeScript**: Full TypeScript support across client, server, and shared code

### UI Libraries
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide Icons**: Modern icon library with React components

### Form & Validation
- **React Hook Form**: Performant form library with validation
- **Hookform Resolvers**: Integration layer for various validation schemas

### Utility Libraries
- **clsx & tailwind-merge**: Conditional CSS class management
- **class-variance-authority**: Type-safe component variant management
- **date-fns**: Date manipulation and formatting utilities