import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AsyncLock from 'async-lock';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-prooduct-dto';
import { UpdateProductDto } from './dtos/update-product-dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
    private lock = new AsyncLock();
    private dateCounterMap = new Map<string, number>();

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    console.log("execution started")
    try {
      return this.lock.acquire('key', async () => {
        console.log("lock enter");
        const product = new Product();
        product.name = createProductDto.name;
        product.description = createProductDto.description;
        product.price = createProductDto.price;
        product.barcode = await this.generateBarcode();
        console.log("lock done");
        return await this.productRepository.save(product);
      }, () => {
        console.log("lock1 released");
      })
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async generateBarcode(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    let counter = this.dateCounterMap.get(dateKey) || 0;
    
    while (true) {
      const barcode = `${dateKey}-${counter.toString().padStart(3, '0')}`;
      const existingProduct = await this.productRepository.findOne({where: {barcode} });
      if (!existingProduct) {
        this.dateCounterMap.set(dateKey, counter + 1);
        return barcode;
      }
      counter++;
    }
  }

  async getProducts():Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProductById(id:number):Promise<Product>{
    const product = await this.productRepository.findOne({where:{id}});
    if(!product){
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  // async updateProduct(id:number, updateProductDto:UpdateProductDto){
  //   const product = await this.productRepository.findOne({where:{id}});
  //   if(!product){
  //     throw new Error(`Product ${id} not found`);
  //   }
  //   Object.assign(product, updateProductDto);
  //   return await this.productRepository.save(product);
  // }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const result = await this.productRepository.update({ id }, updateProductDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return await this.productRepository.findOne({ where: { id } });
  }
  

  async deleteProduct(id:number){
    const product = await this.productRepository.findOne({where:{id}});
    if(!product){
      throw new Error(`Product ${id} not found`);
    }
    return await this.productRepository.remove(product);
  }

}