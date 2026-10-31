const MOMENTS = {task_completed: "A task is completed", task_started: "A task is started"};
const COMPARISONS = {is: "is", at_least: "is at least", at_most: "is at most"};

export const momentText = (trigger) => MOMENTS[trigger] || trigger;

const listed = (values) => (Array.isArray(values) ? values.join(" or ") : String(values));

const countText = (count) => {
    const where = Object.entries(count.where || {}).map(([name, values]) => `${name} ${listed(values)}`);
    const comparison = Object.keys(COMPARISONS).find((name) => name in count);
    const rows = where.length ? `${count.count} with ${where.join(" and ")}` : count.count;
    return `the number of ${rows} ${COMPARISONS[comparison]} ${count[comparison]}`;
};

const joinedText = (condition) => {
    if (condition.all) {
        return condition.all.map(countText).join(", and ");
    }
    if (condition.any) {
        return condition.any.map(countText).join(", or ");
    }
    return countText(condition);
};

export const conditionText = (condition) => {
    if (!condition || !Object.keys(condition).length) {
        return "";
    }
    const text = joinedText(condition);
    return text[0].toUpperCase() + text.slice(1);
};
