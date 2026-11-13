from engine.query.conditions.condition_join import ConditionJoin
from engine.query.conditions.among import Among
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.expressions.aliased import Aliased
from engine.query.expressions.column import Column
from engine.query.expressions.concat import Concat
from engine.query.expressions.literal import Literal
from engine.query.select import Select

REVIEW_COLUMNS = ("environment_id", "id", "state", "subject_model", "subject_id")
OPEN_STATES = ("reviewing", "queued")

REVIEWER_ROWS_SELECT = (
    Select("reviews").selecting(
        Aliased(Concat([Literal("review:"), Column("reviews.id")]), "row_key"), Column("reviews.environment_id"), Aliased(Column("reviews.id"), "review_id"),
        Column("reviews.state"), Column("reviews.subject_model"), Column("reviews.subject_id"), Aliased(Literal("review"), "row_type"),
        Aliased(Literal(0), "step_id"), Aliased(Literal(""), "text"), Aliased(Literal("none"), "outcome"), Column("reviews.created_at"))
    .matching(Among("reviews.state", OPEN_STATES))
    .union(Select("review_steps").selecting(
        Concat([Literal("step:"), Column("review_steps.id")]), *(Column(f"reviews.{name}") for name in REVIEW_COLUMNS), Literal("step"),
        Column("review_steps.id"), Column("review_steps.text"), Column("review_steps.outcome"), Column("review_steps.created_at"))
           .joined(ConditionJoin("reviews", condition=ColumnCompare("reviews.id", "=", "review_steps.review_id"))).matching(Equal("reviews.state", "reviewing")))
).view_sql()
