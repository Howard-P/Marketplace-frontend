import React, { Fragment, useEffect } from "react";
import "../../styles/ProductTable.css";

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
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import ReactModal from "react-modal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { Product } from "../../dataModelsTypes/Product";
import { selectAccessToken, selectIdTokenClaims } from "../user/userSlice";
import UserInventoryFilter from "./UserInventoryFilter";
import UserInventoryPagination from "./UserInventoryPagination";
import {
  fetchInventory,
  LoadingStatus,
  refreshData,
  selectInventoryProducts,
} from "./userInventorySlice";
import ListingProductForm from "./ListingProductForm";

function UserInventory() {
  const accessToken = useAppSelector(selectAccessToken);
  const dispatch = useAppDispatch();
  const idTokenClaim = useAppSelector(selectIdTokenClaims);
  const userInventoryProducts = useAppSelector(selectInventoryProducts);
  const userId = idTokenClaim?.sub;
  const inventoryStatus = useAppSelector((state) => state.userInventory.status);

  useEffect(() => {
    if (inventoryStatus === LoadingStatus.Idle && accessToken != null) {
      dispatch(fetchInventory(userId));
    }
  }, [inventoryStatus, dispatch, userId, accessToken]);

  const columns = React.useMemo<ColumnDef<Product>[]>(
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
    ],
    []
  );

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  ReactModal.setAppElement("#root");
  const [selectedProduct, setSelectedProduct] = React.useState<Product>();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  function openModal(product: Product) {
    setIsOpen(true);
    setSelectedProduct(product);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  const table = useReactTable<Product>({
    data: userInventoryProducts,
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

  return (
    <div className="main">
      <ReactModal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <ListingProductForm
          selectedProduct={selectedProduct}
          closeModal={closeModal}
        />
      </ReactModal>
      {accessToken ? (
        inventoryStatus == LoadingStatus.Loading ? (
          <>
            <h3>Loading...</h3>
          </>
        ) : (
          <>
            <div>{accessToken}</div>
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
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                              {header.column.getCanFilter() ? (
                                <div>
                                  <UserInventoryFilter
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
                        onClick={() => openModal(row.original)}
                        className="cursor-pointer tr-hover"
                      >
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
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
            <UserInventoryPagination table={table} />
            <div>
              Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
              {table.getRowCount().toLocaleString()} Rows
            </div>
            <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
            <button onClick={() => dispatch(refreshData())}>
              Refresh Data
            </button>
          </>
        )
      ) : (
        <>
          <h1>Please Login In First.</h1>
        </>
      )}
    </div>
  );
}

export default UserInventory;
