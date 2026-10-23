# SQL Schemas — Poker Databases

Run the files in **numeric order**: the numbers encode the foreign-key
dependencies. Creating or inserting out of order fails.

The `create_db_*.sql` files document each database; on shared hosting
the databases themselves are created in cPanel (phpMyAdmin refuses
CREATE DATABASE).

## poker_night_organizers

Create, in order:

1. `create-table/01_create_color.sql`
2. `create-table/02_create_login_organisateur.sql`
3. `create-table/03_create_amount_color.sql`
4. `create-table/04_create_mise_small_big.sql`
5. `../timer-poker/tables-sql/create-table/create_timer_logs.sql`
   (timer-specific table — it references `login_organisateur`)

Then insert in the same order, using the files in `insert-table/`
(same numbering; not versioned — they contain real data).

## poker_night_stats

Documented by `create_db_poker_night_stats.sql`. Its tables will be
added here when the poker stats tool is built.
