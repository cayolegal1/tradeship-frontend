import { useEffect, useState } from "react";
import axios, { type AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";

import Balance from "./components/balance";
import Head from "./components/head";
import Info from "./components/info";
import Table from "./components/table";
import DepositFunds from "./components/deposit-funds";
import WithdrawFunds from "./components/withdraw-funds";
import styles from "./wallet.module.scss";
import { Modal } from "../../components/modal/modal";
import { SERVER_URL } from "../../config";
import type { ModalState, WalletAccount, WalletTransaction } from "@/types";

interface WalletResponse {
  results: WalletAccount[];
}

interface ApiErrorResponse {
  message?: string;
}

export default function Wallet() {
  const [modal, setModal] = useState<ModalState>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [walletData, setWalletData] = useState<WalletAccount[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const handleError = (error: AxiosError<ApiErrorResponse>) => {
    console.error("Error fetching wallet data:", error);
  };

  const getWalletData = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await axios.get<WalletResponse>(
        `${SERVER_URL}/api/payment/wallet/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const results = response.data.results ?? [];
      setWalletData(results);
      const history = results.flatMap(
        (wallet) => wallet.historyTransactions ?? []
      );
      setTransactions(history);
      setIsLoaded(true);
    } catch (error) {
      handleError(error as AxiosError<ApiErrorResponse>);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      void getWalletData();
    }
  }, [isLoaded]);

  return (
    <>
      <section className={styles["wallet"]}>
        <div className="auto__container">
          <div className={styles["wallet__inner"]}>
            <Head />
            <Balance setModal={setModal} balance={walletData} />
            <Info balance={walletData} />
            <Table transactions={transactions} />
          </div>
        </div>
      </section>
      <AnimatePresence>
        {modal === "deposit" && (
          <Modal
            title="Deposit Funds"
            text="Add money to your TradeShip wallet"
            setModal={setModal}
          >
            <DepositFunds setModal={setModal} />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modal === "withdraw" && (
          <Modal
            title="Withdraw Funds"
            text="Transfer money from your TradeShip wallet"
            setModal={setModal}
          >
            <WithdrawFunds setModal={setModal} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
