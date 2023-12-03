import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Input, Button, Checkbox } from "@nextui-org/react";
import { SaveIcon } from '../assets/SaveIcon';
import { DeleteIcon } from '../assets/DeleteIcon';
import { EditIcon } from '../assets/EditIcon';
import { CancelIcon } from '../assets/CancelIcon';

function CustomTable({ tableData, onSelectRows, selectedRows, onDelete }) {
    const [data, setData] = useState([]);
    const [editingRowId, setEditingRowId] = useState(null);
    const [hoveredRowId, setHoveredRowId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isAllSelect, setIsAllSelect] = useState(false);

    useEffect(() => {
        setData(tableData);
        setCurrentPage(1);
        setIsAllSelect(false);
    }, [tableData]);

    const handleDelete = (id) => {
        const filteredData = data.filter((ele) => ele.id !== id);
        setData(filteredData);
        setEditingRowId(null);
    };

    const handleEdit = (id) => {
        setEditingRowId(id);
    };

    const handleSave = () => {
        setEditingRowId(null);
    };

    const handleCancelEdit = () => {
        setEditingRowId(null);
    };

    const handleRowSelect = (id) => {
        const selectedRowIds = selectedRows.includes(id)
            ? selectedRows.filter((rowId) => rowId !== id)
            : [...selectedRows, id];
        onSelectRows(selectedRowIds);
    };

    const handleInputChange = (e, property) => {
        const newData = data.map((row) =>
            row.id === editingRowId ? { ...row, [property]: e.target.value } : row
        );
        setData(newData);
    };

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, data.length);
    const visibleData = data.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage === 0 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <div>
            <div className="my-4 px-2 font-bold text-lg flex items-center justify-between">
                <div>
                    <span className="mr-2">Rows per page: </span>
                    <select value={rowsPerPage} onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                    </select>
                </div>
            </div>

            <Table aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn>
                        <Checkbox
                            isSelected={selectedRows.length === visibleData.length}
                            onChange={() => {
                                const allRowIds = visibleData.map((row) => row.id);
                                onSelectRows(
                                    selectedRows.length === visibleData.length ? [] : allRowIds
                                );
                                setIsAllSelect(!isAllSelect);
                            }}
                        />
                    </TableColumn>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                {visibleData.length === 0 ? (
                    <TableBody emptyContent="No data to display." />
                ) : (
                    <TableBody>
                        {visibleData.map((ele) => (
                            <TableRow
                                key={ele.id}
                                onMouseEnter={() => setHoveredRowId(ele.id)}
                                onMouseLeave={() => setHoveredRowId(null)}
                                className={
                                    hoveredRowId === ele.id ? 'hover:bg-gray-100 cursor-pointer' : ''
                                }
                            >
                                <TableCell>
                                    <Checkbox
                                        isSelected={isAllSelect || selectedRows.includes(ele.id)}
                                        onChange={() => {
                                            handleRowSelect(ele.id);
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{ele.id}</TableCell>
                                <TableCell>
                                    {editingRowId === ele.id ? (
                                        <Input
                                            value={ele.name}
                                            onChange={(e) => handleInputChange(e, 'name')}
                                        />
                                    ) : (
                                        ele.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingRowId === ele.id ? (
                                        <Input
                                            value={ele.email}
                                            onChange={(e) => handleInputChange(e, 'email')}
                                        />
                                    ) : (
                                        ele.email
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingRowId === ele.id ? (
                                        <Input
                                            value={ele.role}
                                            onChange={(e) => handleInputChange(e, 'role')}
                                        />
                                    ) : (
                                        ele.role
                                    )}
                                </TableCell>
                                <TableCell className="relative flex items-center gap-2">
                                    {editingRowId === ele.id ? (
                                        <>
                                            <Tooltip content="Save changes">
                                                <span
                                                    className="text-lg text-primary cursor-pointer active:opacity-50"
                                                    onClick={handleSave}
                                                >
                                                    <SaveIcon />
                                                </span>
                                            </Tooltip>
                                            <Tooltip color="danger" content="Cancel editing">
                                                <span
                                                    className="text-lg text-danger cursor-pointer active:opacity-50"
                                                    onClick={handleCancelEdit}
                                                >
                                                    <CancelIcon />
                                                </span>
                                            </Tooltip>
                                        </>
                                    ) : (
                                        <>
                                            <Tooltip content="Edit user">
                                                <span
                                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                    onClick={() => handleEdit(ele.id)}
                                                >
                                                    <EditIcon />
                                                </span>
                                            </Tooltip>
                                            <Tooltip color="danger" content="Delete user">
                                                <span
                                                    className="text-lg text-danger cursor-pointer active:opacity-50"
                                                    onClick={() => handleDelete(ele.id)}
                                                >
                                                    <DeleteIcon />
                                                </span>
                                            </Tooltip>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <Button
                    key={currentPage - 1}
                    variant={currentPage === currentPage - 1 ? 'primary' : 'ghost'}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index + 1}
                        variant={currentPage === index + 1 ? 'primary' : 'ghost'}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
                <Button
                    key={currentPage + 1}
                    variant={currentPage === currentPage + 1 ? 'primary' : 'ghost'}
                onClick={() => handlePageChange(currentPage + 1)}
                >
                Next
            </Button>
        </div>
        </div >
    );
}

export default CustomTable;