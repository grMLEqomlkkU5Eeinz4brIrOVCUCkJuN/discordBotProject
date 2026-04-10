# mipanMachineApi

A Go HTTP API built with [Gin](https://github.com/gin-gonic/gin) and the
[Bun ORM](https://bun.uptrace.dev/) on top of PostgreSQL.

## Project layout

```
mipanMachineApi/
├── cmd/
│   └── migrate/           # CLI binary for running database migrations
│       └── main.go
├── src/
│   ├── config/            # Env-based configuration loader (godotenv + envconfig)
│   ├── db/                # Bun DB constructor
│   ├── handlers/          # Gin HTTP handlers
│   ├── migrations/        # Bun migration registry + migration files
│   ├── models/            # Bun models (table definitions via struct tags)
│   ├── repository/        # Data access layer
│   ├── routes/            # Route registration
│   ├── service/           # Business logic
│   └── main.go            # API entry point
├── .env                   # Local environment variables (not committed)
├── go.mod
└── go.sum
```

## Configuration

Configuration is loaded from environment variables, with an optional `.env`
file auto-loaded at startup. All commands share the same loader
(`src/config/configuration.go`).

| Variable              | Required | Default | Description                               |
| --------------------- | -------- | ------- | ----------------------------------------- |
| `DB_DATA_SOURCE_NAME` | yes      | —       | PostgreSQL DSN used by the Bun pg driver. |
| `DB_MAX_IDLE_CONNS`   | no       | `1`     | Max idle connections in the pool.         |
| `DB_MAX_OPEN_CONNS`   | no       | `50`    | Max open connections in the pool.         |
| `SERVER_PORT`         | no       | `8080`  | Port the Gin HTTP server listens on.      |

Example `.env`:

```env
DB_DATA_SOURCE_NAME=postgres://user:password@localhost:5432/mipanmachine?sslmode=disable
SERVER_PORT=8080
```

## Commands

The project ships with two binaries, both under a standard Go layout.

### 1. API server — `src/main.go`

Starts the Gin HTTP server, wires repositories, services, and handlers, and
connects to PostgreSQL.

```bash
# Run directly
go run ./src

# Or build
go build -o bin/api ./src
./bin/api
```

On startup it:

1. Loads configuration (`configuration.Get()`).
2. Opens a Bun DB connection (`db.CreateDb`).
3. Constructs the repository → service → handler chain for users.
4. Registers routes and starts listening on `SERVER_PORT`.

> **Note:** the server does **not** run migrations automatically. Run
> `cmd/migrate` before starting it against a fresh database.

### 2. Migration CLI — `cmd/migrate`

A dedicated binary that manages schema changes using Bun's built-in
[migration system](https://bun.uptrace.dev/guide/migrations.html). It reads
the same `.env` / environment variables as the API.

```bash
go run ./cmd/migrate -cmd=<command>
```

| `-cmd`   | What it does                                                        |
| -------- | ------------------------------------------------------------------- |
| `init`   | Creates the `bun_migrations` bookkeeping tables. Safe to re-run.    |
| `up`     | Applies all pending migrations (auto-runs `init` first).            |
| `down`   | Rolls back the most recent migration group.                         |
| `status` | Prints applied, unapplied, and last-applied migration group.        |

Default command is `up`, so `go run ./cmd/migrate` will bring the database
up to date.

#### Typical workflows

Fresh database:

```bash
go run ./cmd/migrate -cmd=up
```

Inspect state:

```bash
go run ./cmd/migrate -cmd=status
```

Undo the last migration group:

```bash
go run ./cmd/migrate -cmd=down
```

## How migrations work

Migrations live in `src/migrations/` and are registered at package init time,
so importing the package is enough to make them available to the migrator.

- `src/migrations/migrations.go` creates the shared registry:

  ```go
  var Migrations = migrate.NewMigrations()
  ```

- Each migration is a separate file named
  `YYYYMMDDHHMMSS_description.go`. Bun orders them lexicographically by the
  timestamp prefix. Each file registers an up/down pair in its `init()`:

  ```go
  func init() {
      Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
          _, err := db.NewCreateTable().
              Model((*models.User)(nil)).
              IfNotExists().
              Exec(ctx)
          return err
      }, func(ctx context.Context, db *bun.DB) error {
          _, err := db.NewDropTable().
              Model((*models.User)(nil)).
              IfExists().
              Exec(ctx)
          return err
      })
  }
  ```

  Because migrations reference the Bun models directly, the schema is
  derived from the struct tags in `src/models/` — there is no separate SQL
  file to keep in sync.

- `cmd/migrate/main.go` wires everything together:

  ```go
  migrator := migrate.NewMigrator(bunDB, migrations.Migrations)
  migrator.Init(ctx)
  migrator.Migrate(ctx) // or Rollback / MigrationsWithStatus
  ```

Bun records applied migrations in a `bun_migrations` table and groups
migrations applied together, so `down` rolls back an entire group at once.

### Adding a new migration

1. Create `src/migrations/YYYYMMDDHHMMSS_short_description.go` (use the
   current UTC timestamp; it only needs to be monotonically increasing).
2. In the file, add an `init()` that calls `Migrations.MustRegister(up, down)`.
3. Use Bun query builders against your models for schema changes
   (`NewCreateTable`, `NewAddColumn`, `NewDropColumn`, raw `db.ExecContext`,
   etc.).
4. Run `go run ./cmd/migrate -cmd=up`.

Go-based migrations are preferred here because the schema is already
expressed in the models, but raw SQL migrations (`*.up.sql` / `*.down.sql`)
are also supported by Bun if you need something the query builder cannot
express.
