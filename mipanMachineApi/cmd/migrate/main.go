package main

import (
	"context"
	"flag"
	"log"

	configuration "github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/config"
	"github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/db"
	"github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/migrations"
	"github.com/uptrace/bun/migrate"
)

func main() {
	cmd := flag.String("cmd", "up", "migration command: init | up | down | status")
	flag.Parse()

	ctx := context.Background()

	cfg, err := configuration.Get()
	if err != nil {
		log.Fatalf("failed to load configuration: %v", err)
	}

	bunDB, err := db.CreateDb(cfg.Db)
	if err != nil {
		log.Fatalf("failed to create db: %v", err)
	}
	defer bunDB.Close()

	migrator := migrate.NewMigrator(bunDB, migrations.Migrations)

	switch *cmd {
	case "init":
		if err := migrator.Init(ctx); err != nil {
			log.Fatalf("init: %v", err)
		}
		log.Println("migrations tables created")

	case "up":
		if err := migrator.Init(ctx); err != nil {
			log.Fatalf("init: %v", err)
		}
		group, err := migrator.Migrate(ctx)
		if err != nil {
			log.Fatalf("migrate: %v", err)
		}
		if group.IsZero() {
			log.Println("there are no new migrations to run (database is up to date)")
			return
		}
		log.Printf("migrated to %s", group)

	case "down":
		group, err := migrator.Rollback(ctx)
		if err != nil {
			log.Fatalf("rollback: %v", err)
		}
		if group.IsZero() {
			log.Println("there are no groups to rollback")
			return
		}
		log.Printf("rolled back %s", group)

	case "status":
		ms, err := migrator.MigrationsWithStatus(ctx)
		if err != nil {
			log.Fatalf("status: %v", err)
		}
		log.Printf("migrations: %s", ms)
		log.Printf("unapplied migrations: %s", ms.Unapplied())
		log.Printf("last migration group: %s", ms.LastGroup())

	default:
		log.Fatalf("unknown cmd: %q", *cmd)
	}
}
