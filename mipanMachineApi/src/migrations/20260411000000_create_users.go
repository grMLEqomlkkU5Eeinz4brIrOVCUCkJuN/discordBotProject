package migrations

import (
	"context"
	"fmt"

	"github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/models"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		fmt.Println("creating users table...")
		_, err := db.NewCreateTable().
			Model((*models.User)(nil)).
			IfNotExists().
			Exec(ctx)
		return err
	}, func(ctx context.Context, db *bun.DB) error {
		fmt.Println("dropping users table...")
		_, err := db.NewDropTable().
			Model((*models.User)(nil)).
			IfExists().
			Exec(ctx)
		return err
	})
}
