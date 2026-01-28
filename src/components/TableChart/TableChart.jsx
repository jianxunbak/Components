import React, { useState } from 'react';
import StyledCard from '../StyledCard/StyledCard';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Button from '../Button/Button';
import './TableChart.css';
import Menu from '../Menu';
import { MoreHorizontal, Filter, Download, Trash2, Edit } from 'lucide-react';

/**
 * TableChart Component
 * A premium table component that can render vertical bar charts (sparkbars) within cells.
 * 
 * @param {Array} data - Array of data objects
 * @param {Array} columns - Column definitions: { key, label, type: 'text'|'number'|'chart'|'trend', render: fn }
 * @param {string} title - Card title
 */
const TableChart = ({
    data = [],
    columns = [],
    title = "Market Data",
    variant = "default",
    className = "",
    ...props
}) => {

    // Custom cell renderers
    const renderCell = (row, col) => {
        const value = row[col.key];

        if (col.render) {
            return col.render(value, row);
        }

        switch (col.type) {
            case 'chart':
                // Expects value to be array of numbers or objects
                // We map it to a normalized structure
                const rawChartData = Array.isArray(value) ? value.map((v) =>
                    typeof v === 'object' ? v.value : v
                ) : [];

                if (rawChartData.length === 0) return <div className="cell-chart" />;

                // Find max absolute value for scaling
                const maxVal = Math.max(...rawChartData.map(v => Math.abs(v))) || 1;

                return (
                    <div className="cell-chart">
                        <div className="mini-bar-chart">
                            {rawChartData.map((v, i) => {
                                const heightPct = Math.round((Math.abs(v) / maxVal) * 100);
                                const isPositive = v >= 0;
                                return (
                                    <div
                                        key={i}
                                        className={`mini-bar-col ${isPositive ? 'positive' : 'negative'}`}
                                        style={{ height: `${heightPct}%` }}
                                        title={`Value: ${v}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            case 'trend':
                const isPositive = parseFloat(value) >= 0;
                return (
                    <span className={`cell-trend ${isPositive ? 'positive' : 'negative'}`} style={{
                        color: isPositive ? 'var(--neu-success)' : 'var(--neu-error)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontWeight: 600
                    }}>
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {value}%
                    </span>
                );
            case 'number':
                return <span className="cell-number">{value}</span>;
            default:
                return <span className="cell-text">{value}</span>;
        }
    };

    return (
        <StyledCard
            expanded={true}
            title={title}
            className={`table-chart-card ${className}`}
            variant={variant}
            headerAlign="start" // Left align title
            controls={
                <Menu
                    trigger={
                        <Button variant="icon">
                            <MoreHorizontal size={18} />
                        </Button>
                    }
                    orientation="horizontal"
                    placement="bottom-right"
                >
                    <Button onClick={() => console.log('Filter')} title="Filter">
                        <Filter size={16} />
                    </Button>
                    <Button onClick={() => console.log('Export')} title="Export">
                        <Download size={16} />
                    </Button>
                    <Button onClick={() => console.log('Edit')} title="Edit Columns">
                        <Edit size={16} />
                    </Button>
                </Menu>
            }
            {...props}
        >
            <div className="table-chart-container">
                <table className="table-chart-table">
                    <thead>
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} style={{ width: col.width || 'auto' }}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={row.id || rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={`${rowIndex}-${colIndex}`}>
                                        {renderCell(row, col)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </StyledCard>
    );
};

export default TableChart;
