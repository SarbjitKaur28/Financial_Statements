import React, { useState, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Home.css";

import { initialTableData, initialColumnDefs } from "../models/TableData";
import { calculateTotals, addNewRow, updateRowData } from "../utils/gridUtils";

const FinancialStatements: React.FC = () => {
  const [rowData, setRowData] = useState(initialTableData);
  const [columnDefs, setColumnDefs] = useState(initialColumnDefs);
  const [activeTab, setActiveTab] = useState("Profit & Loss");

  useEffect(() => {
    calculateTotals(rowData, setRowData);
  }, []);

  const handleAddNewRow = useCallback((id: number, type: string) => {
    setRowData((prevRowData) => addNewRow(prevRowData, id, type));
  }, []);

  const handleCellValueChanged = useCallback(
    (event: any) => {
      const updatedRowData = updateRowData(event, rowData);
      if (updatedRowData) {
        console.log(`${updatedRowData}`);
        calculateTotals(updatedRowData, setRowData);
        setRowData(updatedRowData);
      }
    },
    [rowData]
  );

  const handleAddNewColumn = useCallback(() => {
    setColumnDefs((prevDefs) => {
      const newIndex = prevDefs.length;
      const newColumnDef: ColDef = {
        headerName: `New Column ${newIndex}`,
        field: `newColumn${newIndex}`,
        width: 150,
        editable: true,
        cellClass: newIndex % 2 === 0 ? "gray-color" : "white-color",
      };
      return [...prevDefs, newColumnDef];
    });
  }, []);

  const firstColumnDefsWithRenderer = columnDefs.map((def, index) => {
    if (index === 0) {
      return {
        ...def,
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data.isOthers) {
            return (
              <div>
                {params.value}
                <span
                  className="custom-icon"
                  onClick={() =>
                    handleAddNewRow(params.data.id, params.data.type)
                  }
                >
                  <i
                    className="fas fa-circle fa-stack-1x"
                    style={{ color: "black" }}
                  ></i>
                  <i
                    className="fas fa-plus fa-xs fa-stack-1x fa-inverse"
                    style={{ cursor: "pointer" }}
                  ></i>
                </span>
              </div>
            );
          }
          return (
            <span
              style={params.data.isHeader ? { fontWeight: "bold" } : undefined}
            >
              {params.value}
            </span>
          );
        },
      };
    }
    return def;
  });

  return (
    <div style={{ marginLeft: "20px" }}>
      <h4 style={{ textAlign: "left" }}>Financial statements</h4>
      <div className="tabs-container">
        <div className="horizontal-tabs">
          <div
            className={`tab ${activeTab === "Profit & Loss" ? "active" : ""}`}
            onClick={() => setActiveTab("Profit & Loss")}
          >
            Profit & Loss
          </div>
          <div className="tab disabled">Balance Sheet</div>
          <div className="tab disabled">Cashflow</div>
          <div className="tab disabled">Ratio</div>
        </div>

        <div className="horizontal-tabs">
          <button
            className="button-margin-right  tab disabled"
            onClick={handleAddNewColumn}
          >
            Add Column
          </button>
          <button className="button-margin-right tab disabled">
            Insert Comment
          </button>
          <button className="tab disabled">Update Columns</button>
        </div>
      </div>
      <div
        className="ag-theme-alpine"
        style={{
          height: "800px",
          width: "1030px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AgGridReact
          columnDefs={firstColumnDefsWithRenderer}
          rowData={rowData}
          onCellValueChanged={handleCellValueChanged}
          defaultColDef={{
            editable: true,
            sortable: true,
            resizable: true,
          }}
        />
      </div>
    </div>
  );
};

export default FinancialStatements;
