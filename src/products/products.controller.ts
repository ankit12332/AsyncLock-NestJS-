/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-prooduct-dto';
import { UpdateProductDto } from './dtos/update-product-dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

  @Post('/create-prooduct')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.createProduct(createProductDto);
  }

  @Get('/get-all-products')
  async findAll(): Promise<Product[]> {
    return this.productsService.getProducts();
  }

  @Get('/:id')
  async findOne(@Param('id') id:number): Promise<Product> {
    return await this.productsService.getProductById(id);
  }

  @Put('/:id')
  async update(@Param('id') id:number, @Body() updateProductDto: UpdateProductDto){
    return await this.productsService.updateProduct(id, updateProductDto);
  }
}
