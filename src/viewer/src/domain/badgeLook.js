// The one table of badge looks: a box only for a state that needs the person, every other state is faint text.
export const BOXED_STATES = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"];

// a dashboard node names a tone, not a state: a danger tone needs the person like a failure, a warning like a wait
const TONE_STATES = {danger: "failed", warn: "waiting"};

export const isBoxed = (state) => BOXED_STATES.includes(TONE_STATES[state] ?? state);
export const badgeClass = (state) => (isBoxed(state) ? ["badge", TONE_STATES[state] ?? state] : ["badge-quiet"]);
