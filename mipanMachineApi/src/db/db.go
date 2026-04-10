package db

import (
	"database/sql"

	configuration "github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/config"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
)

func CreateDb(config configuration.Db) (*bun.DB, error) {
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(config.DataSourceName)))
	sqldb.SetMaxIdleConns(config.MaxIdleConns)
	sqldb.SetMaxOpenConns(config.MaxOpenConns)
	db := bun.NewDB(sqldb, pgdialect.New())

	// Add query debugging (optional)
	db.AddQueryHook(bundebug.NewQueryHook(
		bundebug.WithVerbose(true),
	))

	return db, nil
}
