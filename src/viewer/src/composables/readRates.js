// how long each repeated read waits, in milliseconds, after its last answer has arrived
export const READ_RATES = {
    runningTool: 500,
    agentCommand: 5000,
    planCard: 3000,
    openPanel: 5000,
    documentWithNoEvents: 60000,
    pageOfAgents: 3000,
    projectHooks: 10000,
    numbers: 10000,
    services: 15000,
    libraryCopies: 30000,
    systemLogs: 5000,
};
