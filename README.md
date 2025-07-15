# Gallery Frontend with Admin Panel

A React + TypeScript + Vite application for managing and displaying photo galleries organized by events and states.

## Features

### Frontend (Public)
- **Home Page**: Browse all events
- **Event Details**: View states associated with each event
- **Photo Gallery**: View photos by state and event
- Responsive design with Tailwind CSS
- Type-safe with TypeScript

### Admin Panel
- **Event Management**: Upload new events with cover images
- **State Management**: Add states to events
- **Photo Upload**: Bulk upload photos to specific event/state combinations
- File upload functionality
- Form validation and error handling

## Project Structure

```
src/
├── Components/
│   ├── EventCard.tsx       # Display event cards
│   ├── StateCard.tsx       # Display state cards
│   ├── PhotoGrid.tsx       # Display photo galleries
│   ├── Navbar.tsx          # Navigation component
│   └── Layout.tsx          # Main layout wrapper
├── pages/
│   ├── Admin.tsx           # Admin panel interface
│   ├── States.tsx          # Event details page
│   ├── Photos.tsx          # Photo gallery page
│   └── Home.tsx            # Home page
├── types/
│   └── index.ts            # TypeScript type definitions
├── api.ts                  # API configuration
├── App.tsx                 # Main app component
└── main.tsx                # Application entry point
```

## Routes

- `/` - Home page (list of events)
- `/events/:eventId` - Event details (list of states)
- `/events/:eventId/states/:stateId` - Photo gallery
- `/admin` - Admin panel for content management

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **ESLint** - Code linting

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd photos-website-frontend-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Run linting:**
   ```bash
   npm run lint
   ```

## API Integration

The application expects a backend API with the following endpoints:

### Events
- `GET /events` - List all events
- `POST /events` - Create new event

### States
- `GET /states?eventId={eventId}` - List states for an event
- `POST /states` - Create new state

### Photos
- `GET /events/{eventId}/states/{stateId}/photos` - List photos
- `POST /photos` - Upload new photos

### File Upload
- `POST /upload` - Upload files

## Data Models

### Event
```typescript
interface Event {
  _id: string;
  name: string;
  date: string;
  coverImage?: string;
}
```

### State
```typescript
interface State {
  _id: string;
  name: string;
  eventId: string;
}
```

### Photo
```typescript
interface Photo {
  _id: string;
  imageUrl: string;
  uploadedAt: string;
  eventId: string;
  state: string;
}
```

## Navigation

The application includes a navigation bar that allows switching between:
- **Home**: Public gallery view
- **Admin**: Administrative interface

## Recent Changes

✅ **Fixed TypeScript Issues:**
- Added proper type definitions for all data models
- Fixed linting errors with type-only imports
- Resolved unused variable warnings

✅ **Integrated Admin Panel:**
- Merged admin functionality into main project
- Added admin route and navigation
- Unified styling and components

✅ **Improved Architecture:**
- Added Layout component with navigation
- Updated routing structure
- Cleaned up API configuration for Vite

✅ **Code Quality:**
- All linting errors resolved
- TypeScript strict mode compliance
- Proper error handling with logging

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style

The project uses ESLint with TypeScript rules for code quality and consistency. All code must pass linting before deployment.

### Type Safety

The project uses strict TypeScript configuration with proper type definitions for all data structures and API responses.

## Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure your backend API is accessible from the deployed URL
4. Update `VITE_API_URL` environment variable for production
