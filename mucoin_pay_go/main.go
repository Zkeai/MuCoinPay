package main

import (
	"github.com/Zkeai/MuCoinPay/McPay-go/configs"
	"github.com/Zkeai/MuCoinPay/McPay-go/pkg/db"
	"github.com/Zkeai/MuCoinPay/McPay-go/pkg/logger"
	"github.com/Zkeai/MuCoinPay/McPay-go/pkg/redis"
)

func init() {
	configs.Setup()
	logger.Setup()
	db.ConnectMongoDB()
	redis.ConnectRedis()
}
func main() {

}
