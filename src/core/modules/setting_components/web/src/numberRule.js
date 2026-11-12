// what a number setting accepts, read from the rule text the server sends with it (a JSON text, or none), and the
// words that say which part of the rule a text breaks; an empty answer means the text keeps the rule
export function ruleOf(ruleText) {
    return ruleText ? JSON.parse(ruleText) : null;
}

export function numberRuleProblem(ruleText, text) {
    const rule = ruleOf(ruleText);
    const number = Number(text);
    if (!Number.isFinite(number)) return "Use a number.";
    if (rule === null) return "";
    if (rule.integer && !Number.isInteger(number)) return `Use a whole number of ${rule.minimum} or more.`;
    const below = number < rule.minimum || (rule.exclusive && number === rule.minimum);
    const above = rule.maximum !== null && number > rule.maximum;
    if (!below && !above) return "";
    const kind = rule.integer ? "a whole number" : "a number";
    if (rule.maximum !== null) return `Use ${kind} from ${rule.minimum} to ${rule.maximum}.`;
    return `Use ${kind} ${rule.exclusive ? "above" : "of"} ${rule.minimum}${rule.exclusive ? "" : " or more"}.`;
}
