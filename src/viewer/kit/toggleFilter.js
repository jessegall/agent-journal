export function toggleFilter(filters, group, value) {
    const values = filters[group];
    return {...filters, [group]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value]};
}
