package db

import (
	"github.com/Zkeai/MuCoinPay/mucoin_pay_go/common/database"
)

type DB struct {
	db *database.DB
}

func NewDB(conf *database.Config) *DB {
	return &DB{
		db: database.NewDB(conf),
	}
}
