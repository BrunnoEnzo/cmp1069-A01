// src/venda/dto/update-venda.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateVendaDto } from './create-venda.dto';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateVendaDto extends PartialType(CreateVendaDto) {
  @IsOptional()
  @IsInt({ message: 'O ID da sessão deve ser um número inteiro.' })
  @Min(1, { message: 'O ID da sessão deve ser um número positivo.' })
  sessaoId?: number;

  @IsOptional()
  @IsString({ message: 'O nome do cliente deve ser uma string.' })
  @MaxLength(100, { message: 'O nome do cliente não pode ter mais de 100 caracteres.' })
  nomeCliente?: string;

  @IsOptional()
  @IsString({ message: 'O CPF deve ser uma string.' })
  @MaxLength(14, { message: 'O CPF não pode ter mais de 14 caracteres.' })
  cpf?: string;

  @IsOptional()
  @IsString({ message: 'O assento deve ser uma string.' })
  @MaxLength(10, { message: 'O assento não pode ter mais de 10 caracteres.' })
  assento?: string;

  @IsOptional()
  @IsString({ message: 'O tipo de pagamento deve ser uma string.' })
  @MaxLength(30, { message: 'O tipo de pagamento não pode ter mais de 30 caracteres.' })
  tipoPagamento?: string;
}