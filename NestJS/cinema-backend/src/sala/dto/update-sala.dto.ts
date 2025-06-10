// src/sala/dto/update-sala.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSalaDto } from './create-sala.dto';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateSalaDto extends PartialType(CreateSalaDto) {
  @IsOptional()
  @IsString({ message: 'O nome da sala deve ser uma string.' })
  @MaxLength(50, { message: 'O nome da sala não pode ter mais de 50 caracteres.' })
  nomeSala?: string;

  @IsOptional()
  @IsInt({ message: 'A capacidade deve ser um número inteiro.' })
  @Min(1, { message: 'A capacidade mínima da sala deve ser 1.' })
  capacidade?: number;

  @IsOptional()
  @IsString({ message: 'O tipo da sala deve ser uma string.' })
  @MaxLength(30, { message: 'O tipo da sala não pode ter mais de 30 caracteres.' })
  tipo?: string;
}