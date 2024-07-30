import ApiClient, { ApiResponse } from "./ApiCLient";

export async function getListingProducts(): Promise<ApiResponse> {
  return await ApiClient.get("api/v1/ListingProducts");
}
