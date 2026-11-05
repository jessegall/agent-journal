const PLURALS = {processes: "process", memories: "memory", replies: "reply"};

export const cliOf = (table) => (PLURALS[table] ?? table.replace(/s$/, "")).replace(/_/g, "-");
