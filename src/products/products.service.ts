import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AsyncLock from 'async-lock';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-prooduct-dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
    private lock = new AsyncLock();
    private counter = 0;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    console.log("execution started")
    try {
      return await this.lock.acquire('key', async () => {
        console.log("lock enter")        
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
    let counter = this.counter;

    
    while (true) {
      const barcode = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${counter.toString().padStart(3, '0')}`;
      const existingProduct = await this.productRepository.findOne({where: {barcode} });
      if (!existingProduct) {
        this.counter = counter;
        
        return barcode;
      }
      counter++;
    }
  }
  
}
