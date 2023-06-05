import React, { useState } from "react";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

const getColumns = (cols) => {
	let columns = [];
	for (let i = 0; i <= cols; i++) {
		if (i === 0) {
			columns.push({ columnId: "", width: 40 });
		} else {
			columns.push({ columnId: String.fromCharCode(i + 64), width: 80 });
		}
	}
	return columns;
};

const getRows = (row, col) => {
	const columns = getColumns(col);
	let rowList = [
		{
			rowId: "header",
			cells: [
				...columns.map((column) => {
					return { type: "header", text: column.columnId };
				}),
			],
		},
	];
	for (let i = 0; i < row; i++) {
		rowList.push({
			rowId: i + 1,
			cells: [
				{ type: "header", text: (i + 1).toString() },
				{ type: "text", text: "" },
				{ type: "text", text: "" },
			],
		});
	}
	return rowList;
};

const SampleReactGrid = () => {
	const [rows, setRows] = useState(getRows(3, 2));
	const [columns, setColumns] = useState(getColumns(2));
	const [clipboardData, setClipboardData] = useState();

	const handleCopyRow = (selectedRowIds) => {
		setClipboardData(rows[selectedRowIds]);
		return { cell: selectedRowIds, clipboard: rows[selectedRowIds] };
	};
	const handleCopyColumn = (selectedColIds) => {
		const col = selectedColIds.charCodeAt(0) - 64;
		const data = rows.map((row) => {
			return { ...row, cells: [row.cells[col]] };
		});
		return { cell: selectedColIds, clipboard: data };
	};
	const handleCopyRange = (selectedRanges) => {
		console.log(selectedRanges);
		return selectedRanges;
	};

	const handlePasteRow = (selectedRowIds) => {
		return selectedRowIds;
	};
	const handlePasteColumn = (selectedColIds) => {
		return selectedColIds;
	};
	const handlePasteRange = (selectedRanges) => {
		console.log(selectedRanges);
		return selectedRanges;
	};

	const handleInsertRowUp = (selectedRowIds) => {
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
	};

	const handleInsertRowDown = (selectedRowIds) => {
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
	};

	const handleDeleteRow = (selectedRowIds) => {
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
	};

	const handleInsertColumnLeft = (selectedColIds) => {
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
	};

	const handleInsertColumnRight = (selectedColIds) => {
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
	};

	const handleDeleteColumn = (selectedColIds) => {
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
			rows.map((row, idx) => {
				if (idx === 0) {
					return {
						...row,
						cells: row.cells
							.filter((_, idx) => !columnsIdxs.includes(idx))
							.map((value, idx) => {
								if (idx >= columnsIdxs) {
									return {
										type: "header",
										text: String.fromCharCode(value.text.charCodeAt(0) - 1),
									};
								}
								return value;
							}),
					};
				}
				return {
					...row,
					cells: row.cells.filter((_, idx) => !columnsIdxs.includes(idx)),
				};
			})
		);
		setColumns(cols);
	};

	const handleContextMenu = (
		selectedRowIds,
		selectedColIds,
		selectionMode,
		selectedRanges,
		menuOptions
	) => {
		if (selectionMode === "row") {
			menuOptions = [
				...menuOptions,
				{
					id: "copy",
					label: "Copy",
					handler: () => {
						handleCopyRow(selectedRowIds);
					},
				},
				{
					id: "paste",
					label: "Paste",
					handler: () => {
						handlePasteRow(selectedRowIds);
					},
				},
				{
					id: "insertRowUp",
					label: "Insert Row(Up)",
					handler: () => {
						handleInsertRowUp(selectedRowIds);
					},
				},
				{
					id: "insertRowDown",
					label: "Insert Row(Down)",
					handler: () => {
						handleInsertRowDown(selectedRowIds);
					},
				},
				{
					id: "deleteRow",
					label: "Delete Row",
					handler: () => {
						handleDeleteRow(selectedRowIds);
					},
				},
			];
		} else if (selectionMode === "column") {
			menuOptions = [
				...menuOptions,
				{
					id: "copy",
					label: "Copy",
					handler: () => {
						handleCopyColumn(selectedColIds[0]);
					},
				},
				{
					id: "paste",
					label: "Paste",
					handler: () => {
						handlePasteColumn(selectedColIds[0]);
					},
				},
				{
					id: "insertColumnLeft",
					label: "Insert Column(Left)",
					handler: () => {
						handleInsertColumnLeft(selectedColIds);
					},
				},
				{
					id: "insertColumnRight",
					label: "Insert Column(Right)",
					handler: () => {
						handleInsertColumnRight(selectedColIds);
					},
				},
				{
					id: "deleteColumn",
					label: "Delete Column",
					handler: () => {
						handleDeleteColumn(selectedColIds);
					},
				},
			];
		} else if (selectionMode === "range") {
			menuOptions = [
				...menuOptions,
				{
					id: "copy",
					label: "Copy",
					handler: (e) => {
						handleCopyRange(menuOptions[0]);
					},
				},
				{
					id: "paste",
					label: "Paste",
					handler: () => {
						handlePasteRange(menuOptions[0]);
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
		return changes;
	};

	const handleCellFocus = (location) => {
		return {
			position: location,
			cellDetail:
				rows[location.rowId].cells[location.columnId.charCodeAt(0) - 64],
		};
	};

	return (
		<div style={{ backgroundColor: "#ddd", width: "fit-content" }}>
			<ReactGrid
				rows={rows}
				columns={columns}
				onCellsChanged={handleChanges}
				onContextMenu={handleContextMenu}
				enableRangeSelection
				enableRowSelection
				enableColumnSelection
				onFocusLocationChanged={handleCellFocus}
			/>
		</div>
	);
};

export default SampleReactGrid;
