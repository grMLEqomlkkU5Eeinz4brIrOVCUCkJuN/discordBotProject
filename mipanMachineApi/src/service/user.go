package service

import (
	"context"

	"github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/models"
	discorduser "github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/repository/discordUser"
)

type UserService struct {
	repo *discorduser.Repository
}

func NewUserService(repo *discorduser.Repository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetUserByID(ctx context.Context, id int64) (*models.User, error) {
	return s.repo.GetDiscordUserById(ctx, id)
}

func (s *UserService) UpsertUser(ctx context.Context, id int64, username string) (*models.User, error) {
	user := &models.User{ID: id, Username: username}
	if err := s.repo.UpsertDiscordUser(ctx, user); err != nil {
		return nil, err
	}
	return user, nil
}
