package discorduser

import (
	"context"

	"github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/models"
	"github.com/uptrace/bun"
)

type Repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetDiscordUserById(ctx context.Context, userID int64) (*models.User, error) {
	user := new(models.User)
	err := r.db.NewSelect().
		Model(user).
		Where("id = ?", userID).
		Scan(ctx)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// UpsertDiscordUser inserts a user row, updating the username on conflict.
// This lets Postgres act as a cache keyed by the Discord user ID.
func (r *Repository) UpsertDiscordUser(ctx context.Context, user *models.User) error {
	_, err := r.db.NewInsert().
		Model(user).
		On("CONFLICT (id) DO UPDATE").
		Set("username = EXCLUDED.username").
		Exec(ctx)
	return err
}
