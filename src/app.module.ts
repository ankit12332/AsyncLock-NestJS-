import { ProductsModule } from './products/products.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product } from './products/product.entity';

@Module({
  imports: [
        ProductsModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgress-instance.culd1172xzea.ap-south-1.rds.amazonaws.com',
      port: 5432,
      username: 'ankitpanda',
      password: '9658523363',
      database: 'CARPRICEAPI',
      entities: [Product],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
