// the words of the process queue's lanes: what goes in each lane, a run's kind as one word, and what a run takes
export const LANE_CONTENTS = {
    instant: "Hooks, journal commands and viewer requests. Each takes 1 slot.",
    short: "Reads, searches, edits and git. Each takes 1 slot.",
    long: "Tests, builds, checks, installs and plugins. A test, a build or a check takes 4 slots, an install 2.",
};
const KIND_WORDS = {"test run": "test", "version control": "git", package: "install", "background job": "job"};

export const laneWord = (lane) => `${lane[0].toUpperCase()}${lane.slice(1)}`;
export const laneName = (lane) => `${laneWord(lane.lane)} lane`;

// a run's command category or plugin shortened to one word; the journal's own work in the instant lane is named by its class, whose last word says what it is
export const kindWord = (kind) => KIND_WORDS[kind] || kind.split(" ").at(-1);

export const takes = (cost) => (cost === 0 ? "no slot" : cost === 1 ? "1 slot" : `${cost} slots`);

// a lane halted by a command is paused; one held for an update or a restart lifts itself
export const isPaused = (lane) => lane.halt_type === "command";
