import {headingOf} from "./resourceNouns.js";

const FIELD = /\{([A-Za-z_]\w*)\}/g;

// a template with each {field} replaced by the row's field as text; a field the row lacks, or holds as null, is left empty, and braces
// that name no field stay as written; `extra` fills names the row does not hold, such as row_id
export function fill(template, row, extra = {}) {
    return template.replace(FIELD, (_, name) => {
        const value = name in extra ? extra[name] : row?.[name];
        return value === undefined || value === null ? "" : String(value);
    });
}

// the label an inspector shows: the listed one filled from the row, otherwise the term, the id and the state
export const inspectorLabel = (listing, term, row, id) => fill(listing.label, row, {row_id: id, id}) || headingOf(term, row, id);
