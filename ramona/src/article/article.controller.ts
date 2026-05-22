import { Controller, Get, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create.artice.dto';

@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService){}

    @Post()
    createArticle(@Body() createArticleDto: CreateArticleDto) {
        return this.articleService.createArticle(createArticleDto);
    }

    @Get()
    findAllArticles() {
        return this.articleService.findAllArticles();
    }

    @Get()
    findOneArticle(@Param('id', ParseIntPipe) id: number){//pipe validation
        return this.articleService.findOneArticle(id);
    }

    @Patch(':id')
    updateArticle(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: CreateArticleDto) {
        return this.articleService.updateArticle(id, updateArticleDto);
    }

    @Delete(':id')
    deleteArticle(@Param('id', ParseIntPipe) id: number) {
        return this.articleService.deleteArticle(id);
    }

}
