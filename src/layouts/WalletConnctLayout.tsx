import {
    ReactNode
  } from "react";
//   import PairingModal from "../features/BuyBonuses/components/modals/PairingModal";
  import styled from "styled-components";

  
//   export const SConnectButton = styled(Button as any)`
//     position: absolute;
//     right: 8px;
//     top: 8px;
//     z-index: 10000;
//   `;
  
  const WalletConnectLayoutWrapper = styled.div`
    position: relative;
  
  `;
  
  export function WalletConnectLayout({
    children,
  }: {
    children: ReactNode | ReactNode[];
  }) {

    return (
      <WalletConnectLayoutWrapper>
        {/* {connectedAddress ? <SConnectButton size={ButtonSize.S} onClick={() => {console.log('address Clicked')
        disconnect().then(() => {
          localStorage.clear()
          setConnectedAddress('');
          window.location.reload();
        });
        
        // window.location.reload();
      }}>
          {truncateMiddle(connectedAddress, 22)}
        </SConnectButton> :
          <SConnectButton size={ButtonSize.S} left onClick={onConnect}>
            Connect Wallet
          </SConnectButton>} */}
        {children}
      </WalletConnectLayoutWrapper>
    );
  }
  
// export const p =15;