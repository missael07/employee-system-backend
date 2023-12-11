import { IsNumber, IsString } from "class-validator";

export class FilterConfigDto {
    @IsNumber()
    pageIndex: number;
    
    @IsNumber()
    pageSize: number;
    
    @IsString()
    sortBy: string;
    
    @IsString()
    sortDirection: 'asc' | 'desc';
    
    @IsString()
    filterBy: string;
}