import {matchesSearch} from "./searchFields.js";

export function toggleFilter(filters, group, value) {
    const values = filters[group];
    return {...filters, [group]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value]};
}

// A page declares its filters as data: {key, label, options: [[value, label]], get(row) -> a value or values, default: [values]}.
// What a bar holds is {key: {not, values}}; a field with no entry, or no values, holds nothing back.
export const emptyFilter = () => ({});

// the value a bar starts with and returns to: a field with a default other than all starts as set
export const defaultFilter = (fields) => Object.fromEntries(fields.filter((field) => field.default?.length).map((field) => [field.key, {not: false, values: [...field.default]}]));

export const isDefault = (field, entry) => {
    const values = entry?.values ?? [];
    const wanted = field.default ?? [];
    return !entry?.not && values.length === wanted.length && wanted.every((value) => values.includes(value));
};

export const isSet = (entry) => Boolean(entry?.values.length);

// the options of a field, read from the rows
export const optionsOf = (rows, get, label = (value) => value) =>
    [...new Set(rows.flatMap((row) => [].concat(get(row))).filter((value) => value != null && value !== ""))].map((value) => [value, label(value)]);

export const countOf = (field, rows, option) => rows.filter((row) => [].concat(field.get(row)).includes(option)).length;

export function applyFilter(rows, fields, value, words = "", fieldsOfText = []) {
    return rows.filter((row) => fields.every((field) => matchesField(row, field, value[field.key])) && (!words.trim() || matchesSearch(row, words, fieldsOfText)));
}

function matchesField(row, field, entry) {
    if (!isSet(entry)) return true;
    const got = [].concat(field.get(row));
    const hit = entry.values.some((value) => got.includes(value));
    return entry.not ? !hit : hit;
}
