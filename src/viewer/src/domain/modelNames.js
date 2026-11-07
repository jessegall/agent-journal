const PLURALS = {processes: "process", memories: "memory", replies: "reply"};

// a model name such as process is passed through as it is: only a plural s is taken off, never the s of -ss
export const cliOf = (table) => (PLURALS[table] ?? table.replace(/([^s])s$/, "$1")).replace(/_/g, "-");
