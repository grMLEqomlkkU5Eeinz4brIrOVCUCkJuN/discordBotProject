package models

import "github.com/uptrace/bun"

type User struct {
	bun.BaseModel `bun:"table:users,alias:u"`

	ID       int64  `bun:"id,pk"            json:"id"`
	Username string `bun:"username,notnull" json:"username"`
}
