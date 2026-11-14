// an event with no row is the refresh a window hears when it is shown again, and it may be about any row
export const eventAboutRows = (event, ids) => !event.row_id || ids.has(event.row_id);
export const eventChildOf = (event, column, ids) => !event.row_id || (event.changed_ids?.[column] ?? []).some((id) => ids.has(id));
// an update that leaves the column alone does not say whose row it is, so only an event that names the column can rule the row out
export const eventMayBeChildOf = (event, column, ids) => !event.changed_ids?.[column]?.length || event.changed_ids[column].some((id) => ids.has(id));
