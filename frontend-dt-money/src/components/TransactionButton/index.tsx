import Image from 'next/image'

export interface TransactionButtonProps {
  type: 'INCOME' | 'OUTCOME'
  isSelected: boolean
  onClick?: () => void
}

export function TransactionButton({ type, isSelected, onClick }: TransactionButtonProps) {
  const isIncome = type === 'INCOME'
  const icon = isIncome ? '/income.png' : '/outcome.png'
  const title = isIncome ? 'Entrada' : 'Saída'

  const bgColor = isSelected
    ? isIncome
      ? 'bg-income/10'
      : 'bg-outcome/10'
    : 'bg-white'

  return (
    <div
      className={`
        flex h-[56px] w-[236px] cursor-pointer flex-col
        rounded-md border-[1.5px] border-transaction-border ${bgColor}
      `}
      onClick={onClick}
    >
      <div className="flex flew-row items-center justify-center gap-1 px-8 py-4 align-middle">
        <Image 
          src={icon} 
          alt={title} 
          width={24} 
          height={24} 
        />
        <span className="text-base font-normal leading-4 text-title">
          {title}
        </span>
      </div>
    </div>
  )
}