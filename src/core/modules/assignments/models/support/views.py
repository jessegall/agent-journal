from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.expressions.column import Column
from engine.query.expressions.scalar_subselect import ScalarSubselect
from engine.query.select import Select


def assigned_row_ids(model: str, actor_id: str) -> Select:
    """The ids of the rows of a model assigned to the actor the given column names."""
    return (Select("assignments").selecting(Column("assignments.subject_id"))
            .matching(Equal("assignments.subject_model", model)).matching(ColumnCompare("assignments.actor_id", "=", actor_id)))


def assigned_actor(model: str, row_id: str) -> ScalarSubselect:
    """The actor the row of a model, named by the given id column, is assigned to."""
    return ScalarSubselect(Select("assignments").selecting(Column("assignments.actor_id"))
                           .matching(Equal("assignments.subject_model", model)).matching(ColumnCompare("assignments.subject_id", "=", row_id)).sliced(1, 0))
