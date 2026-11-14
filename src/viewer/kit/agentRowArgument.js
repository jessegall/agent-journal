// the command word that names an agent by the id of its row, for a place that follows an agent by its row and
// does not hold the row itself; a place that holds the row sends its number
export const agentRowArgument = (rowId) => `row:${rowId}`;
