# Customer Support Frontend

This is the Next.js frontend for the AI Customer Support Intelligence Platform.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/UI** - High-quality component library
- **Lucide React** - Icon library
- **Recharts** - Charting library

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Backend API running on http://localhost:8000

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open http://localhost:3000 to see the application.

### Environment Variables

Create `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Use mock API (no backend required)
NEXT_PUBLIC_USE_MOCK_API=false
```

## Project Structure

```
cs-frontend/
├── app/
│   ├── layout.tsx          # Root layout with auth provider
│   ├── page.tsx            # Main application (protected)
│   ├── login/              # Login page
│   └── globals.css         # Global styles & theme
├── components/
│   ├── ui/                 # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── inbox/              # Inbox feature components
│   │   ├── message-list.tsx
│   │   ├── message-detail.tsx
│   │   └── ai-analysis-panel.tsx
│   └── dashboard/
│       └── analytics-dashboard.tsx
├── lib/
│   ├── api.ts              # API client
│   ├── auth-context.tsx    # Authentication context
│   └── utils.ts            # Utility functions
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## Key Features

- **Protected Routes** - Authentication required
- **Role-Based UI** - Different views for agents/customers/admins
- **Real-time Updates** - Auto-refresh data
- **Responsive Design** - Mobile-friendly layout
- **Dark Mode Ready** - Theme support built-in
- **Type-Safe** - Full TypeScript coverage
- **Component Library** - Reusable Shadcn/UI components

## Authentication

The app uses JWT-based authentication:

- Login at `/login`
- Token stored in localStorage
- Auto-redirect to login if not authenticated
- Logout clears token and redirects to login

Demo accounts available in [parent README](../README.md).

## API Integration

API client located in `lib/api.ts`:

```typescript
import { api } from "@/lib/api";

// Example usage
const messages = await api.getMessages();
const stats = await api.getDashboardStats();
```

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server on http://localhost:3000

# Build
pnpm build            # Build for production
pnpm start            # Start production server

# Linting
pnpm lint             # Run ESLint
```

## UI Components

Using Shadcn/UI components. To add new components:

```bash
npx shadcn@latest add <component-name>
```

Example:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

## Styling

- **Tailwind CSS v4** for utility classes
- **CSS Variables** for theming (see `app/globals.css`)
- **Purple/Violet** primary theme
- **Light mode** optimized (dark mode ready)

### Theme Colors

```css
--primary: rgb(139 92 246); /* Purple */
--accent: rgb(233 213 255); /* Light purple */
--background: #f8f9fa; /* Light gray */
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set root directory to `cs-frontend`
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
5. Deploy

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

### Build for Production

```bash
pnpm build
pnpm start
```

## Troubleshooting

**API connection errors:**

- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running
- Check browser console for CORS errors

**Type errors:**

- Run `pnpm build` to check for issues
- Ensure `@types/*` packages are installed

**Styling issues:**

- Clear `.next` folder: `rm -rf .next`
- Rebuild: `pnpm dev`

## Learn More

- **Project Docs:** [../README.md](../README.md)
- **API Guide:** [../QUICKSTART.md](../QUICKSTART.md)
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Shadcn/UI:** https://ui.shadcn.com/

## Related

- **Backend:** [../cs-backend/](../cs-backend/)
- **Full Documentation:** [../DOCS.md](../DOCS.md)
