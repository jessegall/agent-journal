// a count is full once it reaches a limit that is set; a limit of 0 is not a limit that can be reached
export const isFull = (count, limit) => limit > 0 && count >= limit;

// how much of a limit a count fills, in percent, and how much of the count is over the limit
export const filledPercent = (count, limit) => (limit ? Math.min((count / Math.max(count, limit)) * 100, 100) : 0);
export const overPercent = (count, limit) => (limit && count > limit ? ((count - limit) / count) * 100 : 0);
