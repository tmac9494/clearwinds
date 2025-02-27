import React from "react";
import "./styles.scss";
import { useTableData } from "../../hooks/use-table-data";
import {
  ActionTypes,
  useWidgetContextDispatch,
} from "../../hooks/use-widget-context";
import { TableData, WidgetContainerProps } from "../../utils/types";

export const DataTable = ({
  refetchInterval,
  widget,
}: {
  refetchInterval?: number;
  widget: WidgetContainerProps;
}) => {
  const dispatch = useWidgetContextDispatch();

  const { data: tableData, error } = useTableData({
    refetch: refetchInterval,
    refresh: widget?.refresh,
    onRefresh: () => {
      dispatch({ type: ActionTypes.RESET_REFRESH, payload: widget.id });
    },
  });

  if (error) {
    return (
      <div className="data-table" data-testid="data-table-widget">
        Error loading data
      </div>
    );
  }

  if (!tableData) {
    return (
      <div className="data-table" data-testid="data-table-widget">
        Loading...
      </div>
    );
  }

  return (
    <div className="data-table" data-testid="data-table-widget">
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
