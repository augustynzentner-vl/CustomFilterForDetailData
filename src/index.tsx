"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";

import {
  ValidationModule,
  AllEnterpriseModule,
  ModuleRegistry,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  AllEnterpriseModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  // My custom filtering logic that should be used instead of default matcher
  const textMatcher = ({ value, filterText, data }) => {
    // Should be called but its not becase there is some default filter
    // that filters out empty(undefined) values first
    // before even calling matcher
    console.log("should call...", value, "---", filterText);

    return true; // should return booealn based on predicate that looks into node
  };

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      groupId: "group1",
      headerName: "Group 1",
      children: [
        {
          field: "group1.field1",
          headerName: "Main Property 1",
          cellDataType: "text",
          enableRowGroup: true,
          enableValue: true,
          filter: "agTextColumnFilter",
          // Filtering by this column will call text matcher as rows contain value directly for this path
          filterParams: { textMatcher },
        },
        {
          groupId: "group1.subgroup1",
          headerName: "Subgroup 1",
          suppressColumnsToolPanel: true,
          children: [
            {
              columnType: "SINGLE_VALUE",
              field: "group1.subgroup1.field1",
              headerName: "Detail Property 1",
              cellDataType: "text",
              enableRowGroup: true,
              enableValue: true,
              filter: "agTextColumnFilter",
              // Filtering by this column will NOT call text matcher as rows path wont be matched with existing value
              filterParams: { textMatcher },
              refData: null,
            },
          ],
        },
      ],
      columnType: "ARRAY",
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 200,
      floatingFilter: true,
    };
  }, []);

  const data = [
    {
      group1: {
        field1: "Group1 Value1",
        subgroup1: [
          {
            field1: "Subsubgroup1 Value1",
          },
        ],
      },
    },
    {
      group1: {
        field1: "Group1 Value2",
        subgroup1: [
          {
            field1: "Subsubgroup2 Value1",
          },
          {
            field1: "Subsubgroup2 Value1",
          },
        ],
      },
    },
  ];
  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          sideBar={{ toolPanels: ["columns", "filters"] }}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>
);
