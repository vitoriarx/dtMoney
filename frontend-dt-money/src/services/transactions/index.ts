import { ITransaction } from "@/types/transaction";
import { api } from "../api"
import { toast } from "react-toastify";

// Interface para parâmetros de paginação
export interface PaginationParams {
    page?: number;
    limit?: number;
}

// Interface para resposta paginada
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export async function getTransactions(params?: PaginationParams): Promise<PaginatedResponse<ITransaction>> {
    try {
        const searchParams = new URLSearchParams();
        
        if (params?.page) {
            searchParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            searchParams.append('limit', params.limit.toString());
        }
        
        const response = await api.get(`/transaction?${searchParams.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error("Erro ao buscar transações: " + error);
    }
}

export async function createTransaction(transaction: ITransaction) {
    try {
        const response = await api.post('/transaction', transaction);
        toast.success("Transação adicionada com sucesso!")
        return response.data;
    } catch (error) {
        throw new Error("Erro ao criar transação: " + error);
    }
}

export async function updateTransaction(id: string, transaction: Partial<ITransaction>) {
    try {
        const response = await api.put(`/transaction/${id}`, transaction);
        toast.success("Transação atualizada com sucesso!")
        return response.data;
    } catch (error) {
        throw new Error("Erro ao atualizar transação: " + error);
    }
}

export async function deleteTransaction(id: string) {
    try {
        const response = await api.delete(`/transaction/${id}`);
        toast.success("Transação excluída com sucesso!")
        return response.data;
    } catch (error) {
        throw new Error("Erro ao excluir transação: " + error);
    }
}

export async function getTransactionById(id: string): Promise<ITransaction> {
    try {
        const response = await api.get(`/transaction/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Erro ao buscar transação: " + error);
    }
}