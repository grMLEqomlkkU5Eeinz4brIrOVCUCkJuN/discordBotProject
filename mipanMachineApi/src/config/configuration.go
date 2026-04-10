package configuration

import (
	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Configuration struct {
	Db     Db
	Server Server
}

type Db struct {
	DataSourceName string `envconfig:"DB_DATA_SOURCE_NAME" required:"true"`
	MaxIdleConns   int    `envconfig:"DB_MAX_IDLE_CONNS" default:"1"`
	MaxOpenConns   int    `envconfig:"DB_MAX_OPEN_CONNS" default:"50"`
}

type Server struct {
	Port string `envconfig:"SERVER_PORT" default:"8080"`
}

func Get() (Configuration, error) {
	_ = godotenv.Load()

	var config Configuration
	if err := envconfig.Process("", &config); err != nil {
		return Configuration{}, err
	}

	return config, nil
}
