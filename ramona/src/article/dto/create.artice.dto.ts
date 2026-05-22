import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    content: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsOptional()
    featuredImageUrl: string;

    @IsString()
    @IsNotEmpty()
    author: string;
}