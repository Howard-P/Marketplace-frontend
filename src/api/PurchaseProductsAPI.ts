import ApiClient, { ApiResponse } from "./ApiCLient";

export async function purchaseProducts(
  productId: number
): Promise<ApiResponse> {
  return await ApiClient.post(
    "api/v1/ListingProducts/" + productId + "/purchase",
    null
  );
}
