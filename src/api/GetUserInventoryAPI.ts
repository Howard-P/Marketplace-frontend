/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from "@faker-js/faker";
import { Product } from "../dataModelsTypes/Product";

const newProduct = (): Product => {
  return {
    id: faker.number.int(),
    productName: faker.commerce.productName(),
    category: faker.commerce.department(),
  };
};

export async function getUserInventory(
  _userId: string | undefined
): Promise<Array<Product>> {
  return new Promise<Product[]>((resolve) => {
    // Simulating an asynchronous operation
    // (e.g., fetching data)
    const arr: Product[] = [];
    for (let i = 0; i < 123; i++) {
      arr.push(newProduct());
    }

    setTimeout(() => {
      resolve(arr);
    }, 500);
  });
}

export async function addProductToUserInventory(
  _productId: number | undefined
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    // Simulating an asynchronous operation
    // (e.g., fetching data)
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}
