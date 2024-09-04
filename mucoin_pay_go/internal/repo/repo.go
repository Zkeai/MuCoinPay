package repo

import (
	"context"
	"github.com/Zkeai/MuCoinPay/mucoin_pay_go/internal/conf"
	"github.com/Zkeai/MuCoinPay/mucoin_pay_go/internal/repo/db"
)

type Repo struct {
	db *db.DB
}

func NewRepo(conf *conf.Conf) *Repo {
	return &Repo{
		db: db.NewDB(conf.DB),
	}
}

func (r *Repo) UserRegister(ctx context.Context, wallet string) (*db.YuUser, error) {

	return r.db.InsertUser(ctx, wallet)
}

func (r *Repo) UserQuery(ctx context.Context, wallet string) (*db.YuUser, error) {

	return r.db.QueryUser(ctx, wallet)
}

func (r *Repo) BusinessRegister(ctx context.Context, userID int64) (string, error) {

	return r.db.InsertBusiness(ctx, userID)
}

func (r *Repo) BusinessQuery(ctx context.Context, host string) (*db.YuBusiness, error) {

	return r.db.QueryBusiness(ctx, host)
}

func (r *Repo) CategoryAdd(ctx context.Context, name string, userID int64, sort *int8, icon string) (string, error) {

	return r.db.InsertCategory(ctx, name, userID, sort, icon)
}

func (r *Repo) CategoryQuery(ctx context.Context, userid int64) ([]db.YuCategory, error) {

	return r.db.QueryCategory(ctx, userid)
}
