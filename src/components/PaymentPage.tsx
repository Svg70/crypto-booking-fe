/* eslint-disable */
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  useWeb3Modal,
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers";
import CryptoBookingAbi from "../contractsInfo/cryptoBookingAbi.json";
import ERC20Abi from "../contractsInfo/erc20Abi.json";
import CircleLoader from "./CircleLoader";

const PaymentContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const EventSelector = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`;

const EventDetails = styled.div`
  margin-bottom: 20px;
`;

const EventDescription = styled.p`
  font-size: 16px;
  margin: 8px 0;
`;

const PayButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 12px 15px;
  font-size: 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff0000;
  font-size: 16px;
  margin: 8px 0;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
  font-size: 18px;
`;

const StatusText = styled.span`
  margin-left: 10px;
`;

const ErrorText = styled.span`
  color: #e74c3c;
  margin-left: 10px;
`;

type Event = {
  title: string;
  expiredIn: Date;
  description?: string;
  price: number;
  declined: boolean;
  id?: string;
  creator: string;
  maxTickets: number;
  ticketsBooked: number;
  metainfo?: string;
};

enum ProcessStatus {
  BEFORE_PAYMENT = "BEFORE_PAYMENT",
  WAITING_ALLOWANCE = "WAITING_ALLOWANCE",
  LOADING_SUBMIT_ALLOWANCE = "LOADING_SUBMIT_ALLOWANCE",
  SUBMIT_ALLOWANCE_ERROR = "SUBMIT_ALLOWANCE_ERROR",
  WAITING_PAYMENT = "WAITING_PAYMENT",
  LOADING_SUBMIT_PAYMENT = "LOADING_SUBMIT_PAYMENT",
  SUBMIT_PAYMENT_ERROR = "SUBMIT_PAYMENT_ERROR",
  RESULT = "RESULT",
}

const PaymentPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [processStatus, setProcessStatus] = useState<ProcessStatus>(
    ProcessStatus.BEFORE_PAYMENT
  );

  const CREATOR_MOCKED_ID = ethers.encodeBytes32String("CreatorID_1");

  const mockedEvntsData: Event[] = [
    {
      id: ethers.encodeBytes32String("EventID_1"),
      expiredIn: new Date("2023-12-31T12:00:00"),
      declined: false,
      creator: CREATOR_MOCKED_ID,
      title: "Sample Event 1",
      maxTickets: 10,
      ticketsBooked: 2,
      price: 100000000,
      metainfo: 'metainfotest_1'
    },
    {
      id: ethers.encodeBytes32String("EventID_2"),
      expiredIn: new Date("2024-02-02T12:00:00"),
      declined: false,
      creator: CREATOR_MOCKED_ID,
      title: "Sample Event 2",
      maxTickets: 30,
      ticketsBooked: 0,
      price: 800000000,
      metainfo: 'metainfotest_2'
    },
    {
      id: ethers.encodeBytes32String("EventID_3"),
      expiredIn: new Date("2024-01-02T12:00:00"),
      declined: false,
      creator: CREATOR_MOCKED_ID,
      title: "Sample Event 3",
      maxTickets: 15,
      ticketsBooked: 0,
      price: 10000000,
      metainfo: 'metainfotest_3'
    },
    {
      id: ethers.encodeBytes32String("EventID_4"),
      expiredIn: new Date("2024-01-02T12:00:00"),
      declined: false,
      creator: CREATOR_MOCKED_ID,
      title: "Sample Event 4",
      maxTickets: 150,
      ticketsBooked: 0,
      price: 125000000,
      metainfo: 'metainfotest_4'
    },
    {
      id: ethers.encodeBytes32String("EventID_5"),
      expiredIn: new Date("2024-10-02T12:00:00"),
      declined: false,
      creator: CREATOR_MOCKED_ID,
      title: "Sample Event 5",
      maxTickets: 150,
      ticketsBooked: 0,
      price: 325000000,
      metainfo: 'metainfotest_5'
    },
    // {
    //   title: "Событие 1",
    //   expiredIn: new Date("2023-12-31T12:00:00"),
    //   description: "Описание события 1",
    //   usdtPrice: 100,
    //   declined: false,
    //   id: ethers.encodeBytes32String("EventID"),
    // },
    // {
    //   title: "Событие 2",
    //   expiredIn: new Date("2023-12-15T18:30:00"),
    //   description: "Описание события 2",
    //   usdtPrice: 8.0,
    //   declined: true,
    //   id: ethers.encodeBytes32String("EventID2"),
    // },
    // {
    //   title: "Событие 3",
    //   expiredIn: new Date("2023-11-30T08:45:00"),
    //   description: "Описание события 3",
    //   usdtPrice: 15.2,
    //   declined: false,
    //   id: ethers.encodeBytes32String("EventID3"),
    // },
    // {
    //   title: "Событие 4",
    //   expiredIn: new Date("2024-01-10T15:20:00"),
    //   description: "Описание события 4",
    //   usdtPrice: 12.7,
    //   declined: false,
    //   id: ethers.encodeBytes32String("EventID4"),
    // },
    // {
    //   title: "Событие 5",
    //   expiredIn: new Date("2023-12-05T21:00:00"),
    //   description: "Описание события 5",
    //   usdtPrice: 9.8,
    //   declined: true,
    //   id: ethers.encodeBytes32String("EventID5"),
    // },
  ];
  function dateToSeconds(dateString: Date) {
    const endDate = new Date(dateString);
    const startDate = new Date("1970-01-01T00:00:00");

    const seconds = (endDate.getTime() - startDate.getTime()) / 1000;

    return seconds;
  }

  useEffect(() => {
    // Set the first event as the default selected event
    setSelectedEvent(mockedEvntsData[0] || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once

  const users = [
    ethers.encodeBytes32String("UserId"),
    ethers.encodeBytes32String("UserId2"),
    ethers.encodeBytes32String("UserId3"),
    ethers.encodeBytes32String("UserId4"),
    ethers.encodeBytes32String("UserId5"),
    ethers.encodeBytes32String("UserId6"),
  ];

  const countArr = [1, 2, 3, 4, 5];

  const [selectedUser, setSelectedUser] = useState<string | null>(users[0]);

  // const {
  //   client,
  //   session,
  //   connect,
  //   accounts,
  // } = useWalletConnectClient();
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    console.log(address, "address");
  }, [address]);

  const [contract, setContract] = useState<ethers.Contract | null>(null);





  const [jsonContract, setJsonContract] = useState<ethers.Contract | null>(
    null
  );
  const [usdtToken, setUsdtToken] = useState<ethers.Contract | null>(null);

  // useEffect(() => {
  //   //init json Provider
  //   const initJsonRPCProv = async() => {
  //     const contractAddress = "0x1f825c9792BCB3E9dA2fC2CE34De89D4db789583";
  //     const provider2 = new ethers.JsonRpcProvider(
  //       process.env.REACT_APP_RPC_URL
  //     );

  //     console.log(provider2 , 'PROV')
  //     // const signer2 = await provider2.listAccounts();
  //     // console.log(signer2)
  //     // const contractInstance2 = new ethers.Contract(contractAddress, CryptoBookingAbi, signer2[0]);
  //     //   setJsonContract(contractInstance2)
  //   }

  //   initJsonRPCProv();
  // }, []);

  useEffect(() => {
    const initializeWalletConnect = async () => {
      if (!walletProvider) return;

      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contractAddress = "0x1f825c9792BCB3E9dA2fC2CE34De89D4db789583";
      const erc20Address = "0x872c1A3078125446C2FF979C28A15249A689AcAc";
      const contractInstance = new ethers.Contract(
        contractAddress,
        CryptoBookingAbi,
        signer
      );
      setContract(contractInstance);

      const usdtTokenInstance = new ethers.Contract(
        erc20Address,
        ERC20Abi,
        signer
      );
      setUsdtToken(usdtTokenInstance);



      // Connect to WalletConnect
      // await walletConnectProvider.enable();
    };

    initializeWalletConnect();
  }, [walletProvider]);

  async function onSignMessage() {
    if (!walletProvider || !usdtToken || !contract || !selectedEvent) {
      console.log(
        walletProvider,
        usdtToken,
        contract,
        selectedEvent,
        "not work"
      );
      open();
      return;
    }
    // const provider = new BrowserProvider(walletProvider)
    // const signer = await provider.getSigner();
    // signer.sendTransaction()
    // const signature = await signer?.signMessage('Hello Web3Modal Ethers')
    // console.log(signature)

    const allowanceAmount = selectedEvent?.price * selectedCount;

    console.log(allowanceAmount, selectedCount,'allowanceAmount');

    // Call the approve function on the USDT contract
    // console.log("CAAAAALLL", usdtToken, contract.target);
    setProcessStatus(ProcessStatus.WAITING_ALLOWANCE);

    let allowanceErr;
    try {
      const approveTx = await usdtToken.approve(
        contract.target,
        allowanceAmount
      );
      console.log("FIRST_STEP", approveTx);
      setProcessStatus(ProcessStatus.LOADING_SUBMIT_ALLOWANCE);

      await approveTx.wait();
      setProcessStatus(ProcessStatus.WAITING_PAYMENT);
    } catch (err) {
      console.log(err, "ERRRRRR_FIRST_STEP");
      allowanceErr = true;
      setProcessStatus(ProcessStatus.SUBMIT_ALLOWANCE_ERROR);
    }

    if (!allowanceErr) {
      // Call the payment function on the contract
      try {
        const paymentTx = await contract.payment(
          selectedCount,
          selectedEvent.id,
          selectedUser,
          address
        );
        setProcessStatus(ProcessStatus.LOADING_SUBMIT_PAYMENT);
        await paymentTx.wait();
        setProcessStatus(ProcessStatus.RESULT);
      } catch (err) {
        console.log(err, "ERRRRRR_SECOND_STEP");
        setProcessStatus(ProcessStatus.SUBMIT_PAYMENT_ERROR);
      }
    }
  }

  const { open } = useWeb3Modal();

  const [bookedEvents, setBookedEvents] = useState<number | undefined>();
  const [selectedCount, setSelectedCount] = useState(countArr[0]);
  const fetchBookedEvents = async () => {
    console.log(jsonContract, selectedUser, selectedEvent, "CONTRACT");

    if (!selectedUser || !selectedEvent) return;

    const contractAddress = "0x1f825c9792BCB3E9dA2fC2CE34De89D4db789583";
    const wsProvider = new ethers.WebSocketProvider(
      'wss://polygon-mumbai.g.alchemy.com/v2/uTq8cduZc3rBmXQFq_h0f_9mpaEMJ6xh'
    );

    const contract = new ethers.Contract(
      contractAddress,
      CryptoBookingAbi,
      wsProvider
    );

    console.log("FETCH_E", selectedEvent?.id, selectedUser);
    // setBookedEvents(0);
    const count = await contract.getBookings(
      selectedEvent?.id,
      selectedUser
    );

    console.log(count, "COUNT!!!");
    //@ts-ignore
    setBookedEvents(Number(count));
  };

  useEffect(() => {
    fetchBookedEvents();
  }, [selectedUser, selectedEvent]);


  const listenToEvent = async () => {
    try {
      const contractAddress = "0x1f825c9792BCB3E9dA2fC2CE34De89D4db789583";
      const wsProvider = new ethers.WebSocketProvider(
        'wss://polygon-mumbai.g.alchemy.com/v2/uTq8cduZc3rBmXQFq_h0f_9mpaEMJ6xh'
      );
  
      const contract = new ethers.Contract(
        contractAddress,
        CryptoBookingAbi,
        wsProvider
      );

      setJsonContract(contract);
      
      // listen to any event on the contract using event name
      contract.on('BookingCreated', (event) => {
        console.log("event is emmited", event);
        setTimeout(() => {
          console.log('FETCH_COUNT')
          fetchBookedEvents();
        }, 30000)
      });

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(jsonContract,' JSON_')
  }, [jsonContract])
 
  useEffect(() => {
    listenToEvent();
    

    // Clean up the event listener when the component unmounts
    return () => {
      const contractAddress = "0x1f825c9792BCB3E9dA2fC2CE34De89D4db789583";
      const wsProvider = new ethers.WebSocketProvider(
        'wss://polygon-mumbai.g.alchemy.com/v2/uTq8cduZc3rBmXQFq_h0f_9mpaEMJ6xh'
      );
  
  
      const contract = new ethers.Contract(
        contractAddress,
        CryptoBookingAbi,
        wsProvider
      );

      contract.removeAllListeners('BookingCreated');
    };
  }, []);

  useEffect(() => {
    if (
      processStatus === ProcessStatus.RESULT ||
      processStatus === ProcessStatus.SUBMIT_ALLOWANCE_ERROR ||
      processStatus === ProcessStatus.SUBMIT_PAYMENT_ERROR
    ) {
      setTimeout(() => {
        setProcessStatus(ProcessStatus.BEFORE_PAYMENT);
      }, 5000);
    }
  }, [processStatus])

  return (
    <PaymentContainer>
      <EventSelector
        value={selectedEvent?.title || ""}
        onChange={(e: any) => {
          const selectedTitle = e.target.value;
          const selectedEvent =
            mockedEvntsData.find((event) => event.title === selectedTitle) ||
            null;
          setSelectedEvent(selectedEvent);
        }}
      >
        {mockedEvntsData.map((event) => (
          <option key={event.title} value={event.title}>
            {event.title}
          </option>
        ))}
      </EventSelector>

      {selectedEvent && (
        <EventDetails>
          <EventDescription>
            <strong>Title:</strong> {selectedEvent.title}
          </EventDescription>
          <EventDescription>
            <strong>Expired In:</strong> {selectedEvent.expiredIn.toString()}
          </EventDescription>
          <EventDescription>
            <strong>Description:</strong> {selectedEvent.description}
          </EventDescription>
          <EventDescription>
            <strong>USDT Price:</strong> {selectedEvent.price / 10e5}
          </EventDescription>
        </EventDetails>
      )}

      <EventDescription>
        <strong>Tickets count:</strong>
      </EventDescription>
      <EventSelector
        //@ts-ignore
        value={selectedCount}
        onChange={(e: any) => {
          const selectedCount = e.target.value;

          setSelectedCount(selectedCount);
        }}
      >
        {countArr.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </EventSelector>
      {selectedEvent && selectedEvent.declined && (
        <ErrorMessage>The event is declined</ErrorMessage>
      )}

      {processStatus === ProcessStatus.BEFORE_PAYMENT && (
        <PayButton
          onClick={onSignMessage}
          disabled={!selectedEvent || selectedEvent.declined}
        >
          Pay Now
        </PayButton>
      )}
      {(processStatus === ProcessStatus.WAITING_ALLOWANCE ||
        processStatus === ProcessStatus.LOADING_SUBMIT_ALLOWANCE ||
        processStatus === ProcessStatus.WAITING_PAYMENT ||
        processStatus === ProcessStatus.LOADING_SUBMIT_PAYMENT ||
        processStatus === ProcessStatus.SUBMIT_ALLOWANCE_ERROR ||
        processStatus === ProcessStatus.SUBMIT_PAYMENT_ERROR ||
        processStatus === ProcessStatus.RESULT
        ) && (
        <Line>
          {processStatus === ProcessStatus.SUBMIT_ALLOWANCE_ERROR ||
          processStatus === ProcessStatus.SUBMIT_PAYMENT_ERROR ? (
            <ErrorText>Error:</ErrorText>
          ) : (
            <CircleLoader radius={30} thickness={4} />
          )}
          <StatusText>
            {processStatus === ProcessStatus.WAITING_ALLOWANCE &&
              "Need confirm allowance"}
            {processStatus === ProcessStatus.LOADING_SUBMIT_ALLOWANCE &&
              "Allowance in progress"}
            {processStatus === ProcessStatus.WAITING_PAYMENT &&
              "Need confirm payment"}
            {processStatus === ProcessStatus.LOADING_SUBMIT_PAYMENT &&
              "Payment tx in progress"}
            {processStatus === ProcessStatus.SUBMIT_ALLOWANCE_ERROR &&
              "Error submitting allowance"}
            {processStatus === ProcessStatus.SUBMIT_PAYMENT_ERROR &&
              "Error submitting payment"}

          </StatusText>
          {processStatus === ProcessStatus.RESULT &&
              "SUCCESS"}
        </Line>
      )}
      <EventDescription>
        <strong>UserId:</strong>
      </EventDescription>
      <EventSelector
        //@ts-ignore
        value={selectedUser}
        onChange={(e: any) => {
          const selectedUser = e.target.value;
          const selectedEvent =
            users.find((user) => user === selectedUser) || null;
          //@ts-ignore
          setSelectedUser(selectedEvent);
        }}
      >
        {users.map((user) => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </EventSelector>

      <EventDescription>
        <strong>bookedTickets:</strong>
        {bookedEvents}
      </EventDescription>

      {/* <button onClick={() => open()}>Open Connect Modal</button>
      <button onClick={() => open({ view: "Networks" })}>
        Open Network Modal
      </button> */}

      {/* {
        <>
          {ethers.encodeBytes32String("EventID")}

          <br />
          {dateToSeconds(mockedEvntsData[0].expiredIn)}
          <br />
          {ethers.encodeBytes32String("EventID2")}
          <br />
          {dateToSeconds(mockedEvntsData[1].expiredIn)}
          <br />
          {ethers.encodeBytes32String("EventID3")}
          <br />
          {dateToSeconds(mockedEvntsData[2].expiredIn)}
          <br />
          {ethers.encodeBytes32String("EventID4")}
          <br />
          {dateToSeconds(mockedEvntsData[3].expiredIn)}
          <br />
          {ethers.encodeBytes32String("EventID5")}
          <br />
          {dateToSeconds(mockedEvntsData[4].expiredIn)}
        </>
      } */}
    </PaymentContainer>
  );
};

export default PaymentPage;
