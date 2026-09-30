const KINDS = {
    waiting: {many: "Needs you"},
    question: {one: "Question", word: "question", many: "Questions"},
    plan: {one: "Plan", word: "plan", many: "Plans", waiting: "Plan to approve"},
    report: {one: "Report", word: "report", many: "Reports", waiting: "New report"},
    doc: {one: "Document", word: "document", many: "Documents", waiting: "New document"},
    todo: {one: "To-do", word: "to-do", many: "To-dos"},
    suggestion: {one: "Suggestion", word: "suggestion", many: "Suggestions"},
    work: {one: "Work", word: "work", many: "Work"},
    agent: {one: "Agent", word: "agent", many: "Agents"},
    fact: {one: "Fact", word: "fact", many: "Facts"},
    rule: {one: "Rule", word: "rule", many: "Rules"},
    message: {one: "Message", word: "message", many: "Messages"},
};

export const CARDS = ["waiting", "todo", "question", "suggestion", "plan", "report", "doc", "work", "agent"];
export const kindTitle = (type) => KINDS[type]?.one || type;
export const kindWord = (type) => KINDS[type]?.word || type;
export const kindCard = (type) => KINDS[type]?.many || type;
export const kindWaiting = (type) => KINDS[type]?.waiting || kindTitle(type);
