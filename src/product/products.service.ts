import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price: price,
    });
    const r = await newProduct.save();
    return r;
  }

  async getProducts() {
    const products = await this.productModel.find().exec();
    return products.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }
  async getSingleProduct(pId: string) {
    const product = await this.findProduct(pId);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }
  async updateProduct(
    pId: string,
    title: string,
    description: string,
    price: number,
  ) {
    const updateProduct = await this.findProduct(pId);
    if (title) {
      updateProduct.title = title;
    }
    if (description) {
      updateProduct.description = description;
    }
    if (price) {
      updateProduct.price = price;
    }
    updateProduct.save();
    return updateProduct;
  }

  async deleteProduct(pId: string) {
    const result = await this.productModel.deleteOne({ _id: pId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find product.');
    } else {
      return result.deletedCount;
    }
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product');
    }
    if (!product) {
      throw new NotFoundException('Could not find product');
    }
    return product;
  }
}
