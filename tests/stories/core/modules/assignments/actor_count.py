import json

import pytest

from tests.stories.core.modules.assignments.support.assignable_samples import DEPOT
from tests.stories.core.modules.assignments.support.assignment_fixtures import CratesAndActors, second_person, worker

ASSIGNMENTS = "assignment list --json --environment main"
EVENTS = "event list --json --limit 20"


@pytest.fixture
def depot(new_story):
    return new_story(DEPOT, fixture=CratesAndActors)


def assigned(story, row: str, actor_id: int) -> None:
    story.expect_success(f"assign {row} --to {actor_id} --environment main", actor=story.user)


def actor_ids(story, model: str) -> list[int]:
    rows = json.loads(story.run(ASSIGNMENTS, actor=story.user).output_text)["rows"]
    return sorted(row["actor_id"] for row in rows if row["subject_model"] == model)


def assignment_events(story) -> list[dict]:
    rows = json.loads(story.run(EVENTS, actor=story.user).output_text)["rows"]
    return sorted((row for row in rows if row["event"].startswith("assignment.")), key=lambda row: row["id"])


def test_assigning_b_over_a_on_a_one_actor_model_replaces_the_row(depot):
    assigned(depot, "crate 1", worker(depot).id)
    assigned(depot, "crate 1", depot.user.id)
    replacement = assignment_events(depot)[-2:]
    depot.expect_rows(actor_ids(depot, "crate") == [depot.user.id], [event["event"] for event in replacement] == ["assignment.delete", "assignment.create"],
                      replacement[0]["command"] == replacement[1]["command"], replacement[0]["cause_id"] == replacement[1]["cause_id"], detail=str(replacement))


def test_assigning_b_on_a_many_actor_model_adds_a_row(depot):
    assigned(depot, "pallet 1", worker(depot).id)
    assigned(depot, "pallet 1", second_person(depot).id)
    depot.expect_rows(actor_ids(depot, "pallet") == sorted([worker(depot).id, second_person(depot).id]), detail=str(actor_ids(depot, "pallet")))


def test_assigning_a_twice_on_a_many_actor_model_is_refused_already_assigned(depot):
    assigned(depot, "pallet 1", depot.user.id)
    depot.expect_refusal(f"assign pallet 1 --to {depot.user.id} --environment main", "already assigned", actor=depot.user)
    depot.expect_rows(actor_ids(depot, "pallet") == [depot.user.id], detail=str(actor_ids(depot, "pallet")))


class TestAPalletOfTwoActors:
    @pytest.fixture
    def shared(self, depot):
        assigned(depot, "pallet 1", worker(depot).id)
        assigned(depot, "pallet 1", depot.user.id)
        return depot

    def test_unassign_from_one_actor_removes_only_that_actor(self, shared):
        shared.expect_success(f"unassign pallet 1 --from {worker(shared).id} --environment main", actor=shared.user)
        shared.expect_rows(actor_ids(shared, "pallet") == [shared.user.id], detail=str(actor_ids(shared, "pallet")))

    def test_unassign_without_an_actor_removes_every_actor(self, shared):
        shared.expect_success("unassign pallet 1 --environment main", actor=shared.user)
        shared.expect_rows(actor_ids(shared, "pallet") == [], detail=str(actor_ids(shared, "pallet")))


def test_unassigning_a_row_nobody_has_is_a_quiet_success(depot):
    depot.expect_success("unassign crate 1 --environment main", actor=depot.user)
    depot.expect_rows(assignment_events(depot) == [], detail=str(assignment_events(depot)))
