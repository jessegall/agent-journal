import {context} from "./windowContext.js";

export const reviewerWindowContext = (answers, agent = null) => context(answers, agent, {
    board: {line: "review board", events: ["review.*", "review_step.*", "reviewer.*"]},
});
