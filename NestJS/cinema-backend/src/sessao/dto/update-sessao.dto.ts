// src/sessao/dto/update-sessao.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSessaoDto } from './create-sessao.dto';
import {
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class UpdateSessaoDto extends PartialType(CreateSessaoDto) {
  @IsOptional()
  @IsInt({ message: 'O ID do filme deve ser um número inteiro.' })
  @Min(1, { message: 'O ID do filme deve ser um número positivo.' })
  filmeId?: number;

  @IsOptional()
  @IsInt({ message: 'O ID da sala deve ser um número inteiro.' })
  @Min(1, { message: 'O ID da sala deve ser um número positivo.' })
  salaId?: number;

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'Forneça uma data e hora válidas para a sessão (ex: 2025-06-04T19:00:00).',
    },
  )
  dataHora?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @Min(0.01, { message: 'O preço deve ser maior que zero.' })
  preco?: number;

  @IsOptional()
  @IsString({ message: 'O idioma deve ser uma string.' })
  idioma?: string;

  @IsOptional()
  @IsString({ message: 'O formato deve ser uma string.' })
  formato?: string;
}