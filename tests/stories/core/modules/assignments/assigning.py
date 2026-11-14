from tests.stories.core.modules.assignments.support.assignment_reads import assignment_rows as own_assignment_rows
import json
import pytest

from engine.actor.actor import CORE_ACTOR_ID
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from tests.stories.core.modules.assignments.support.assignable_samples import DEPOT, DepotModule
from tests.stories.core.modules.assignments.support.assignment_fixtures import CratesAndActors, worker

ASSIGNMENTS = "assignment list --json --environment main"
MISSING_ACTOR_ID = 9_999


@pytest.fixture
def depot(new_story):
    return new_story(DEPOT, fixture=CratesAndActors)


def assign_line(actor_id: int) -> str:
    return f"assign crate 1 --to {actor_id} --environment main"


def assignment_rows(story) -> str:
    return json.dumps(own_assignment_rows(story), indent=2)


def test_a_person_assigns_a_crate_to_an_agent_and_assigning_the_actor_it_already_has_is_a_quiet_success(depot):
    depot.expect_success(assign_line(worker(depot).id), actor=depot.user)
    rows = assignment_rows(depot)
    depot.expect_rows(rows.count('"subject_model": "crate"') == 1, f'"actor_id": {worker(depot).id}' in rows, detail=rows)
    depot.expect_success(assign_line(worker(depot).id), actor=depot.user)
    depot.expect_rows(assignment_rows(depot) == rows, detail=assignment_rows(depot))


def test_a_person_actor_can_be_assigned_a_crate(depot):
    depot.expect_success(assign_line(depot.user.id), actor=depot.agent)
    rows = assignment_rows(depot)
    depot.expect_rows(rows.count('"subject_model": "crate"') == 1, f'"actor_id": {depot.user.id}' in rows, detail=rows)


def test_assigning_to_an_actor_that_does_not_exist_is_refused_and_writes_nothing(depot):
    depot.expect_refusal(assign_line(MISSING_ACTOR_ID), f"actor {MISSING_ACTOR_ID} does not exist", actor=depot.user)
    depot.expect_rows('"subject_model"' not in assignment_rows(depot), detail=assignment_rows(depot))


def test_assigning_to_a_module_or_core_actor_is_refused(depot):
    module_actor_id = depot.container.get(Queries).query(ActorRecord).filter(type=ActorType.MODULE, name=DepotModule.name).first().id
    depot.expect_refusal(assign_line(CORE_ACTOR_ID), "which receives no work", actor=depot.user)
    depot.expect_refusal(assign_line(module_actor_id), "which receives no work", actor=depot.user)


def test_assigning_to_an_ended_agent_is_refused(depot):
    depot.expect_success(f"agent end {worker(depot).id}", actor=depot.agent)
    depot.expect_refusal(assign_line(worker(depot).id), "has ended", actor=depot.user)


def test_a_worker_that_runs_assign_is_refused(depot):
    depot.expect_refusal(assign_line(depot.user.id), "cannot assign a row", actor=worker(depot))
    depot.expect_rows('"subject_model"' not in assignment_rows(depot), detail=assignment_rows(depot))
