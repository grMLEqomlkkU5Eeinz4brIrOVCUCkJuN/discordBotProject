package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/grMLEqomlkkU5Eeinz4brIrOVCUCkJuN/discordBotProject/mipanMachineApi/src/handlers"
)

func Register(r *gin.Engine, userHandler *handlers.UserHandler) {
	api := r.Group("/api/v1")
	{
		api.GET("/users/:id", userHandler.GetUsernameByID)
		api.POST("/users", userHandler.UpsertUser)
	}
}
