# Monochrome Translations Reader

A minimalist web reader for community-published novel translations. Browse novels, read chapters in a customizable reading canvas, and join the conversation around each story.

## Features

- Browse published novels and chapters, with chapter sorting.
- Read chapters with adjustable typography, line spacing, and canvas backgrounds.
- Choose light or dark mode; reading preferences are saved to your account.
- Create an account, save novels to your library, and continue from your last reading position.
- Post and edit reviews, comments, and nested replies. Reviews support ratings.
- Submit translation or contribution requests and chat with an admin after approval.
- Get newly published chapters through the RSS 2.0 feed at `/rss.xml`.
- Responsive mobile navigation, loading states, and accessible interaction feedback.

## Run locally

Requirements: Node.js and a MongoDB database.

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in the values:

```env
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB=monochrome_translations
READER_SESSION_SECRET=your-long-random-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm run start  # Serve the production build
npm run lint   # Run ESLint
```

Novel and chapter content is read from MongoDB collections shared with the publishing/admin application. Configure both applications to use the same database for published content, accounts, and contribution chat.
