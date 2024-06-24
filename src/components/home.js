import React, { useState, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './home.css';

const FinancialStatements = () => {
    const initialRowData = [
        { id: 1, million: 'Accounting standard', 2021: 'IFRS', 2022: 'IFRS', 2024: 'IFRS', type: 'Info' },
        { id: 2, million: 'Audit method', 2021: 'IFRS16 Adj', 2022: 'IFRS16 Adj', 2024: 'IFRS16 Adj', type: 'Info' },
        { id: 3, million: 'Display currency', 2021: 'HKD', 2022: 'HKD', 2024: 'HKD', type: 'Info' },
        { id: 4, million: 'FX rate', 2021: '0.12826', 2022: '0.12826', 2024: '0.12826', type: 'Info' },
        { id: 5, million: 'Revenue', 2021: '', 2022: '', 2024: '', isHeader: true, type: 'Header' },
        { id: 6, million: 'Passenger', 2021: '4,357.00', 2022: '14,333.00', 2024: '15,213.00', type: 'Revenue' },
        { id: 7, million: 'Cargo', 2021: '35,814.00', 2022: '30,554.00', 2024: '29,312.00', type: 'Revenue' },
        { id: 8, million: 'Others', 2021: '', 2022: '', 2024: '', isOthers: true, type: 'Revenue' },
        { id: 9, million: 'Catering, recoveries and...', 2021: '5,416.00', 2022: '6,149.00', 2024: '5,236.00', type: 'Revenue' },
        { id: 10, million: '', 2021: '', 2022: '', 2024: '', isTotal: true, type: 'TotalRevenue' },
        { id: 11, million: 'Operating expense', 2021: '', 2022: '', 2024: '', isHeader: true, type: 'Header' },
        { id: 12, million: 'Fuel', 2021: '4,357.00', 2022: '14,333.00', 2024: '', type: 'Expense' },
        { id: 13, million: 'Labour', 2021: '35,814.00', 2022: '30,554.00', 2024: '', type: 'Expense' },
        { id: 14, million: 'Landing fees and route charges', 2021: '35,814.00', 2022: '30,554.00', 2024: '', type: 'Expense' },
        { id: 15, million: 'Maintenance, materials and...', 2021: '35,814.00', 2022: '30,554.00', 2024: '', type: 'Expense' },
        { id: 16, million: 'Others', 2021: '', 2022: '', 2024: '', isOthers: true, type: 'Expense' },
        { id: 17, million: 'Inflight and passenger...', 2021: '5,416.00', 2022: '6,149.00', 2024: '', type: 'Expense' },
        { id: 18, million: 'Restructuring costs', 2021: '385.00', 2022: '', 2024: '', type: 'Expense' },
        { id: 19, million: '', 2021: '', 2022: '', 2024: '', isTotal: true, type: 'TotalExpense' },
    ];

    const initialColumnDefs = [
        {
            headerName: '(million)',
            field: 'million',
            width: 250,
            cellClass: params => params.data.isHeader ? 'header-cell' : 'gray-color',
            cellRenderer: params => {
                if (params.data.isOthers) {
                    return (
                        <div>
                            {params.value}
                            <span className="custom-icon" onClick={() => addNewRow(params.data.id, params.data.type)}>
                                <i className="fas fa-circle fa-stack-1x" style={{ color: 'black' }}></i>
                                <i className="fas fa-plus fa-xs fa-stack-1x fa-inverse" style={{ cursor: 'pointer' }}></i>
                            </span>
                        </div>
                    );
                }
                return <span style={params.data.isHeader ? { fontWeight: 'bold' } : null}>{params.value}</span>;
            }
        },
        { headerName: '31-12-2021', field: '2021', width: 150, cellClass: params => params.data.isTotal ? 'total-cell' : '' },
        { headerName: '31-12-2022', field: '2022', width: 150, cellClass: params => params.data.isTotal ? 'total-cell gray-color' : 'gray-color' },
        { headerName: '31-12-2024', field: '2024', width: 150, editable: true, cellClass: params => params.data.isTotal ? 'total-cell' : '' },
        {
            headerName: 'Variance',
            field: 'variance',
            width: 150,
            editable: false,
            valueGetter: params => {
                if (params.data.type === 'Revenue') {
                    const val2022 = parseFloat(params.data['2022'].replace(/,/g, '') || 0);
                    const val2024 = parseFloat(params.data['2024'].replace(/,/g, '') || 0);
                    const variance = (val2024 - val2022).toFixed(2);
                    return variance === '0.00' ? '' : variance;
                }
                return '';
            },
            cellClass: params => parseFloat(params.value) < 0 ? 'negative-variance' : 'positive-variance'
        },
        {
            headerName: 'Variance %',
            field: 'variancePercentage',
            width: 150,
            editable: false,
            valueGetter: params => {
                if (params.data.type === 'Revenue') {
                    const variance = parseFloat(params.getValue('variance').replace(/,/g, '') || 0);
                    const val2022 = parseFloat(params.data['2022'].replace(/,/g, '') || 0);
                    if (val2022 === 0) return '';
                    const variancePercentage = ((variance / val2022) * 100).toFixed(2);
                    return variancePercentage === '0.00' ? '' : `${variancePercentage}%`;
                }
                return '';
            },
            cellClass: params => parseFloat(params.value) < 0 ? 'negative-variance white-color' : 'positive-variance white-color'
        },
    ];

    const [rowData, setRowData] = useState(initialRowData);
    const [columnDefs, setColumnDefs] = useState(initialColumnDefs);

    useEffect(() => {
        calculateTotals();
    }, []);

    const calculateTotals = useCallback(() => {
        let totalRevenue2021 = 0;
        let totalRevenue2022 = 0;
        let totalRevenue2024 = 0;
        let totalExpense2021 = 0;
        let totalExpense2022 = 0;

        rowData.forEach(row => {
            if (row.type === 'Revenue' && !row.isHeader && !row.isTotal) {
                totalRevenue2021 += parseFloat(row['2021'].replace(/,/g, '') || 0);
                totalRevenue2022 += parseFloat(row['2022'].replace(/,/g, '') || 0);
                totalRevenue2024 += parseFloat(row['2024'].replace(/,/g, '') || 0);
            }
            if (row.type === 'Expense' && !row.isHeader && !row.isTotal) {
                totalExpense2021 += parseFloat(row['2021'].replace(/,/g, '') || 0);
                totalExpense2022 += parseFloat(row['2022'].replace(/,/g, '') || 0);
            }
        });

        const updatedData = [...rowData];
        const totalRevenueRow = updatedData.find(row => row.type === 'TotalRevenue');
        if (totalRevenueRow) {
            totalRevenueRow['2021'] = totalRevenue2021.toFixed(2);
            totalRevenueRow['2022'] = totalRevenue2022.toFixed(2);
            totalRevenueRow['2024'] = totalRevenue2024.toFixed(2);
        }

        const totalExpenseRow = updatedData.find(row => row.type === 'TotalExpense');
        if (totalExpenseRow) {
            totalExpenseRow['2021'] = totalExpense2021.toFixed(2);
            totalExpenseRow['2022'] = totalExpense2022.toFixed(2);
        }

        setRowData(updatedData);
    }, [rowData]);

    const addNewRow = useCallback((id, type) => {
        setRowData(prevRowData => {
            const newRow = { id: Date.now(), million: '', 2021: '', 2022: '', 2024: '', type: type };
            const insertIndex = prevRowData.findIndex(row => row.id === id) + 1;
            const updatedData = [...prevRowData];
            updatedData.splice(insertIndex, 0, newRow);
            return updatedData;
        });
    }, []);

    const onCellValueChanged = useCallback((event) => {
        const updatedRowData = event.api.getRowNode(event.node.id).data;
        const rowIndex = rowData.findIndex(row => row.id === updatedRowData.id);

        if (rowIndex !== -1) {
            const updatedData = [...rowData];
            updatedData[rowIndex] = updatedRowData;

            if (updatedRowData.type === 'Revenue') {
                const val2022 = parseFloat(updatedRowData['2022'].replace(/,/g, '') || 0);
                const val2024 = parseFloat(updatedRowData['2024'].replace(/,/g, '') || 0);

                const variance = (val2024 - val2022).toFixed(2);
                updatedData[rowIndex]['variance'] = variance === '0.00' ? '' : variance;

                const variancePercentage = val2022 === 0 ? '' : ((variance / val2022) * 100).toFixed(2);
                updatedData[rowIndex]['variancePercentage'] = variancePercentage === '0.00' ? '' : `${variancePercentage}%`;
            }

            setRowData(updatedData);
            calculateTotals();
        }
    }, [rowData, calculateTotals]);

    const addNewColumn = () => {
        const newColumnDef = {
            headerName: 'New Column',
            field: 'newColumn',
            width: 150,
            editable: true,
            cellClass: 'gray-color',
        };

        setColumnDefs(prevDefs => [...prevDefs, newColumnDef]);
    };

    return (
        <div style={{ marginLeft: '20px' }}>
            <h4>Financial statements</h4>
            <Tabs>
                <TabList className="horizontal-tabs">
                    <Tab>Profit & Loss</Tab>
                    <Tab disabled>Balance Sheet</Tab>
                    <Tab disabled>Cashflow</Tab>
                    <Tab disabled>Ratio</Tab>
                </TabList>

                <TabPanel>
                    <div className="ag-theme-alpine" style={{ height: '800px', width: '1000px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                            <div className="button-container">
                                <button className="button-margin-right button-white-background" onClick={addNewColumn}>Add Column</button>
                                <button className="button-margin-right button-white-background">Insert Comment</button>
                                <button className="button-white-background">Update Columns</button>
                            </div>
                            <AgGridReact
                                columnDefs={columnDefs}
                                rowData={rowData}
                                onCellValueChanged={onCellValueChanged}
                                defaultColDef={{ editable: true, sortable: true, resizable: true }}
                            />
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default FinancialStatements;
