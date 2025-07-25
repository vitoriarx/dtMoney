"use client";
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { FormModal } from "@/components/FormModal";
import { Header } from "@/components/Header";
import { Table } from "@/components/Table";
import { Pagination } from "@/components/Pagination";
import { useTransaction } from "@/hooks/transactions";
import { ITotal, ITransaction } from "@/types/transaction";
import { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de itens por página

  const { data: paginatedData, isLoading } = useTransaction.ListAll({
    page: currentPage,
    limit: itemsPerPage
  });

  const { mutateAsync: addTransaction } = useTransaction.Create();
  
  const openModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddModal = (newTransaction: ITransaction) => {
    addTransaction(newTransaction);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  // Para os totais, vamos buscar todas as transações sem paginação
  // Em uma aplicação real, você poderia ter um endpoint separado para isso
  const { data: allTransactionsData } = useTransaction.ListAll();

  const totalTransactions: ITotal = useMemo(() => {
    const allTransactions = allTransactionsData?.data || [];
    
    if (!allTransactions || allTransactions.length === 0) {
      return { totalIncome: 0, totalOutcome: 0, total: 0 };
    }
  
    return allTransactions.reduce(
      (acc: ITotal, { type, price }: ITransaction) => {
        if (type === 'INCOME') {
          acc.totalIncome += price;
          acc.total += price;
        } else if (type === 'OUTCOME') {
          acc.totalOutcome += price;
          acc.total -= price;
        }
        return acc;
      },
      { totalIncome: 0, totalOutcome: 0, total: 0 }
    );
  }, [allTransactionsData]);

  if (isLoading) return <div>Loading...</div>;

  const transactions = paginatedData?.data || [];
  const pagination = paginatedData?.pagination;

  return (
    <div>
      <ToastContainer />
      <Header openModal={openModal} />
      <BodyContainer>
        <CardContainer totals={totalTransactions} />
        <Table data={transactions} />
        
        {/* Componente de Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            showingFrom={(pagination.page - 1) * pagination.limit + 1}
            showingTo={Math.min(pagination.page * pagination.limit, pagination.total)}
            totalItems={pagination.total}
          />
        )}
        
        { isModalOpen && <FormModal closeModal={handleCloseModal} formTitle="Adicionar Transação" addTransaction={handleAddModal} /> }
      </BodyContainer>
    </div>
  );
}
