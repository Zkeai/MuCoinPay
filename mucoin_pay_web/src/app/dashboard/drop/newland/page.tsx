'use client';

import React, { useState } from 'react';
import { Card, Typography, Space, Table } from '@douyinfe/semi-ui';
import { ethers } from 'ethers';
import Newland from '@/job/newland/main';

import ProjectInfo from '@/components/airdrop/ProjectInfo';
import Upload from '@/components/custom/upload';

const { Title, Paragraph } = Typography;

const Page: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [privateKeys, setPrivateKeys] = useState<Array<{ key: string; status: string; userId: string; score: number | string }>>([]);

  const projectIconUrl = 'https://public.rootdata.com/images/b12/1694507884532.jpg';
  const projectDescription = 'NewLand 是一个任务管理平台，它将 web3 交互与 web2 用户体验无缝结合。在 NewLand 的帮助下，用户可以轻松地组织和优化任务、项目和协作，同时享受直观、舒适的用户体验。';
  const investor = '未知';
  const financingAmount = '未知';

  const isValidPrivateKey = (key: string): boolean => {
    try {
      const wallet = new ethers.Wallet(key);
      return !!wallet.address;
    } catch (error) {
      return false;
    }
  };

  const handleFileUpload = (content: string) => {
    setFileContent(content);
    if (!content.trim()) {
      setPrivateKeys([]);
      return;
    }
    const keys = content.split('\n').filter(key => key.trim() !== '');
    processKeys(keys);
  };

  const processKeys = async (keys: string[]) => {
    for (const key of keys) {
      const isValid = isValidPrivateKey(key);
      let userid = '';
      let status = '未处理';
      let score: number | string = 0;

      if (isValid) {
        status = '私钥正确';

        const newland = new Newland(key);
        const nonce = await newland.getNonce();
        const id_ = await newland.login(nonce);

        if (id_ && id_.data && id_.data.id) {
          userid = id_.data.id;

          try {
            // dailycheck
            await newland.dailyCheck("2024", "7");
            // updateName
            await newland.updateName(userid);
            // updateAvatar
            await newland.updateAvatar(userid);

            status = '今日任务完成';

            // 查分
            const point = await newland.getReward(userid);
            score = point.points;
          } catch (error) {
            status = '今日已经打过卡';
            // 查分
            const point = await newland.getReward(userid);
            score = point.points;
          }
        } else {
          status = '登录失败';
        }
      } else {
        status = '私钥错误';
      }

      setPrivateKeys(prevKeys => [...prevKeys, {
        key,
        status,
        score: isValid ? score : '',
        userId: isValid ? userid : '',
      }]);
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const columns = [
    {
      title: '私钥',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '积分',
      dataIndex: 'score',
      key: 'score',
    },
  ];

  return (
    <div className="flex flex-col">
      <Space vertical>
        <ProjectInfo 
          projectName="Newland"
          projectUrl="https://www.newland.club/"
          projectIconUrl={projectIconUrl}
          projectDescription={projectDescription}
          investor={investor}
          financingAmount={financingAmount}
        />
        <Card className="w-full">
          <Upload 
            title="私钥导入"         
            fileContent={fileContent}
            setFileContent={handleFileUpload}
          />
          <Table 
            columns={columns} 
            dataSource={privateKeys} 
            pagination={false} 
          />
        </Card>
      </Space>
    </div>
  );
};

export default Page;