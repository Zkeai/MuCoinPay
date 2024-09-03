package server

import (
	chttp "github.com/Zkeai/MuCoinPay/mucoin_pay_go/common/net/cttp"
	"github.com/Zkeai/MuCoinPay/mucoin_pay_go/internal/conf"

	"github.com/Zkeai/MuCoinPay/mucoin_pay_go/internal/handler"
	"github.com/Zkeai/MuCoinPay/mucoin_pay_go/internal/service"
)

func NewHTTP(conf *conf.Conf) *chttp.Server {
	s := chttp.NewServer(conf.Server)

	svc := service.NewService(conf)
	handler.InitRouter(s, svc)

	err := s.Start()

	if err != nil {
		panic(err)
	}

	return s
}
