import {wordLabel} from "@journal/window-kit";

const REQUEST_OUTCOMES = {allowed: "Allowed", refused: "Refused"};

export const requestOutcomeLabel = (outcome) => REQUEST_OUTCOMES[outcome] ?? wordLabel(outcome);
