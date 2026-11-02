REVIEWER_ROWS_SELECT = (
    "SELECT 'review:' || reviews.id AS row_key, reviews.environment_id, reviews.id AS review_id, reviews.state, reviews.subject_model, reviews.subject_id,"
    " 'review' AS row_type, 0 AS step_id, '' AS text, 'none' AS outcome, reviews.created_at"
    " FROM reviews WHERE reviews.state IN ('reviewing', 'queued')"
    " UNION ALL"
    " SELECT 'step:' || review_steps.id, reviews.environment_id, reviews.id, reviews.state, reviews.subject_model, reviews.subject_id,"
    " 'step', review_steps.id, review_steps.text, review_steps.outcome, review_steps.created_at"
    " FROM review_steps JOIN reviews ON reviews.id = review_steps.review_id WHERE reviews.state = 'reviewing'"
)
