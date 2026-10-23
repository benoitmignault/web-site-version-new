# benoitmignault.ca — Website Rebuild

Personal web platform rebuilt from scratch: independent web applications
(React frontends + PHP/MySQL APIs) that replace my original website,
one tool at a time.

All user interfaces are French-first, with a built-in FR/EN language switch
where applicable.

## Projects

| Project | Description | Status |
|---|---|---|
| **Poker Tournament Timer** | Dashboard for home poker tournaments: per-organizer chip colors/values and blind structures, countdown timer with end-of-level alerts. [Live demo](https://poker.benoitmignault.ca/timer-poker/) | Deployed (Oct 2026) |
| **Poker Night Stats** | Statistics from my Friday poker nights with friends (tracked since 2011). | In preparation — database schema ready |
| **Montérégie Golf League** | League standings, results and statistics. | Separate repository: [golf-league-monteregie](https://github.com/benoitmignault/golf-league-monteregie) |

## Tech Stack

- **Frontend:** React 19, Vite, React Router, react-select
- **Backend:** PHP 8.1 (REST-style JSON APIs), MySQL / MariaDB
- **Local environment:** XAMPP (Apache + MariaDB) on Windows
- **Production:** Apache on cPanel shared hosting

## Repository Structure

    poker.benoitmignault.ca/          Frontend apps — one folder per tool
      timer-poker/                    Poker timer (Vite + React)
    api.poker.benoitmignault.ca/      PHP APIs — one folder per tool
      timer-poker/                    Timer endpoints (organizers, chips, blinds, logs)
      includes/                       Connection and shared include files
      tables-sql/                     Timer-specific schema (the timer_logs table)
        create-table/
          create_timer_logs.sql
      tables-sql/                     Schemas of the shared databases (data common to all tools)
        create_db_poker_night_organizers.sql
        create_db_poker_night_stats.sql
        create-table/                 CREATE TABLE files (versioned)
        insert-table/                 INSERT files with real data (not in Git)


Two kinds of content are deliberately **not on GitHub**:
- `tables-sql/insert-table/` — the INSERT files contain real data
  (including password hashes); they live with the server only.
- The credentials file `info-connexion-bd.php` inside each API's
  `includes/` folder — it exists locally and on the server, never in Git.


## Local Development

Prerequisites: XAMPP (Apache + MariaDB) and Node.js.

Frontend (per app):

    cd poker.benoitmignault.ca/timer-poker
    npm install
    npm run dev

The API is served by Apache from the repository folder under `htdocs`.
Copy your own `info-connexion-bd.php` (database credentials) into the API's
`includes/` folder — this file is git-ignored and must never be committed.

Frontend environment files:
- `.env.development` — local API URL
- `.env.production` — production API URL

## Deployment

1. Create the database in cPanel and attach a MySQL user (ALL PRIVILEGES).
   The `create_db_*.sql` files in `api.poker.benoitmignault.ca/tables-sql/`
   document each database (shared hosting refuses CREATE DATABASE in
   phpMyAdmin). Then run the schema files in phpMyAdmin, in order:
   `create-table/` files first, then `insert-table/` files.

2. Upload the API folder, with a production `info-connexion-bd.php`.

3. Build the frontend (`npm run build`) and upload the **contents** of
   `dist/` over the previous version — do not empty the folder, the
   `.htaccess` SPA fallback rule for React Router lives there.
4. Test the app and its direct routes (e.g. `/timer-poker/exclude-analytics`).

## Conventions

- Code identifiers and i18n keys in English; comments and UI copy in French.
- API responses use a JSON envelope: `{ "success": true, ... }` or
  `{ "success": false, "code": "...", "message": "..." }` with matching
  HTTP status codes.
- Files containing real data or credentials (`insert-table/`,
  `info-connexion-bd.php`) are git-ignored.

## License

Personal project — all rights reserved. © Benoit Mignault

