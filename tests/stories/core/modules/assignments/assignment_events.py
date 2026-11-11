import json
from pathlib import Path

import pytest

from tests.stories.core.modules.assignments.support.assignable_samples import DEPOT
from tests.stories.core.modules.assignments.support.assignment_fixtures import CratesAndActors, second_person, worker
from tests.stories.core.modules.assignments.support.assignment_listeners import DEPOT_LISTENERS, GUARD_REFUSAL

CONTRACT = Path(__file__).resolve().parents[4] / "snapshots" / "plugin_event_contract.json"
SHELVES = "shelf list --json --environment main"


@pytest.fixture
def depot(new_story):
    return new_story(DEPOT, DEPOT_LISTENERS, fixture=CratesAndActors)


def assign_crate(story, actor_id: int) -> None:
    story.expect_success(f"assign crate 1 --to {actor_id} --environment main", actor=story.user)
    story.run_listeners()


def listener_lines(story) -> list[str]:
    rows = json.loads(story.run(SHELVES, actor=story.user).output_text)["rows"]
    return [row["title"] for row in sorted(rows, key=lambda row: row["id"]) if "assigned" in row["title"]]


def test_an_assigned_listener_gets_one_call_per_assignment_with_the_row_and_actor(depot):
    assign_crate(depot, worker(depot).id)
    depot.expect_rows(listener_lines(depot) == [f"assigned crate 1 to {worker(depot).id}"], detail=str(listener_lines(depot)))


def test_a_one_actor_replacement_calls_unassigned_for_a_then_assigned_for_b(depot):
    assign_crate(depot, worker(depot).id)
    assign_crate(depot, depot.user.id)
    depot.expect_rows(listener_lines(depot)[1:] == [f"unassigned crate 1 from {worker(depot).id}", f"assigned crate 1 to {depot.user.id}"], detail=str(listener_lines(depot)))


def test_a_guard_on_created_assignment_refuses_the_assignment(depot):
    depot.expect_refusal(f"assign crate 1 --to {second_person(depot).id} --environment main", GUARD_REFUSAL, actor=depot.user)
    depot.expect_rows(listener_lines(depot) == [], '"subject_model"' not in depot.run("assignment list --json --environment main", actor=depot.user).output_text, detail=str(listener_lines(depot)))


def test_a_plugin_hears_assignment_create_and_delete(depot):
    contract = json.loads(CONTRACT.read_text())
    assign_crate(depot, worker(depot).id)
    depot.expect_success("unassign crate 1 --environment main", actor=depot.user)
    events = depot.run("event list --json --limit 20", actor=depot.user).output_text
    depot.expect_rows("core.assignments.assignment.created" in contract, "core.assignments.assignment.deleted" in contract, "assignment.create" in events, "assignment.delete" in events, detail=events)
