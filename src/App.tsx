import React from 'react';
import PaymentPage from './components/PaymentPage';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '3695d7fcfbb4b9476d60950029acdeea'

// 2. Set chains
const mumbai = {
  chainId: 80001,
  name: 'Polygon Mumbai',
  currency: 'MATIC',
  explorerUrl: 'https://explorer-mumbai.maticvigil.com',
  rpcUrl: 'https://rpc-mumbai.maticvigil.com'
};
// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mumbai],
  projectId
})


const App: React.FC = () => {
  return (
    <div>
      {/* <WalletConnectLayout> */}
        <PaymentPage />
      {/* </WalletConnectLayout> */}
    </div>
  );
};

export default App;