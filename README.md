# Contract Management Platform

A full-stack Contract Management Platform built with Next.js, TypeScript, Prisma, and SQLite. This platform allows users to create reusable contract blueprints, generate contracts from blueprints, and manage contract lifecycles with enforced state transitions.

## Features

### 1. Blueprint Management
- Create reusable contract templates (blueprints) with configurable fields
- Supported field types:
  - **Text**: Single-line text input
  - **Date**: Date picker
  - **Signature**: Signature field (text-based in this implementation)
  - **Checkbox**: Boolean checkbox
- Each field stores:
  - Field type
  - Label
  - Position (X/Y coordinates)
  - Required flag

### 2. Contract Creation
- Select an existing blueprint
- Generate a contract instance from the blueprint
- Contract inherits all blueprint fields
- Fill in values for contract fields
- All contract data is persisted

### 3. Contract Lifecycle Management
Enforced lifecycle transitions:
- **Created** → Approved, Revoked
- **Approved** → Sent, Revoked
- **Sent** → Signed, Revoked
- **Signed** → Locked
- **Locked** → (immutable, no transitions allowed)
- **Revoked** → (cannot move forward)

### 4. Contract Dashboard
- View all contracts in a table format
- Filter contracts by status (Created, Approved, Sent, Signed, Locked, Revoked)
- Display contract name, blueprint name, status, and created date
- Change contract status with validation
- View individual contract details

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **State Management**: TanStack Query (React Query), Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## Architecture Overview

### Project Structure

```
contract-management-platform/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── blueprints/    # Blueprint CRUD endpoints
│   │   │   └── contracts/     # Contract CRUD and lifecycle endpoints
│   │   ├── blueprints/        # Blueprint pages
│   │   ├── contracts/         # Contract pages
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Dashboard
│   │   └── providers.tsx      # React Query provider
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-blueprints.ts  # Blueprint data hooks
│   │   └── use-contracts.ts   # Contract data hooks
│   └── lib/
│       ├── prisma.ts          # Prisma client singleton
│       ├── contract-lifecycle.ts  # Lifecycle transition logic
│       └── api-client.ts      # Axios client configuration
├── package.json
├── tsconfig.json
└── README.md
```

### Database Schema

The application uses Prisma with SQLite. The schema includes:

1. **Blueprint**: Reusable contract templates
   - `id`: Unique identifier
   - `name`: Blueprint name
   - `description`: Optional description
   - `fields`: Related blueprint fields
   - Timestamps

2. **BlueprintField**: Fields within a blueprint
   - `id`: Unique identifier
   - `blueprintId`: Foreign key to Blueprint
   - `type`: Field type (TEXT, DATE, SIGNATURE, CHECKBOX)
   - `label`: Field label
   - `positionX`, `positionY`: Field position
   - `required`: Whether field is required

3. **Contract**: Contract instances created from blueprints
   - `id`: Unique identifier
   - `name`: Contract name
   - `blueprintId`: Foreign key to Blueprint
   - `status`: Current lifecycle status
   - `fields`: Related contract field values
   - Timestamps

4. **ContractField**: Field values for contracts
   - `id`: Unique identifier
   - `contractId`: Foreign key to Contract
   - `fieldId`: Reference to BlueprintField id
   - `value`: JSON string storing field value

### API Design

#### Blueprint Endpoints

- `GET /api/blueprints` - List all blueprints
- `GET /api/blueprints/[id]` - Get blueprint by ID
- `POST /api/blueprints` - Create new blueprint
- `DELETE /api/blueprints/[id]` - Delete blueprint

#### Contract Endpoints

- `GET /api/contracts` - List contracts (optional `?status=STATUS` query param)
- `GET /api/contracts/[id]` - Get contract by ID
- `POST /api/contracts` - Create new contract from blueprint
- `PATCH /api/contracts/[id]` - Update contract fields (blocked if locked)
- `POST /api/contracts/[id]/transition` - Transition contract status

#### Request/Response Examples

**Create Blueprint:**
```json
POST /api/blueprints
{
  "name": "Employment Contract",
  "description": "Standard employment agreement",
  "fields": [
    {
      "type": "TEXT",
      "label": "Employee Name",
      "positionX": 0,
      "positionY": 0,
      "required": true
    },
    {
      "type": "DATE",
      "label": "Start Date",
      "positionX": 0,
      "positionY": 1,
      "required": true
    }
  ]
}
```

**Create Contract:**
```json
POST /api/contracts
{
  "name": "Employment Contract - John Doe",
  "blueprintId": "clx123...",
  "fields": {
    "field-id-1": "John Doe",
    "field-id-2": "2024-01-15"
  }
}
```

**Transition Contract:**
```json
POST /api/contracts/[id]/transition
{
  "status": "APPROVED"
}
```

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **pnpm** or **yarn**
- **Git** (for cloning the repository)

You can verify your installations by running:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version
```

### Step-by-Step Setup Guide

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd contract-management-assessment
```

#### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:
- Next.js and React
- Prisma ORM
- TanStack Query
- React Hook Form and Zod
- Tailwind CSS
- And other required packages

#### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project:

```bash
touch .env
```

Add the following content to the `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

**Important Notes:**
- The `.env` file is already in `.gitignore` and won't be committed to version control
- `NEXT_PUBLIC_API_URL` is optional. If not set, the API client will automatically use `/api` as the base URL, which works perfectly with Next.js API routes
- If you need to set `NEXT_PUBLIC_API_URL` (e.g., for production), use: `NEXT_PUBLIC_API_URL="http://localhost:3000/api"`

#### 4. Set Up the Database

The project uses SQLite with Prisma ORM. Follow these steps:

**Step 4a: Generate Prisma Client**
```bash
npm run db:generate
```

This command generates the Prisma Client based on your schema, which allows you to interact with your database.

**Step 4b: Create the Database Schema**
```bash
npm run db:push
```

This command:
- Creates the SQLite database file (`dev.db`) in your project root
- Creates all tables defined in `prisma/schema.prisma`
- Sets up relationships and indexes

You should see output like:
```
✔ Generated Prisma Client
✔ Pushed database schema
```

**Step 4c: (Optional) Seed Sample Data**

To populate the database with sample blueprints and contracts:

**Option 1: Using the Seed API Endpoint** (Recommended)
1. Start the development server (see step 5)
2. Open your browser console or use curl:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```
   
   Or use the browser console:
   ```javascript
   fetch('/api/seed', { method: 'POST' })
     .then(res => res.json())
     .then(data => console.log(data))
   ```

**Option 2: Using the Seed Script**
```bash
# First, install tsx if not already installed
npm install tsx --save-dev

# Then run the seed script
npm run db:seed
```

This will create:
- 3 sample blueprints (Employment Contract, NDA, Service Agreement)
- 5 sample contracts with different statuses

#### 5. Start the Development Server

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
✓ Ready in 2.3s
```

#### 6. Open the Application

Open your web browser and navigate to:

**http://localhost:3000**

You should see the Contracts Dashboard. If you seeded the database, you'll see sample contracts listed in the table.

### Database Management Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client from schema |
| `npm run db:push` | Push schema changes to database (creates/updates tables) |
| `npm run db:studio` | Open Prisma Studio (visual database browser) |
| `npm run db:seed` | Seed database with sample data (requires tsx) |

**Viewing the Database:**
```bash
npm run db:studio
```
This opens Prisma Studio at `http://localhost:5555` where you can visually browse and edit your database.

**Resetting the Database:**
If you need to start fresh:
```bash
# Delete the database file
rm prisma/dev.db  # or dev.db in root on Windows

# Recreate the schema
npm run db:push

# (Optional) Seed again
npm run db:seed
```

### Project Structure Overview

```
contract-management-assessment/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.ts                # Database seeding script
├── src/
│   ├── app/
│   │   ├── api/               # Next.js API routes (backend)
│   │   │   ├── blueprints/    # Blueprint CRUD endpoints
│   │   │   ├── contracts/     # Contract CRUD & lifecycle endpoints
│   │   │   └── seed/          # Database seeding endpoint
│   │   ├── blueprints/        # Blueprint pages
│   │   ├── contracts/         # Contract pages
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Dashboard (home page)
│   │   ├── providers.tsx      # React Query provider
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   └── status-change-dropdown.tsx  # Status change component
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-blueprints.ts  # Blueprint data hooks
│   │   └── use-contracts.ts   # Contract data hooks
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── contract-lifecycle.ts  # Lifecycle transition logic
│   │   └── api-client.ts      # Axios client configuration
│   └── types/
│       └── prisma.ts           # TypeScript type definitions
├── .env                       # Environment variables (create this)
├── .gitignore                 # Git ignore rules
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Build the application for production |
| `npm run start` | Start production server (run `build` first) |
| `npm run lint` | Run ESLint to check for code issues |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push database schema changes |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with sample data |

### Troubleshooting

**Issue: Database not found**
- Make sure you've run `npm run db:push` to create the database
- Check that `.env` file exists with `DATABASE_URL="file:./dev.db"`

**Issue: Prisma Client not generated**
- Run `npm run db:generate` after installing dependencies
- Make sure `@prisma/client` is installed: `npm install @prisma/client`

**Issue: Port 3000 already in use**
- Stop other applications using port 3000, or
- Set a different port: `PORT=3001 npm run dev`

**Issue: API routes return 404**
- Make sure the API routes are in `src/app/api/` directory
- Check that `NEXT_PUBLIC_API_URL` in `.env` ends with `/api` or is not set

**Issue: Styles not loading**
- Make sure Tailwind CSS is properly configured
- Run `npm install` to ensure all dependencies are installed
- Check that `tailwind.config.ts` includes the correct content paths

**Issue: TypeScript errors**
- Run `npm run db:generate` to regenerate Prisma types
- Make sure all dependencies are installed: `npm install`
- Check `tsconfig.json` paths configuration

### Next Steps After Setup

1. **Explore the Dashboard**: View contracts and their statuses
2. **Create a Blueprint**: Go to "New Blueprint" and create a contract template
3. **Create a Contract**: Use a blueprint to create a new contract
4. **Test Lifecycle Transitions**: Try changing contract statuses and see the validation
5. **View Contract Details**: Click "View" on any contract to see full details

### Development Tips

- **Hot Reload**: Next.js automatically reloads when you save files
- **Database Changes**: After modifying `prisma/schema.prisma`, run `npm run db:push`
- **API Testing**: Use browser DevTools Network tab or tools like Postman
- **Database Inspection**: Use `npm run db:studio` to visually inspect your data

## Usage Guide

### Creating a Blueprint

1. Navigate to "New Blueprint" from the navigation menu
2. Enter blueprint name and optional description
3. Add fields:
   - Select field type
   - Enter field label
   - Set position (X, Y coordinates)
   - Mark as required if needed
4. Click "Create Blueprint"

### Creating a Contract

1. Navigate to "Create Contract" from the dashboard
2. Enter contract name
3. Select a blueprint
4. Fill in all required fields
5. Click "Create Contract"

### Managing Contract Lifecycle

1. View contracts on the dashboard
2. Use the "Change Status" dropdown to transition contracts
3. Only valid transitions are allowed (enforced by backend)
4. Locked contracts cannot be modified
5. Revoked contracts cannot proceed further

### Filtering Contracts

Use the status filter dropdown on the dashboard to view:
- All contracts
- Contracts by specific status (Created, Approved, Sent, Signed, Locked, Revoked)

## Assumptions and Trade-offs

### Assumptions

1. **Authentication**: Authentication is optional per requirements. The system is designed to work without authentication, but the architecture supports adding it later.

2. **Signature Field**: Signature fields are implemented as text inputs. In a production system, this would integrate with digital signature services or file upload functionality.

3. **Field Position**: Position (X/Y) is stored but not visually rendered in the UI. This is stored for future enhancements like drag-and-drop form builders.

4. **Single User**: The system assumes single-user or multi-user scenarios without role-based access control (though architecture supports adding it).

5. **No File Attachments**: Contracts don't support file attachments beyond signature fields.

### Trade-offs

1. **SQLite vs PostgreSQL**: SQLite is used for simplicity and easy setup. For production, PostgreSQL would be preferred for better concurrency and scalability.

2. **Next.js API Routes**: Using Next.js API routes instead of a separate backend server simplifies deployment but couples frontend and backend. For larger scale, a separate API server would be beneficial.

3. **No Real-time Updates**: Contract status changes don't update in real-time across multiple browser sessions. This could be added with WebSockets or Server-Sent Events.

4. **Simple UI**: Focus is on functionality over visual polish. The UI is clean and functional but could be enhanced with more sophisticated design systems.

5. **No Pagination**: Contract and blueprint lists don't paginate. This is acceptable for small datasets but would need pagination for production use.

6. **No Soft Deletes**: Blueprints are hard-deleted. In production, soft deletes would preserve data integrity.

## Optional Enhancements (Implemented ✅)

### ✅ API Documentation
- **Swagger/OpenAPI**: Available at `/api-docs` route
- **Postman Collection**: `postman-collection.json` included in the repository
- View API documentation in browser or import Postman collection

### ✅ Role-based Actions
- **User Roles**: VIEWER, APPROVER, SIGNER, ADMIN
- **Permission System**: Role-based access control for contract actions
- **Status Transitions**: Enforced by role permissions
  - APPROVER: Can approve, revoke, and send contracts
  - SIGNER: Can sign and lock contracts
  - ADMIN: Full access to all actions
- See `src/lib/roles.ts` for permission definitions

### ✅ Status Timeline View
- **Status History**: All status changes are tracked in `ContractStatusHistory` table
- **Timeline Component**: Visual timeline showing all status transitions
- **History API**: `GET /api/contracts/[id]/history` endpoint
- View timeline on contract detail page

### ✅ Unit/Integration Tests
- **Jest Setup**: Configured with Next.js testing utilities
- **Test Coverage**: 
  - Contract lifecycle logic tests
  - Role-based permission tests
  - API integration test structure
- Run tests: `npm test`
- Watch mode: `npm run test:watch`
- Coverage: `npm run test:coverage`

### ✅ Docker Setup
- **Dockerfile**: Production-ready Docker image
- **Docker Compose**: Development and production configurations
- **Commands**:
  ```bash
  # Build and run production
  docker-compose up
  
  # Development mode
  docker-compose --profile dev up dev
  ```

## Future Enhancements

- **File Upload**: Support for document attachments
- **Email Notifications**: Notify stakeholders on status changes
- **Search Functionality**: Full-text search for contracts
- **Export**: PDF generation for contracts
- **Real Authentication**: Replace mock user system with actual auth

## Development Commands

```bash
# Development
npm run dev              # Start development server

# Build
npm run build           # Build for production
npm start              # Start production server

# Database
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes to database
npm run db:studio      # Open Prisma Studio

# Linting
npm run lint           # Run ESLint
```

## License

This project is created for assessment purposes.
