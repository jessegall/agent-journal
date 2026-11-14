const i = (e) => !e.extra_commits && !e.missing_commits ? "level with the base" : [e.extra_commits && `${e.extra_commits} more than the base`, e.missing_commits && `${e.missing_commits} fewer than the base`].filter(Boolean).join(", "), n = (e) => e.checks_passed + e.checks_failed + e.checks_running ? [`${e.checks_passed} passed`, e.checks_failed && `${e.checks_failed} failed`, e.checks_running && `${e.checks_running} running`].filter(Boolean).join(", ") : "no checks", s = { APPROVED: "approved", CHANGES_REQUESTED: "changes requested", REVIEW_REQUIRED: "waiting for a review" }, c = (e) => e.draft ? "draft" : s[e.review] || "not reviewed", o = (e) => e.slice(0, 7), a = { M: "Changed", A: "New", D: "Deleted", R: "Moved", "?": "Not tracked" };
export {
  a as G,
  n as c,
  i as d,
  c as r,
  o as s
};
