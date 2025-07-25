import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  PaginationParams,
  PaginatedResponse,
} from './interfaces/pagination.interface';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ category, data, price, title, type }: CreateTransactionDto) {
    try {
      const createdTransaction = await this.prisma.transaction.create({
        data: {
          title,
          category,
          data: new Date(data),
          price,
          type,
        },
      });
      return createdTransaction;
    } catch {
      throw new BadRequestException('Erro ao criar transação');
    }
  }

  async findAll(
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<any>> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    try {
      const [transactions, total] = await Promise.all([
        this.prisma.transaction.findMany({
          skip,
          take: limit,
          orderBy: { data: 'desc' },
        }),
        this.prisma.transaction.count(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch {
      throw new BadRequestException('Erro ao buscar transações');
    }
  }

  async findOne(id: string) {
    try {
      const foundTransaction = await this.prisma.transaction.findUnique({
        where: { id },
      });

      if (!foundTransaction) {
        throw new NotFoundException('Transação não encontrada');
      }

      return foundTransaction;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar transação');
    }
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    try {
      const foundTransaction = await this.findOne(id);

      if (!foundTransaction) {
        throw new NotFoundException(`Transaction with id ${id} not found`);
      }

      const updateData: Partial<UpdateTransactionDto> = {};
      if (updateTransactionDto.title) {
        updateData.title = updateTransactionDto.title;
      }
      if (updateTransactionDto.price) {
        updateData.price = updateTransactionDto.price;
      }
      if (updateTransactionDto.category) {
        updateData.category = updateTransactionDto.category;
      }
      if (updateTransactionDto.data) {
        updateData.data = new Date(updateTransactionDto.data);
      }
      if (updateTransactionDto.type) {
        updateData.type = updateTransactionDto.type;
      }

      const updatedTransaction = await this.prisma.transaction.update({
        where: { id },
        data: updateData,
      });
      return updatedTransaction;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar transação');
    }
  }

  async remove(id: string) {
    try {
      const foundTransaction = await this.findOne(id);

      if (!foundTransaction) {
        throw new NotFoundException(`Transaction with id ${id} not found`);
      }

      await this.prisma.transaction.delete({
        where: { id },
      });

      return { message: 'Transação excluída com sucesso' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir transação');
    }
  }
}
