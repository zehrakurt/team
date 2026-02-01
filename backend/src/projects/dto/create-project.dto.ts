import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  userIds?: number[];
}