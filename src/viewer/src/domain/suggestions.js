// What an answered suggestion's card says it came to.
const OUTCOMES = {
    accepted: "You accepted this suggestion.",
    declined: "You declined this suggestion. It will not be made again.",
};

export const suggestionOutcome = (answer) => OUTCOMES[answer] || "";
