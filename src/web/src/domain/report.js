const LEAD = /^([^\n]{1,60}?) reports: /;

// A worker's report is filed as an agent message that opens "<worker> reports: "; this is the worker and the report's own words.
export function reportOf(turn) {
    const lead = turn.who === "agent" && turn.kind === "message" ? LEAD.exec(turn.text || "") : null;
    return lead ? {worker: lead[1], text: turn.text.slice(lead[0].length)} : null;
}
