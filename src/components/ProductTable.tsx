import React, { Fragment, useEffect } from "react";
import "../styles/ProductTable.css";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import ReactModal from "react-modal";
import { ListingProduct } from "../dataModelsTypes/ListingProduct";
import { useAppSelector } from "../app/hooks";
import { selectAccessToken } from "../features/user/userSlice";
import { getListingProducts } from "../api/getListingProductsAPI";
import { purchaseProducts } from "../api/PurchaseProductsAPI";
import ProductTableFilter from "./ProductTableFilter";
import ProductTablePagination from "./ProductTablePagination";

function ProductTable() {
  const accessToken = useAppSelector(selectAccessToken);

  const columns = React.useMemo<ColumnDef<ListingProduct>[]>(
    () => [
      {
        accessorKey: "ProductName",
        header: () => "Product Name",
        enableSorting: false,
      },
      {
        id: "category",
        header: () => "Category",
        enableSorting: false,
      },
      {
        id: "price",
        header: () => "Price",
        sortUndefined: "last", //force undefined values to the end
        sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
        enableColumnFilter: false,
      },
      {
        id: "seller.displayName",
        header: () => "Seller",
        enableSorting: false,
      },
    ],
    []
  );

  ReactModal.setAppElement("#root");
  const [data, setData] = React.useState<ListingProduct[]>([]);

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  async function fetchListingProducts() {
    const response = await getListingProducts();
    setData(response.data);
  }

  useEffect(() => {
    if (accessToken != null) {
      fetchListingProducts();
    }
  }, [accessToken]);

  const table = useReactTable({
    data,
    columns,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
      columnFilters,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  function buyProduct(productId: number) {
    console.log(productId);
    purchaseProducts(productId)
      .then(fetchListingProducts)
      .finally(() => setProcessing(false));
    setIsOpen(!open);
    setProcessing(true);
  }

  const renderSubComponent = ({ row }: { row: Row<ListingProduct> }) => {
    return (
      <div
        className={"productDetails " + (row.getIsExpanded() ? "tb-expand" : "")}
      >
        <p>{row.original.description}</p>
        <div style={{ textAlign: "right" }}>
          <button onClick={() => setIsOpen(!open)} className="buyBtn">
            Buy Now
          </button>
          <ReactModal
            isOpen={modalIsOpen}
            contentLabel="Confirm"
            className="modal"
          >
            <p style={{ color: "white" }}>
              Confirm to buy "{row.original.productName}"?
            </p>
            <button onClick={() => buyProduct(row.original.id)}>Confirm</button>
            <button onClick={() => setIsOpen(!open)}>Cancel</button>
          </ReactModal>
          <ReactModal
            isOpen={processing}
            contentLabel="Processing"
            className="modal"
          >
            <p style={{ color: "white" }}>
              Process your purchase order, please wait...
            </p>
          </ReactModal>
        </div>
      </div>
    );
  };

  return (
    <div className="main">
      {accessToken ? (
        <>
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                            {header.column.getCanFilter() ? (
                              <div>
                                <ProductTableFilter
                                  column={header.column}
                                  table={table}
                                />
                              </div>
                            ) : null}
                          </>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Fragment key={row.id}>
                    <tr
                      onClick={row.getToggleExpandedHandler()}
                      className="cursor-pointer tr-hover"
                    >
                      {/* first row is a normal row */}
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {row.getIsExpanded() && (
                      <tr>
                        {/* 2nd row is a custom 1 cell row */}
                        <td colSpan={row.getVisibleCells().length}>
                          {renderSubComponent({ row })}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          <ProductTablePagination table={table} />
          <div>
            Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
            {table.getRowCount().toLocaleString()} Rows
          </div>
          <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
        </>
      ) : (
        <>
          <h1>Please Login In First. this is product table page</h1>
        </>
      )}
    </div>
  );
}

export default ProductTable;
