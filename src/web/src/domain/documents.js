export const searchTerms = (query) => query.toLowerCase().split(/\s+/).filter(Boolean);
