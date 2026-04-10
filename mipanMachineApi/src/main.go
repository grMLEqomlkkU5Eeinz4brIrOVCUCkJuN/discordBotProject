package main

import (
	"log"

	"github.com/gin-gonic/gin"
	configuration "github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/config"
	"github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/db"
	"github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/handlers"
	discorduser "github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/repository/discordUser"
	"github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/routes"
	"github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/service"
)

func main() {
	cfg, err := configuration.Get()
	if err != nil {
		log.Fatalf("failed to load configuration: %v", err)
	}

	bunDB, err := db.CreateDb(cfg.Db)
	if err != nil {
		log.Fatalf("failed to create db: %v", err)
	}
	defer bunDB.Close()

	userRepo := discorduser.NewRepository(bunDB)
	userSvc := service.NewUserService(userRepo)
	userHandler := handlers.NewUserHandler(userSvc)

	r := gin.Default()
	routes.Register(r, userHandler)

	if err := r.Run(":" + cfg.Server.Port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
