'use client'

import { ITransaction } from '@/types/transaction'
import { formatCurrency, formatDate } from '@/utils'
import { useState } from 'react'
import { ConfirmModal } from '@/components/ConfirmModal'
import { EditTransactionModal } from '@/components/EditTransactionModal'
import { useTransaction } from '@/hooks/transactions'

export interface ITableProps {
  data: ITransaction[]
}

export function Table({ data }: ITableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null)

  const deleteMutation = useTransaction.Delete()

  const handleDeleteClick = (transaction: ITransaction) => {
    setSelectedTransaction(transaction)
    setDeleteModalOpen(true)
  }

  const handleEditClick = (transaction: ITransaction) => {
    setSelectedTransaction(transaction)
    setEditModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedTransaction?.id) {
      try {
        await deleteMutation.mutateAsync(selectedTransaction.id)
        setDeleteModalOpen(false)
        setSelectedTransaction(null)
      } catch (error) {
        console.error('Erro ao excluir transação:', error)
      }
    }
  }

  const handleCloseModals = () => {
    setDeleteModalOpen(false)
    setEditModalOpen(false)
    setSelectedTransaction(null)
  }

  return (
    <>
      <table className="w-full mt-20 border-0 border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="px-4 text-left text-table-header text-base font-medium">Título</th>
            <th className="px-4 text-left text-table-header text-base font-medium">Preço</th>
            <th className="px-4 text-left text-table-header text-base font-medium">Categoria</th>
            <th className="px-4 text-left text-table-header text-base font-medium">Data</th>
            <th className="px-4 text-left text-table-header text-base font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction, index) => (
            <tr key={index} className="bg-white h-20 rounded-lg">
              <td className="px-4 py-4 whitespace-nowrap text-title">{transaction.title}</td>
              <td
                className={`px-4 py-4 whitespace-nowrap text-right ${
                  transaction.type === 'INCOME' ? 'text-income' : 'text-outcome'
                }`}
              >
                {formatCurrency(transaction.price)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-table">{transaction.category}</td>
              <td className="px-4 py-4 whitespace-nowrap text-table">
                {transaction.data ? formatDate(new Date(transaction.data)) : ''}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(transaction)}
                    className="text-indigo-900 hover:text-indigo-900 text-sm font-medium"
                    title="Editar transação"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(transaction)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                    title="Excluir transação"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        title="Excluir Transação"
        description={`Tem certeza que deseja excluir a transação "${selectedTransaction?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      <EditTransactionModal
        isOpen={editModalOpen}
        onClose={handleCloseModals}
        transaction={selectedTransaction}
      />
    </>
  )
}