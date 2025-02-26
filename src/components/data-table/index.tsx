import React from "react";
import "./styles.scss";
import { TableData, useTableData } from "../../hooks/use-table-data";

export const DataTable = ({
  refetchInterval,
}: {
  refetchInterval?: number;
}) => {
  const { data: tableData, error } = useTableData({ refetch: refetchInterval });

  if (error) {
    return <div className="data-table">Error loading data</div>;
  }

  if (!tableData) {
    return <div className="data-table">Loading...</div>;
  }

  return (
    <div className="data-table">
      <div className="row">
        <div className="table-cell heading">Name</div>
        <div className="table-cell heading">User Name</div>
        <div className="table-cell heading">Zip Code</div>
      </div>
      {tableData?.map((data: TableData) => (
        <div className="row" key={data.id}>
          <div className="table-cell">{data.name}</div>
          <div className="table-cell">{data.username}</div>
          <div className="table-cell">{data.address.zipcode}</div>
        </div>
      ))}
    </div>
  );
};
