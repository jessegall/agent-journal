// what each complexity score from 1 to 5 means, in the words the journal-tasks skill gives agents
export const SCORE_MEANINGS = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"];

export const scoreMeaning = (score) => {
    const words = SCORE_MEANINGS[score - 1];
    return words.slice(0, 1).toUpperCase() + words.slice(1);
};
