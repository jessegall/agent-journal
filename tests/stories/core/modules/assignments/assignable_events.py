import json

import pytest

from tests.stories.core.modules.assignments.support.assignable_samples import DEPOT
from tests.stories.core.modules.assignments.support.assignment_fixtures import CratesAndActors, worker

EVENTS = "event list --json --limit 30"


@pytest.fixture
def depot(new_story):
    return new_story(DEPOT, fixture=CratesAndActors)


def assigned(story, row: str, actor_id: int) -> None:
    story.expect_success(f"assign {row} --to {actor_id} --environment main", actor=story.user)


def events(story, name: str) -> list[dict]:
    rows = json.loads(story.run(EVENTS, actor=story.user).output_text)["rows"]
    return [row for row in rows if row["event"] == name]


def test_deleting_an_assignable_row_removes_its_assignments_each_logged(depot):
    assigned(depot, "pallet 1", worker(depot).id)
    assigned(depot, "pallet 1", depot.user.id)
    depot.expect_success("pallet delete 1 --environment main", actor=depot.user)
    deletion = events(depot, "pallet.delete")
    removed = events(depot, "assignment.delete")
    depot.expect_rows(len(deletion) == 1, len(removed) == 2, all(event["command"] == deletion[0]["command"] for event in removed),
                      '"subject_model"' not in depot.run("assignment list --json --environment main", actor=depot.user).output_text, detail=str(removed))


def test_deleting_an_actor_that_has_assignments_is_refused(depot):
    assigned(depot, "crate 1", depot.user.id)
    depot.expect_refusal(f"actor delete {depot.user.id}", f"actor {depot.user.id} holds 1 assignments", actor=depot.agent)
    depot.expect_success(f"actor show {depot.user.id}", "name: Ada", actor=depot.agent)


def test_a_listener_of_every_assignable_model_runs_for_a_model_that_adopts_later(depot):
    depot.expect_success('drum make "Oil" --environment main', actor=depot.user)
    assigned(depot, "drum 1", worker(depot).id)
    assigned(depot, "crate 1", worker(depot).id)
    depot.expect_success("drum delete 1 --environment main", actor=depot.user)
    depot.expect_success("crate delete 1 --environment main", actor=depot.user)
    depot.expect_rows(len(events(depot, "assignment.delete")) == 2, detail=str(events(depot, "assignment.delete")))


def test_the_trait_listener_skips_a_row_that_is_not_assignable(depot):
    depot.expect_success("shelf delete 1 --environment main", actor=depot.user)
    depot.expect_rows(len(events(depot, "shelf.delete")) == 1, events(depot, "assignment.delete") == [], detail=str(events(depot, "assignment.delete")))
