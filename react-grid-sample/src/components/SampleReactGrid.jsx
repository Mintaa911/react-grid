import React, { useState } from "react";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
// interface Person {
//   name: string;
//   surname: string;
// }

const getPeople = () => [
	{ name: "Thomas", surname: "Goldman" },
	{ name: "Susie", surname: "Quattro" },
	{ name: "", surname: "" },
];

const getColumns = () => [
	{ columnId: "name", width: 150 },
	{ columnId: "surname", width: 150 },
];

const headerRow = {
	rowId: "header",
	cells: [
		{ type: "header", text: "Name" },
		{ type: "header", text: "Surname" },
	],
};

const getRows = (people) => [
	headerRow,
	...people.map((person, idx) => ({
		rowId: idx,
		cells: [
			{ type: "text", text: person.name },
			{ type: "text", text: person.surname },
		],
	})),
];

const SampleReactGrid = () => {
	const [people, setPeople] = useState(getPeople());
	const [rows, setRows] = useState(getRows(people));
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
								...prevRows.slice(0, parseInt(selectedRowIds) + 1),
								{
									rowId: parseInt(selectedRowIds),
									cells: [
										{ type: "text", text: "" },
										{ type: "text", text: "" },
									],
								},
								...prevRows.slice(parseInt(selectedRowIds) + 1),
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
								...prevRows.slice(0, parseInt(selectedRowIds) + 2),
								{
									rowId: parseInt(selectedRowIds) + 1,
									cells: [
										{ type: "text", text: "" },
										{ type: "text", text: "" },
									],
								},
								...prevRows.slice(parseInt(selectedRowIds) + 2),
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
									if (idx > parseInt(selectedRowIds)) {
										return { ...row, rowId: idx - 1 };
									}
									return row;
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

						setColumns((prevColumns) => {
							return [
								...prevColumns.slice(0, columnsIdxs),
								{ columnId: columnsIdxs.toString(), width: 150 },
								...prevColumns.slice(columnsIdxs),
							];
						});
						setRows(
							rows.map((row) => ({
								...row,
								cells: [
									...row.cells.slice(0, columnsIdxs),
									{ type: "text", text: "" },
									...row.cells.slice(columnsIdxs),
								],
							}))
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

						setColumns((prevColumns) => {
							return [
								...prevColumns.slice(0, parseInt(columnsIdxs) + 1),
								{
									columnId: (parseInt(columnsIdxs) + 1).toString(),
									width: 150,
								},
								...prevColumns.slice(parseInt(columnsIdxs) + 1),
							];
						});
						setRows(
							rows.map((row) => ({
								...row,
								cells: [
									...row.cells.slice(0, parseInt(columnsIdxs) + 1),
									{ type: "text", text: "" },
									...row.cells.slice(parseInt(columnsIdxs) + 1),
								],
							}))
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
		<ReactGrid
			rows={rows}
			columns={columns}
			enableRangeSelection
			onCellsChanged={handleChanges}
			onContextMenu={handleContextMenu}
			enableFillHandle
			enableRowSelection
			enableColumnSelection
		/>
	);
};

export default SampleReactGrid;
