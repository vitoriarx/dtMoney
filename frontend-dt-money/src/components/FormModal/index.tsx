import { date, InferType, number, object, string } from "yup";
import { Input } from "../Form/Input";
import { TransactionSwitcher } from "../TransactionSwitcher";
import { ITransaction } from "@/types/transaction";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Validação do formulário
export interface IFormModalProps {
  formTitle: string;
  closeModal: () => void;
  addTransaction: (transaction: ITransaction) => void;
}

const transactionSchema = object({
  title: string()
    .required('O Título é obrigatório')
    .min(5, 'O Título deve ter pelo menos 5 caracteres'),
  type: string()
    .required('O Tipo é obrigatório')
    .oneOf(['INCOME', 'OUTCOME'], 'O Tipo deve ser "income" ou "outcome"'),
  category: string()
    .required('A Categoria é obrigatória'),
  price: number()
    .required('O Preço é obrigatório')
    .positive('O preço deve ser um número positivo')
    .min(0.01, 'O preço deve ser maior que zero'),
  data: date()
    .required('A Data é obrigatória')
    .default(() => new Date())
})

type ITransactionForm = InferType<typeof transactionSchema>

const transactionFormDefaultValues: ITransactionForm = {
  title: '',
  type: 'INCOME',
  category: '',
  price: 0,
  data: new Date()
}

type TransactionType = 'INCOME' | 'OUTCOME';


export function FormModal({ formTitle, closeModal, addTransaction }: IFormModalProps) {
  // Função para lidar com o envio do formulário

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors }
  } = useForm<ITransactionForm>({
    defaultValues: transactionFormDefaultValues,
    resolver: yupResolver(transactionSchema)
  })

  const handleSetType = (type: 'INCOME' | 'OUTCOME') => {
    setValue('type', type);
  }

  const type = watch('type', 'INCOME');

  const onSubmit = (data: ITransactionForm) => {
    addTransaction(data as ITransaction);
    closeModal();
  }

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Overlay de fundo */}
      <div className="fixed inset-0 bg-foreground bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      {/* Container principal do modal */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          {/* Caixa do modal */}
          <div className="relative transform overflow-hidden rounded-xl bg-modal text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            {/* Botão de fechamento "X" */}
            <button
              type="button"
              className="absolute top-4 right-4 text-table-text hover:text-foreground transition-colors duration-200"
              onClick={closeModal}
              aria-label="Fechar">
              <span className="text-3xl font-light leading-none">&times;</span> {/* Ícone 'x' maior e mais leve */}
            </button>

            {/* Cabeçalho do modal */}
            <div className="px-6 py-6 sm:px-8 sm:py-8"> {/* Ajuste de padding para um visual mais clean */}
              <div className="flex items-center">
                {/* Removido o flex sm:items-start se não for necessário para o título */}
                <div className="mt-0 text-center sm:text-left w-full"> {/* Centraliza texto em mobile, alinha à esquerda em sm */}
                  <h1 className="font-bold leading-tight text-title text-3xl" id="modal-title">{formTitle}</h1> {/* Título maior e mais impactante */}
                </div>
              </div>
            </div>

            {/* Formulário */}
            <form className="flex flex-col gap-4 px-6 pb-6 sm:px-8 sm:pb-8" onSubmit={handleSubmit(onSubmit)}>
              {/* Campos do formulário */}
              <Input type="text" placeholder="Título" {...register("title")} />
              {errors.title && <span className="text-outcome text-sm mt-1">{errors.title.message}</span>} {/* Erro com cor 'outcome' e tamanho menor */}

              <Input type="number" placeholder="Preço" {...register("price")} />
              {errors.price && <span className="text-outcome text-sm mt-1">{errors.price.message}</span>}

              {/* Ajuste para o TransactionSwitcher: Adicionar margem inferior se necessário */}
              <TransactionSwitcher setType={handleSetType} type={type as TransactionType} />
              {errors.type && <span className="text-outcome text-sm mt-1">{errors.type.message}</span>}

              <Input type="text" placeholder="Categoria" {...register("category")} />
              {errors.category && <span className="text-outcome text-sm mt-1">{errors.category.message}</span>}

              {/* Botão de Confirmação */}
              {/* Movido o div bg-modal e flex-row-reverse pois não são necessários para o botão final */}
              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-income text-white px-3 py-4 text-lg font-bold shadow-md hover:brightness-90 transition-all duration-200"
              >
                Confirmar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}