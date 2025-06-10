// src/filme/dto/update-filme.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // Mapped-types é geralmente instalado com o NestJS
import { CreateFilmeDto } from './create-filme.dto';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateFilmeDto extends PartialType(CreateFilmeDto) {
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string.' })
  titulo?: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  descricao?: string;

  @IsOptional()
  @IsString({ message: 'O gênero deve ser uma string.' })
  genero?: string;

  @IsOptional()
  @IsInt({ message: 'A classificação deve ser um número inteiro.' })
  @Min(0, { message: 'A classificação deve ser um número positivo.' })
  classificacao?: number;

  @IsOptional()
  @IsInt({ message: 'A duração deve ser um número inteiro (em minutos).' })
  @Min(1, { message: 'A duração mínima deve ser de 1 minuto.' })
  duracao?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Forneça uma data de estreia válida no formato YYYY-MM-DD.' })
  // @Transform(({ value }) => new Date(value)) // Se você precisar transformar para Date object
  dataEstreia?: string;
}