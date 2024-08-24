package db

import (
	"context"
	"fmt"
	"time"

	"github.com/Zkeai/MuCoinPay/McPay-go/configs"
	"github.com/Zkeai/MuCoinPay/McPay-go/pkg/logger"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoDB *mongo.Client

func ConnectMongoDB() {
	uri := fmt.Sprintf("mongodb://%s:%s@%s:%d/%s",
		configs.C.MongoDB.User,
		configs.C.MongoDB.Password,
		configs.C.MongoDB.Host,
		configs.C.MongoDB.Port,
		configs.C.MongoDB.Name,
	)
	clientOptions := options.Client().ApplyURI(uri)

	_, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	var err error
	MongoDB, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		logger.Fatal("无法链接到MongoDB: ", err)
	}

	err = MongoDB.Ping(context.TODO(), nil)
	if err != nil {
		logger.Fatal("无法链接到MongoDB: ", err)
	}

}

func CloseMongoDB() {
	defer func(MongoDB *mongo.Client, ctx context.Context) {
		err := MongoDB.Disconnect(ctx)
		if err != nil {
			logger.Fatal("关闭MongoDB失败: ", err)
		}
	}(MongoDB, context.TODO())
}
