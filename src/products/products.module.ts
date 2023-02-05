import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [
        ProductsController,
],
    providers: [
        ProductsService,
],
})
export class ProductsModule {}
