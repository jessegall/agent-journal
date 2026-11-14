// the changes a control shows at once, each from the rows a window holds to the rows its command will leave

export const removed = (id) => (rows) => rows.filter((row) => row.id !== id);

export const patched = (id, fields) => (rows) => rows.map((row) => (row.id === id ? {...row, ...fields} : row));

export const added = (row) => (rows) => [...rows, row];

export const patchedWhere = (match, fields) => (rows) => rows.map((row) => (match(row) ? {...row, ...fields} : row));
