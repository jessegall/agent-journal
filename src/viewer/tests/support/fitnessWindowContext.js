import {context} from "./windowContext.js";

export const fitnessWindowContext = (answers, agent) => context(answers, agent, {
    fitness: {line: "usage fitness"},
});
