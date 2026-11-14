---
name: ReviewsArchitecture
description: Load it before writing code in the reviews module of version 5, so a review stays a row the workers module reads through events, and its state, steps and marks change only the way the module allows.
summary: Reviews import nothing of the workers module, a review moves only through its commands, a step and a mark are made only by listeners, and the report parser reads text and nothing else.
tier: mandatory
languages: [python]
---

# The reviews architecture

A review is a request to check the work on one row, named by `subject_model` and `subject_id`. The workers module
reads the review's events; reviews never writes a worker.

## When it fires

- **`reviews-imports-workers`** - a file of the reviews module imports from the workers module. Name the subject by
  model name and id, and let the workers module listen to `review.approve`, `review.reject` and
  `review.leave_undecided`.
- **`review-moved-outside-its-model`** - code outside `models/` calls `moved` on a review or a reviewer. Dispatch
  the move's command (`AssignReview`, `AbandonReview`, `StartReviewer`, `EndReviewer`) so its guards and event run.
- **`review-step-made-outside-a-listener`** - a handler or another class runs `MakeReviewStep` or `ShowMark`. A step
  and a mark are consequences of a review event: a commit or save listener makes each one.
- **`report-parser-reads-the-database`** - `support/review_report.py` imports a database, query or repository.
  The parser takes the report text; the handler that calls it reads and saves the rows.
