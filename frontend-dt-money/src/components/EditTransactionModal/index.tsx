'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ITransaction } from '@/types/transaction'
import { useTransaction } from '@/hooks/transactions'
import { useEffect } from 'react'

interface EditTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: ITransaction | null
}

const schema = yup.object({
    title: yup.string().required('Título é obrigatório'),
    price: yup.number().positive('Preço deve ser positivo').required('Preço é obrigatório'),
    category: yup.string().required('Categoria é obrigatória'),
    type: yup.string().oneOf(['INCOME', 'OUTCOME']).required('Tipo é obrigatório'),
    data: yup.date().required('Data é obrigatória')
})

type FormData = yup.InferType<typeof schema>

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
    const updateMutation = useTransaction.Update()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<FormData>({
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        if (transaction && isOpen) {
            setValue('title', transaction.title)
            setValue('price', transaction.price)
            setValue('category', transaction.category)
            setValue('type', transaction.type)
            setValue('data', new Date(transaction.data))
        }
    }, [transaction, isOpen, setValue])

    const onSubmit = async (data: FormData) => {
        if (!transaction?.id) return

        try {
            await updateMutation.mutateAsync({
                id: transaction.id,
                transaction: data
            })
            onClose()
            reset()
        } catch (error) {
            console.error('Erro ao atualizar transação:', error)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    if (!isOpen || !transaction) return null

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={handleClose}
            ></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4" id="modal-title">
                                            Editar Transação
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Título
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('title')}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                                {errors.title && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Preço
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register('price')}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                                {errors.price && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Categoria
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('category')}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                                {errors.category && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Tipo
                                                </label>
                                                <select
                                                    {...register('type')}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                >
                                                    <option value="INCOME">Receita</option>
                                                    <option value="OUTCOME">Despesa</option>
                                                </select>
                                                {errors.type && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Data
                                                </label>
                                                <input
                                                    type="date"
                                                    {...register('data')}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                                {errors.data && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:w-auto disabled:opacity-50"
                                >
                                    {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={handleClose}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
