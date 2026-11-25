import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    lastPage: number;
    page: number;
    total: number;
  };
}

export function buildMeta(total: number, { limit = 10, page = 1 }: PaginationDto) {
  return { lastPage: Math.ceil(total / limit), page, total };
}
