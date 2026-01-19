# Email Summarizer

An intelligent email management application that automatically summarizes emails and categorizes them using AI. Built with React, Express, and OpenAI.

## Features

- **Email Summarization**: Automatically generates concise 2-3 sentence summaries of emails using OpenAI's API
- **Smart Categorization**: Automatically categorizes emails (Meeting, Invoice, Support Request, Newsletter, General)
- **Email List Display**: View all emails with their summaries and categories in an organized list
- **Real-time Processing**: Process emails on demand with instant feedback
- **Status Tracking**: Track processing status for each email
- **Responsive UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Database Persistence**: Store emails and their summaries using PostgreSQL with Drizzle ORM

## Tech Stack

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **TanStack React Query**: Data fetching and caching
- **Wouter**: Lightweight router

### Backend
- **Express**: Web server framework
- **Node.js**: Runtime environment
- **TypeScript**: Type-safe backend code
- **PostgreSQL**: Database
- **Drizzle ORM**: Type-safe SQL query builder
- **OpenAI API**: Email summarization and categorization
- **Passport**: Authentication

### DevTools
- **Drizzle Kit**: Database migrations and schema management
- **TSX**: Execute TypeScript directly
- **esbuild**: Fast bundler

## Project Structure

```
Email-Summarizer/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries
│   │   └── App.tsx           # Main app component
│   └── index.html
├── server/                    # Express backend
│   ├── index.ts              # Server setup
│   ├── routes.ts             # API routes
│   ├── db.ts                 # Database setup
│   ├── storage.ts            # Data storage
│   └── vite.ts               # Vite dev server config
├── shared/                    # Shared code
│   ├── schema.ts             # Database schema
│   ├── routes.ts             # API route types
│   └── models/               # Shared data models
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
├── drizzle.config.ts         # Drizzle config
└── tailwind.config.ts        # Tailwind config
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Email-Summarizer.git
   cd Email-Summarizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5010
   DATABASE_URL=postgresql://user:password@localhost:5432/email_summarizer
   AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key
   AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5010`

### Build & Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## API Endpoints

- `GET /api/emails` - Fetch all emails
- `POST /api/emails` - Create new email
- `POST /api/emails/:id/summarize` - Summarize a specific email
- `PUT /api/emails/:id` - Update email
- `DELETE /api/emails/:id` - Delete email

## How It Works

1. **Email Input**: Emails are submitted to the application with sender, subject, and body
2. **AI Processing**: The OpenAI API analyzes each email and:
   - Generates a 2-3 sentence summary
   - Assigns a category (Meeting, Invoice, Support Request, Newsletter, General)
3. **Storage**: Results are stored in PostgreSQL for persistence
4. **Display**: The dashboard displays all emails with their summaries and categories

## Features in Detail

### Smart Categorization
The AI automatically categorizes emails into predefined categories:
- **Meeting** - Meeting requests and calendar updates
- **Invoice** - Billing and payment-related emails
- **Support Request** - Customer support inquiries
- **Newsletter** - Newsletters and subscriptions
- **General** - Other emails

### Real-time Status
Track processing status for each email:
- Pending processing
- Processed with summary
- Error handling with user feedback

## Customization

### Modify Email Categories
Edit the prompt in [server/routes.ts](server/routes.ts) to change how emails are categorized.

### Adjust Summary Length
Modify the summarization prompt to generate longer or shorter summaries.

### Styling
Customize colors and styling using [tailwind.config.ts](tailwind.config.ts).

## Database

The project uses PostgreSQL with Drizzle ORM for type-safe database operations.

### Create a new migration:
```bash
npm run db:push
```

### View database:
Use Drizzle Studio or any PostgreSQL client to inspect the data.

