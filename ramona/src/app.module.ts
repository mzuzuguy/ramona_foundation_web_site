import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { ImageService } from './image/image.service';
import { ImageModule } from './image/image.module';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';
import { GalleryService } from './gallery/gallery.service';
import { GalleryModule } from './gallery/gallery.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [ArticleModule, ImageModule, RoleModule, GalleryModule, UserModule],
  controllers: [AppController, RoleController, UserController],
  providers: [AppService, ImageService, GalleryService],
})
export class AppModule {}
