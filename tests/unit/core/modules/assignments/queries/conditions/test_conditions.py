from engine.model.model import Model
from core.modules.assignments.queries.conditions.assigned_to import AssignedTo
from core.modules.assignments.queries.conditions.unassigned import Unassigned


class Parcel(Model):
    model_name = "parcel"
    cli_name = "parcel"


def test_assigned_to_matches_the_rows_of_the_model_that_one_of_the_actors_holds():
    statement = AssignedTo(Parcel, (3, 7)).statement()
    assert statement.sql == "id IN (SELECT subject_id FROM assignments WHERE subject_model = ? AND actor_id IN (?, ?))"
    assert list(statement.parameters) == ["parcel", 3, 7]


def test_unassigned_matches_the_rows_of_the_model_that_nobody_holds():
    statement = Unassigned(Parcel).statement()
    assert statement.sql == "id NOT IN (SELECT subject_id FROM assignments WHERE subject_model = ?)"
    assert list(statement.parameters) == ["parcel"]
