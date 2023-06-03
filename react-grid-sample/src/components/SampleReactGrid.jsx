import React, { useState } from "react";
import { ReactGrid, Cell } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

const COLUMNS = ["", "A", "B"];
const DATA = [
	["Thomas", "Goldman"],
	["Susie", "Quattro"],
];

const getData = () => {
	return DATA.map((data, idx) => {
		return { id: (idx + 1).toString(), A: data[0], B: data[1] };
	});
};

const getColumns = () => {
	return COLUMNS.map((column, idx) => {
		if (idx === 0) {
			return { columnId: column, width: 40 };
		}
		return { columnId: column, width: 80 };
	});
};

const headerRow = {
	rowId: "header",
	cells: [
		...COLUMNS.map((column) => {
			return { type: "header", text: column };
		}),
	],
};
const getRows = (data) => [
	headerRow,
	...data.map((row, idx) => ({
		rowId: idx + 1,
		cells: [
			{ type: "header", text: row.id },
			{ type: "text", text: row.A },
			{ type: "text", text: row.B },
		],
	})),
];

const SampleReactGrid = () => {
	const [rows, setRows] = useState(getRows(getData()));
	const [columns, setColumns] = useState(getColumns());

	const handleContextMenu = (
		selectedRowIds,
		selectedColIds,
		selectionMode,
		menuOptions
	) => {
		if (selectionMode === "row") {
			menuOptions = [
				...menuOptions,
				{
					id: "insertRowUp",
					label: "Insert Row(Up)",
					handler: () => {
						setRows((prevRows) => {
							return [
								...prevRows.slice(0, parseInt(selectedRowIds)),
								{
									rowId: parseInt(selectedRowIds),
									cells: [
										{
											type: "header",
											text: parseInt(selectedRowIds).toString(),
										},
										{ type: "text", text: "" },
										{ type: "text", text: "" },
									],
								},
								...prevRows.slice(parseInt(selectedRowIds)).map((row) => {
									return {
										...row,
										rowId: row.rowId + 1,
										cells: [
											{
												type: "header",
												text: (row.rowId + 1).toString(),
											},
											...row.cells.slice(1),
										],
									};
								}),
							].map((row, idx) => {
								if (idx > 0) {
									return { ...row, rowId: idx };
								}
								return row;
							});
						});
					},
				},
				{
					id: "insertRowDown",
					label: "Insert Row(Down)",
					handler: () => {
						setRows((prevRows) => {
							return [
								...prevRows.slice(0, parseInt(selectedRowIds) + 1),
								{
									rowId: parseInt(selectedRowIds) + 1,
									cells: [
										{
											type: "header",
											text: (parseInt(selectedRowIds) + 1).toString(),
										},
										{ type: "text", text: "" },
										{ type: "text", text: "" },
									],
								},
								...prevRows.slice(parseInt(selectedRowIds) + 1).map((row) => {
									return {
										...row,
										rowId: row.rowId + 1,
										cells: [
											{
												type: "header",
												text: (row.rowId + 1).toString(),
											},
											...row.cells.slice(1),
										],
									};
								}),
							].map((row, idx) => {
								if (idx > 0) {
									return { ...row, rowId: idx };
								}
								return row;
							});
						});
					},
				},
				{
					id: "deleteRow",
					label: "Delete Row",
					handler: () => {
						setRows(
							rows
								.filter((row) => !selectedRowIds.includes(row.rowId))
								.map((row, idx) => {
									if (idx < selectedRowIds[0]) {
										return row;
									}
									return {
										...row,
										rowId: row.rowId - 1,
										cells: [
											{ type: "header", text: (row.rowId - 1).toString() },
											...row.cells.slice(1),
										],
									};
								})
						);
					},
				},
			];
		} else if (selectionMode === "column") {
			menuOptions = [
				...menuOptions,
				{
					id: "insertColumnLeft",
					label: "Insert Column(Left)",
					handler: () => {
						const cols = columns.filter(
							(column) => !selectedColIds.includes(column.columnId)
						);

						const columnsIdxs = columns
							.map((column, idx) => {
								if (!cols.includes(column)) return idx;
								return undefined;
							})
							.filter((idx) => idx !== undefined)[0];

						const last = String.fromCharCode(
							columns[columns.length - 1].columnId.charCodeAt(0) + 1
						);

						setColumns((prevColumns) => {
							return [
								...prevColumns,
								{
									columnId: last,

									width: 80,
								},
							];
						});
						setRows(
							rows.map((row, idx) => {
								if (idx === 0) {
									return {
										...row,
										cells: [...row.cells, { type: "header", text: last }],
									};
								}
								return {
									...row,
									cells: [
										...row.cells.slice(0, columnsIdxs),
										{ type: "text", text: "" },
										...row.cells.slice(columnsIdxs),
									],
								};
							})
						);
					},
				},
				{
					id: "insertColumnRight",
					label: "Insert Column(Right)",
					handler: () => {
						const cols = columns.filter(
							(column) => !selectedColIds.includes(column.columnId)
						);

						const columnsIdxs = columns
							.map((column, idx) => {
								if (!cols.includes(column)) return idx;
								return undefined;
							})
							.filter((idx) => idx !== undefined)[0];

						const last = String.fromCharCode(
							columns[columns.length - 1].columnId.charCodeAt(0) + 1
						);

						setColumns((prevColumns) => {
							return [
								...prevColumns,
								{
									columnId: last,

									width: 80,
								},
							];
						});
						setRows(
							rows.map((row, idx) => {
								if (idx === 0) {
									return {
										...row,
										cells: [...row.cells, { type: "header", text: last }],
									};
								}
								return {
									...row,
									cells: [
										...row.cells.slice(0, parseInt(columnsIdxs) + 1),
										{ type: "text", text: "" },
										...row.cells.slice(parseInt(columnsIdxs) + 1),
									],
								};
							})
						);
					},
				},
				{
					id: "deleteColumn",
					label: "Delete Column",
					handler: () => {
						const cols = columns.filter(
							(column) => !selectedColIds.includes(column.columnId)
						);

						const columnsIdxs = columns
							.map((column, idx) => {
								if (!cols.includes(column)) return idx;
								return undefined;
							})
							.filter((idx) => idx !== undefined);
						setRows(
							rows.map((row) => ({
								...row,
								cells: row.cells.filter((_, idx) => !columnsIdxs.includes(idx)),
							}))
						);
						setColumns(cols);
					},
				},
			];
		}

		return menuOptions;
	};
	const handleChanges = (changes) => {
		setRows((prevRows) => {
			changes.forEach((change) => {
				const changeRowIdx = prevRows.findIndex(
					(el) => el.rowId === change.rowId
				);
				const changeColumnIdx = columns.findIndex(
					(el) => el.columnId === change.columnId
				);
				prevRows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
			});
			return [...prevRows];
		});
	};

	return (
		<div style={{ backgroundColor: "#ddd", width: "fit-content" }}>
			<ReactGrid
				rows={rows}
				columns={columns}
				enableRangeSelection
				onCellsChanged={handleChanges}
				onContextMenu={handleContextMenu}
				enableFillHandle
				enableRowSelection
				enableColumnSelection
				enableClipboard={true}
			/>
		</div>
	);
};

export default SampleReactGrid;
