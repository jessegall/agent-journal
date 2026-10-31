// A worker's report is filed as an agent message of kind report, its data naming the worker; its text opens with "<worker> reports: ".
export function reportOf(turn) {
    const data = turn.data || {};
    if (turn.who !== "agent" || data.kind !== "report") return null;
    const lead = `${data.worker} reports: `;
    return {worker: data.worker, workerId: data.worker_id || 0, text: turn.text.startsWith(lead) ? turn.text.slice(lead.length) : turn.text};
}
