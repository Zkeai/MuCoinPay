package service

import "github.com/Zkeai/MuCoinPay/mucoin_pay_go/internal/conf"
import "github.com/Zkeai/MuCoinPay/mucoin_pay_go/internal/repo"

type Service struct {
	conf *conf.Conf
	repo *repo.Repo
}

func NewService(conf *conf.Conf) *Service {
	return &Service{
		conf: conf,
		repo: repo.NewRepo(conf),
	}
}
