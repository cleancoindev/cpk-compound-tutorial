import CPK, { Web3Adapter } from 'contract-proxy-kit'
import React, { useEffect } from 'react'
import SafeLogo from 'src/assets/icons/safe-logo.svg'
import CompoundForm from 'src/components/CompoundForm'
import ConnectButton from 'src/components/ConnectButton'
import WalletInfo from 'src/components/WalletInfo'
import styled from 'styled-components'
import Web3 from 'web3'

const SAppContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 100vw;
`

const SHeading = styled.h1`
  @media screen and (max-width: 768px) {
    font-size: 1.2em;
  }
`

interface IWalletState {
  account: string | undefined
  networkId: number | undefined
}

const initialWalletState = {
  account: undefined,
  networkId: undefined
}

const App: React.FC = () => {
  const [web3, setWeb3] = React.useState<Web3 | undefined>(undefined)
  const [proxyKit, setProxyKit] = React.useState<CPK | undefined>(undefined)
  const [walletState, updateWalletState] = React.useState<IWalletState>(
    initialWalletState
  )

  const onWeb3Connect = (provider: any) => {
    if (provider) {
      setWeb3(new Web3(provider))
    }
  }

  useEffect(() => {
    const fetchWalletData = async () => {
      if (web3) {
        const [accounts, networkId] = await Promise.all([
          web3.eth.getAccounts(),
          web3.eth.net.getId()
        ])

        const ethLibAdapter = new Web3Adapter({ web3 })
        const cpk = await CPK.create({ ethLibAdapter })
        setProxyKit(cpk)

        updateWalletState({
          account: accounts[0],
          networkId
        })
      }
    }

    fetchWalletData()
  }, [updateWalletState, web3])

  return (
    <SAppContainer>
      <img src={SafeLogo} alt="Gnosis Safe Logo" width="100"></img>
      <SHeading>Safe Contract Proxy Kit Compound Tutorial</SHeading>
      {walletState.account && proxyKit ? (
        <div>
          <WalletInfo address={walletState.account!} />
          <CompoundForm
            web3={web3}
            cpk={proxyKit!}
            address={walletState.account!}
          />
        </div>
      ) : (
        <>
          <p>Start by connecting your wallet using button below.</p>
          <ConnectButton onConnect={onWeb3Connect} />
        </>
      )}
    </SAppContainer>
  )
}

export default App
