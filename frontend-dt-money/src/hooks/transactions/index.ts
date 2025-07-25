import { 
    createTransaction, 
    getTransactions, 
    updateTransaction, 
    deleteTransaction, 
    getTransactionById,
    PaginationParams 
} from "@/services/transactions"
import { ITransaction } from "@/types/transaction"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const QUERY_KEY = 'qkTransaction'

const Create = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        }
    })
}

const Update = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, transaction }: { id: string; transaction: Partial<ITransaction> }) =>
            updateTransaction(id, transaction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        }
    })
}

const Delete = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        }
    })
}

const ListAll = (params?: PaginationParams) => {
    return useQuery({ 
        queryKey: [QUERY_KEY, params], 
        queryFn: () => getTransactions(params)
    })
}

const GetById = (id: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: () => getTransactionById(id),
        enabled: enabled && !!id
    })
}

export const useTransaction = {
    Create,
    Update,
    Delete,
    ListAll,
    GetById,
}

