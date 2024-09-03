package conf

import (
	"github.com/Zkeai/MuCoinPay/mucoin_pay_go/common/database"
	chttp "github.com/Zkeai/MuCoinPay/mucoin_pay_go/common/net/cttp"
	"github.com/Zkeai/MuCoinPay/mucoin_pay_go/common/redis"
)

type Conf struct {
	Server *chttp.Config    `yaml:"server"`
	DB     *database.Config `yaml:"db"`
	Rdb    *redis.Config    `yaml:"redis"`
}
