import { ColDef, ValueGetterParams } from "ag-grid-community";
import {
  calculateVariance,
  calculateVariancePercentage,
} from "../utils/gridUtils";

export interface TableData {
  id: number;
  million: string;
  2021: string;
  2022: string;
  2024: string;
  type: string;
  isHeader?: boolean;
  isOthers?: boolean;
  isTotal?: boolean;
  variance?: string;
  variancePercentage?: string;
}

export const initialTableData: TableData[] = [
  {
    id: 1,
    million: "Accounting standard",
    2021: "IFRS",
    2022: "IFRS",
    2024: "IFRS",
    type: "Info",
  },
  {
    id: 2,
    million: "Audit method",
    2021: "IFRS16 Adj",
    2022: "IFRS16 Adj",
    2024: "IFRS16 Adj",
    type: "Info",
  },
  {
    id: 3,
    million: "Display currency",
    2021: "HKD",
    2022: "HKD",
    2024: "HKD",
    type: "Info",
  },
  {
    id: 4,
    million: "FX rate",
    2021: "0.12826",
    2022: "0.12826",
    2024: "0.12826",
    type: "Info",
  },
  {
    id: 5,
    million: "Revenue",
    2021: "",
    2022: "",
    2024: "",
    isHeader: true,
    type: "Header",
  },
  {
    id: 6,
    million: "Passenger",
    2021: "4,357.00",
    2022: "14,333.00",
    2024: "15,213.00",
    type: "Revenue",
  },
  {
    id: 7,
    million: "Cargo",
    2021: "35,814.00",
    2022: "30,554.00",
    2024: "29,312.00",
    type: "Revenue",
  },
  {
    id: 8,
    million: "Others",
    2021: "",
    2022: "",
    2024: "",
    isOthers: true,
    type: "Revenue",
  },
  {
    id: 9,
    million: "Catering, recoveries and...",
    2021: "5,416.00",
    2022: "6,149.00",
    2024: "5,236.00",
    type: "Revenue",
  },
  {
    id: 10,
    million: "",
    2021: "",
    2022: "",
    2024: "",
    isTotal: true,
    type: "TotalRevenue",
  },
  {
    id: 11,
    million: "Operating expense",
    2021: "",
    2022: "",
    2024: "",
    isHeader: true,
    type: "Header",
  },
  {
    id: 12,
    million: "Fuel",
    2021: "4,357.00",
    2022: "14,333.00",
    2024: "",
    type: "Expense",
  },
  {
    id: 13,
    million: "Labour",
    2021: "35,814.00",
    2022: "30,554.00",
    2024: "",
    type: "Expense",
  },
  {
    id: 14,
    million: "Landing fees and route charges",
    2021: "35,814.00",
    2022: "30,554.00",
    2024: "",
    type: "Expense",
  },
  {
    id: 15,
    million: "Maintenance, materials and...",
    2021: "35,814.00",
    2022: "30,554.00",
    2024: "",
    type: "Expense",
  },
  {
    id: 16,
    million: "Others",
    2021: "",
    2022: "",
    2024: "",
    isOthers: true,
    type: "Expense",
  },
  {
    id: 17,
    million: "Inflight and passenger...",
    2021: "5,416.00",
    2022: "6,149.00",
    2024: "",
    type: "Expense",
  },
  {
    id: 18,
    million: "Restructuring costs",
    2021: "385.00",
    2022: "",
    2024: "",
    type: "Expense",
  },
  {
    id: 19,
    million: "",
    2021: "",
    2022: "",
    2024: "",
    isTotal: true,
    type: "TotalExpense",
  },
];

export const initialColumnDefs: ColDef[] = [
  {
    headerName: "(million)",
    field: "million",
    width: 250,
    cellClass: (params) =>
      params.data.isHeader ? "header-cell left-aligned-cell" : "gray-color left-aligned-cell",
  },
  {
    headerName: "31-12-2021",
    field: "2021",
    width: 150,
    cellClass: (params) => (params.data.isTotal ? "total-cell right-aligned-cell" : "right-aligned-cell"),
  },
  {
    headerName: "31-12-2022",
    field: "2022",
    width: 150,
    cellClass: (params) =>
      params.data.isTotal ? "total-cell gray-color right-aligned-cell" : "gray-color right-aligned-cell",
  },
  {
    headerName: "31-12-2024",
    field: "2024",
    width: 150,
    editable: true,
    cellClass: (params) => (params.data.isTotal ? "total-cell right-aligned-cell" : "right-aligned-cell"),
  },
  {
    headerName: "Variance",
    field: "variance",
    width: 150,
    editable: false,
    valueGetter: (params: ValueGetterParams) => {
      if (params.data.type === "Revenue") {
        const val2022 = parseFloat(
          params.data["2022"].replace(/,/g, "") || "0"
        );
        const val2024 = parseFloat(
          params.data["2024"].replace(/,/g, "") || "0"
        );
        if (val2022 === 0) return "";
        return calculateVariance(val2022, val2024);
      }
      return "";
    },
    cellClass: (params) =>
      parseFloat(params.value) < 0 ? "negative-variance right-aligned-cell" : "positive-variance right-aligned-cell",
  },
  {
    headerName: "Variance %",
    field: "variancePercentage",
    width: 150,
    editable: false,
    valueGetter: (params: ValueGetterParams) => {
      if (params.data.type === "Revenue" && params.data.million !== "Others") {
        if (params.data.type === "Revenue") {
          const val2022 = parseFloat(
            params.data["2022"].replace(/,/g, "") || "0"
          );
          const val2024 = parseFloat(
            params.data["2024"].replace(/,/g, "") || "0"
          );
          if (val2022 === 0) return "";
          return calculateVariancePercentage(val2022, val2024);
        }
      }
      return "";
    },
    cellClass: (params) =>
      parseFloat(params.value) < 0
        ? "negative-variance white-color right-aligned-cell"
        : "positive-variance white-color right-aligned-cell",
  },
];
