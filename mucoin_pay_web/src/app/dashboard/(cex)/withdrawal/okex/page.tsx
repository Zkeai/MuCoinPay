'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Switch, Input, Typography, Button, List, Tooltip, Select, Toast } from '@douyinfe/semi-ui';
import useOkexComponent from '@/hooks/cex/useOkexComponent';
import CustomTextArea from '@/components/custom/CustomTextArea';
import Modal from '@/components/cex/Modal';
import Icon from '@/components/custom/Icon';
import Styles from '../cex.module.css';
import { okexWithdrawal } from '@/http/api/cex/okex/api';

interface Network {
  chain: string;
  minFee: string;
  ccy: string;
  minWd: string;
}

interface CoinInfo {
  ccy: string;
  bal: string;
  availBal: string;
  frozenBal: string;
}

const OkexComponent: React.FC = () => {
  const {
    apiKey,
    secretKey,
    passphrase,
    textAreaValue,
    setTextAreaVal,
    open,
    modalOpen,
    setOpenModal,
    accountInfo,
    handleApiKeyChange,
    handleSecretKeyChange,
    handlePassphraseChange,
    handleSwitchChange,
    clearDataHandle,
    queryAccountInfo,
    networkList,
    coins,
    selectedCoin,
    setSelectedCoin
  } = useOkexComponent();

  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [drawSuccess, setDrawSuccess] = useState<string | null>(null);
  const [drawFail, setDrawFail] = useState<string | null>(null);
  const [minFee, setMinFee] = useState<string>("0");

  const handleClick = (index: string, fee: string) => {
    setMinFee(fee);
    setActiveIndex(index);
  };

  const handleCoinChange = useCallback((value: string | number | any[] | Record<string, any> | undefined ) => {
    setSelectedCoin(value as string);
  }, [setSelectedCoin]);

  useEffect(() => {
    if (coins.length > 0) {
      handleCoinChange(coins[0]);
    }
  }, [coins, handleCoinChange]);

  const withDrawalHandle = async () => {
    let successDraw = "";
    let failDraw = "";
    if (!textAreaValue || !selectedCoin || activeIndex === null) {
      Toast.error("参数不全");
      return;
    }

    const lines = textAreaValue.split('\n');
    for (const line of lines) {
      const [address, amount] = line.split(",");
      if (!address || !amount) {
        Toast.error("地址或数量格式不正确");
        continue;
      }
      try {
        const coin = selectedCoin || '';
        const network = activeIndex || '';
        await okexWithdrawal({ apiKey, secretKey, passphrase, coin, address, amount, network, minFee });
        successDraw += `${address} > 提币成功\n`;
      } catch (error) {
        failDraw += `${address} > 提币失败 > ${error}\n`;
      }
    }

    setDrawSuccess(successDraw);
    setDrawFail(failDraw);
  };

  return (
    <div className="flex flex-col mt-10 space-x-5 space-y-10">
      <div className="flex space-x-5">
        <Input
          prefix="Api_key"
          showClear
          value={apiKey}
          onChange={handleApiKeyChange}
        />
        <Input
          prefix="Secret_key"
          showClear
          value={secretKey}
          onChange={handleSecretKeyChange}
        />
        <Input
          prefix="Passphrase"
          showClear
          value={passphrase}
          onChange={handlePassphraseChange}
        />
      </div>

      <div className="flex space-x-5">
        <div className="flex items-center">
          <Switch checked={open} onChange={handleSwitchChange} aria-label="a switch for demo" />
          <Typography.Title heading={6} className="m-8">
            {open ? '已开启本地存储信息' : '已关闭本地存储信息'}
          </Typography.Title>
          <Tooltip
            content='数据保存在本地localStorage,以便下次使用,建议每次使用完后清理,数据不会上传。'
            arrowPointAtCenter={false}
            position='topLeft'
          >
            <div className="cursor-help">
              <Icon type="icon-yihuo" size={20} />
            </div>
          </Tooltip>
        </div>
        <div className="pl-48">
          <Button
            className="mr-8"
            onClick={clearDataHandle}
            style={{ backgroundColor: '#42b983' }}
            theme="solid"
          >
            清理本地缓存
          </Button>
        </div>
      </div>

      <div className="pl-50 flex flex-col">
        <Button
          className="mr-8"
          onClick={queryAccountInfo}
          style={{ backgroundColor: '#42b983' }}
          theme="solid"
        >
          查询资产
        </Button>
        {accountInfo.length > 0 && (
          <div className="mt-10">
            <List
              header={<div>现货账户信息</div>}
              bordered
              dataSource={accountInfo}
              renderItem={(item: CoinInfo) => (
                <List.Item key={item.ccy}>
                  {item.ccy}: {`[总] ${item.bal} ---- [可用] ${item.availBal} ---- [冻结] ${item.frozenBal}`}
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
      {coins.length > 0 && coins[0] !== "" && (
        <div>
          <div className="mt-3 mb-3 flex flex-col space-y-10">
            <div className="flex flex-col space-y-3">
              <span>选择币种</span>
              <Select defaultValue={coins[0]} style={{ width: 240 }} onChange={handleCoinChange}>
                {coins.map(item => (
                  <Select.Option value={item} key={item}>{item}</Select.Option>
                ))}
              </Select>
            </div>
            <div>
              {networkList.length > 0 && (
                <ul className="grid grid-cols-2 gap-6">
                  {networkList.map((network: Network) => (
                    <li key={network.chain}>
                      <div
                        className={`flex space-x-1 w-[17vw] h-16 rounded-lg pl-2 pt-1
                          ${Styles.netw} ${activeIndex === network.chain ? Styles.active : ''}`}
                        onClick={() => handleClick(network.chain, network.minFee)}
                      >
                        <div className="flex flex-col space-y-1 text-xs">
                          <span>{network.chain}</span>
                          <span>手续费：{network.minFee} {network.ccy}</span>
                          <span>最小提取金额：{network.minWd} {network.ccy}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="flex justify-between items-center">
          <span>地址和数量列表</span>
          <span className="text-gray-500 text-sm underline cursor-pointer" onClick={() => setOpenModal(true)}>
            随机生成提现数量
          </span>
          <Modal
            textVal={textAreaValue}
            setTextVal={setTextAreaVal}
            modalOpen={modalOpen}
            setModalVisible={() => setOpenModal(false)}
          />
        </div>
        <CustomTextArea value={textAreaValue} onChange={setTextAreaVal} />
        <span className="text-sm text-gray-300">每一行包括地址和数量，两者使用英文逗号(,)隔开</span>
        <div className="flex flex-col space-y-5 mt-4">
          <Button
            className="mr-8"
            onClick={withDrawalHandle}
            style={{ backgroundColor: '#42b983' }}
            theme="solid"
          >
            提币
          </Button>
        </div>
        <div className={`mt-5 p-2 w-[35vw] text-[10px] ${!drawSuccess && !drawFail ? "hidden" : ""} ${Styles.draw}`}>
          {drawSuccess && <pre>{drawSuccess}</pre>}
          {drawFail && <pre>{drawFail}</pre>}
        </div>
      </div>
    </div>
  );
};

export default OkexComponent;