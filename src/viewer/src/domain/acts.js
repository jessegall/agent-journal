// What the viewer offers to do to a row: each act is the last word of its path, its label, whether it asks for a word first and
// which field it sends that word as (how it ended, unless it names another), or is a removal. Which acts a row offers follows from
// its table and its state.
const act = (name, label, more = {}) => ({name, label, asks: false, field: "how", danger: false, ...more});
const DELETE = act("delete", "Delete", {danger: true});
