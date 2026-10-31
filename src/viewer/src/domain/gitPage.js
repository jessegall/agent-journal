// How the Git page words what it lists, in ordinary terms.

export const distanceLine = (branch) => {
    if (!branch.extra_commits && !branch.missing_commits) return "level with the base";
    return [branch.extra_commits && `${branch.extra_commits} more than the base`, branch.missing_commits && `${branch.missing_commits} fewer than the base`].filter(Boolean).join(", ");
};

export const checksLine = (pull) => {
    const total = pull.checks_passed + pull.checks_failed + pull.checks_pending;
    if (!total) return "no checks";
    return [`${pull.checks_passed} passed`, pull.checks_failed && `${pull.checks_failed} failed`, pull.checks_pending && `${pull.checks_pending} running`].filter(Boolean).join(", ");
};

const REVIEWS = {APPROVED: "approved", CHANGES_REQUESTED: "changes requested", REVIEW_REQUIRED: "waiting for a review"};

export const reviewLine = (pull) => (pull.draft ? "draft" : REVIEWS[pull.review] || "not reviewed");

export const shortSha = (sha) => sha.slice(0, 7);
