# Cover It Up

Cover It Up is a web application that allows users to customize phone cases by uploading their own images or designs. The app provides an intuitive interface for customizing, previewing, and ordering personalized phone cases.

## Project Features

- **Phone Case Customization**: Users can upload their images or designs to create personalized phone cases.
- **Drag-and-Drop**: Easy-to-use drag-and-drop functionality for positioning images on the case.
- **Real-Time Preview**: Live preview of how the case will look after customization.
- **User Authentication**: Secure user login and session management.
- **Stripe Integration**: Seamless payment processing for case orders.
- **Image Upload**: Users can upload high-resolution images with support for multiple formats.
- **Confetti Animation**: Celebrate successful orders with confetti animations.

## Technologies Used

- **Next.js**: Framework for server-side rendering and static site generation.
- **TypeScript**: Strongly-typed JavaScript for scalable development.
- **Prisma**: ORM for database management.
- **MongoDB**: NoSQL database for storing user and order data.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Radix UI**: Accessible and composable UI primitives for React.
- **Framer Motion**: Powerful animations and transitions for React.
- **Stripe**: Payment processing integration for order transactions.
- **React Query (TanStack Query)**: Data fetching, caching, and synchronization.
- **Resend**: Email API for sending order confirmations and updates.
- **React Dropzone**: File upload functionality for customizing phone cases.
- **Sharp**: Image processing for generating phone case previews.
- **Zod**: Validation schema for form inputs and backend requests.

## Installation and Setup

Follow these steps to set up and run the project locally:

### Install Dependencies

```bash
npm install
```

### Start Development Server

To run the application locally:

```bash
bun run dev
```

This command will start the development server and open the application in your browser at http://localhost:3000.

### Build for Production

To build the application for production:

```bash
bun run build
```

## Commands

- **dev**: Starts the development server.
- **build**: Builds the application for production.
- **start**: Starts the application in production mode.
- **lint**: Runs ESLint to check the code.
- **postinstall**: Runs Prisma's generate command to set up the client.