'use client'
import { useEffect, useState } from 'react';
import { Button, Table, Select, Notification, Spin } from '@douyinfe/semi-ui';
import { IconCopyStroked, IconRedoStroked } from '@douyinfe/semi-icons';
import networks from '@/config/rpc.json';

interface Network {
  name: string;
  rpcs: string[];
}

interface Result {
  url: string;
  time: number | string;
}

const RpcTest: React.FC = () => {
  const [results, setResults] = useState<{ [key: string]: number | string }>({});
  const [selectedNetwork, setSelectedNetwork] = useState<string>(networks[0]?.name || '');

  useEffect(() => {
    if (selectedNetwork) {
      handleTest();
    }
  }, [selectedNetwork]);

  const testRpc = async (url: string): Promise<number | string> => {
    const start = performance.now();
    try {
      const res = await fetch(url, { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }) });
      if (res.status !== 200) {
        return "error";
      }
      const end = performance.now();
      return end - start;
    } catch (error) {
      return "error";
    }
  };

  const handleTest = async () => {
    if (!selectedNetwork) return;

    const network = networks.find((n: Network) => n.name === selectedNetwork);
    if (network) {
      const promises = network.rpcs.map((url: string) => testRpc(url).then(time => ({ url, time })));
      const resultsArray = await Promise.all(promises);

      const newResults = resultsArray.reduce((acc, result) => {
        acc[result.url] = result.time;
        return acc;
      }, {} as { [key: string]: number | string });

      setResults(newResults);
    }
  };

  const handleNetworkChange = (value: string | number | any[] | Record<string, any> | undefined) => {
    if (typeof value === 'string') {
      setSelectedNetwork(value);
      setResults({});
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    Notification.success({
      title: '复制',
      content: `RPC: ${url}`,
      duration: 2
    });
  };

  const columns = [
    { title: 'RPC', dataIndex: 'url', key: 'url' },
    { title: '响应时间 (ms)', dataIndex: 'time', key: 'time' },
    { title: '', key: 'actions', render: (text: any, record: Result) => (
        <Button size='small' icon={<IconCopyStroked />} theme='outline' type='secondary' onClick={() => copyToClipboard(record.url)}>复制</Button>
      )
    }
  ];

  const data = selectedNetwork
    ? networks
        .find((network: Network) => network.name === selectedNetwork)
        ?.rpcs.map((url: string) => ({
          network: selectedNetwork,
          url,
          time: results[url] !== undefined
            ? (results[url] !== "error" ? (results[url] as number).toFixed(2) : 'Error')
            : <Spin size="small" />,
        })) || []
    : [];

  return (
    <div className="px-80 py-10">
      <Select
        placeholder="请选择链"
        style={{ width: 400 }}
        value={selectedNetwork}
        onChange={handleNetworkChange}
        optionList={networks.map((network: Network) => ({ value: network.name, label: network.name }))}
      />
      <Button icon={<IconRedoStroked />} type='secondary' theme='solid' onClick={handleTest} disabled={!selectedNetwork} className="ml-4 ">
        重新测速
      </Button>
      <Table columns={columns} dataSource={data} pagination={false} className="mt-4" />
    </div>
  );
};

export default RpcTest;