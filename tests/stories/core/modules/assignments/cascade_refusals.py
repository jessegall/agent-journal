import pytest

from tests.stories.core.modules.assignments.support.assignable_chain import CHAIN
from tests.stories.core.modules.assignments.support.assignment_fixtures import YardWithBays, chain_worker
from tests.stories.core.modules.assignments.support.assignment_reads import assignment_rows, logged_events
from tests.stories.core.modules.assignments.support.unsound_chains import GUARD_REFUSAL, LOOPED, PARCEL_GUARD, SEVERAL_OVER_SINGLE
from tests.stories.core.support.fixtures import UserJoined


@pytest.fixture
def guarded_yard(new_story):
    return new_story(CHAIN, PARCEL_GUARD, fixture=YardWithBays)


def assign_yard(story, actor_id: int) -> str:
    return f"assign yard 1 --to {actor_id} --environment main"


def test_a_many_actor_parent_with_a_one_actor_child_stops_the_journal_starting(new_story):
    story = new_story(fixture=UserJoined)
    code, text = story.synced_with(SEVERAL_OVER_SINGLE)
    story.expect_rows(code != 0, "Dock takes several actors and its child Bolt takes one" in text, detail=text)


def test_a_loop_of_children_stops_the_journal_starting(new_story):
    story = new_story(fixture=UserJoined)
    code, text = story.synced_with(LOOPED)
    story.expect_rows(code != 0, "these models assign each other in a loop: Cog, Gear" in text, detail=text)


def test_a_refusal_in_the_middle_of_a_cascade_aborts_the_whole_command(guarded_yard):
    guarded_yard.expect_refusal(assign_yard(guarded_yard, chain_worker(guarded_yard, 1).id), GUARD_REFUSAL, actor=guarded_yard.user)
    guarded_yard.expect_rows(assignment_rows(guarded_yard) == [], detail=str(assignment_rows(guarded_yard)))


def test_a_command_that_fails_in_the_middle_leaves_no_assignment_row_and_no_event(guarded_yard):
    guarded_yard.expect_success(f"assign bay 1 --to {chain_worker(guarded_yard, 2).id} --environment main", actor=guarded_yard.user)
    logged = len(logged_events(guarded_yard, "assignment.create"))
    guarded_yard.expect_refusal(assign_yard(guarded_yard, chain_worker(guarded_yard, 1).id), GUARD_REFUSAL, actor=guarded_yard.user)
    guarded_yard.expect_rows(logged == 4, len(logged_events(guarded_yard, "assignment.create")) == logged, len(assignment_rows(guarded_yard)) == 4, detail=str(assignment_rows(guarded_yard)))


def test_assigning_a_yard_to_an_ended_agent_writes_nothing(new_story):
    story = new_story(CHAIN, fixture=YardWithBays)
    story.expect_success(f"agent end {chain_worker(story, 3).id}", actor=story.agent)
    story.expect_refusal(assign_yard(story, chain_worker(story, 3).id), "has ended", actor=story.user)
    story.expect_rows(assignment_rows(story) == [], detail=str(assignment_rows(story)))
