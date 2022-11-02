import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    const products = await this.productsService.getProducts();
    return products;
  }

  @Get(':id')
  getProduct(@Param('id') prodId: string) {
    return this.productsService.getSingleProduct(prodId);
  }

  @Post()
  async addProduct(
    @Body('title') prodTitle: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ) {
    const result = await this.productsService.insertProduct(
      prodTitle,
      description,
      price,
    );
    if (!result.id) {
      throw new NotFoundException('Could not Add product');
    }
    return result;
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ) {
    const response = await this.productsService.updateProduct(
      prodId,
      prodTitle,
      description,
      price,
    );
    return response;
  }
  @Delete(':id')
  async deleteProduct(@Param('id') prodId: string) {
    const count = await this.productsService.deleteProduct(prodId);
    return count;
  }
}
