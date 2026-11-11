import pytest

from tests.stories.core.modules.assignments.support.assignable_chain import CHAIN
from tests.stories.core.modules.assignments.support.assignment_fixtures import YardWithBays, chain_worker, parcel_ids
from tests.stories.core.modules.assignments.support.assignment_reads import assigned, row_actors

HAND_GIVEN_PARCEL = 2
NEW_PARCEL = 7
SHIPPED_PARCEL = 6


@pytest.fixture
def yard(new_story):
    return new_story(CHAIN, fixture=YardWithBays)


def command(story, line: str) -> None:
    story.expect_success(f"{line} --environment main", actor=story.user)


def moved_to_second_bay(story, parcel_id: int) -> None:
    """A parcel moves as a task moves between phases: its link is deleted and a new one is made."""
    command(story, f"bay-parcel delete {parcel_id}")
    command(story, f"bay-parcel make 2 {parcel_id}")


def test_unassigning_the_yard_removes_the_yards_the_bays_and_the_inherited_parcels_and_keeps_hand_given_ones(yard):
    assigned(yard, "yard 1", chain_worker(yard, 1).id)
    assigned(yard, f"parcel {HAND_GIVEN_PARCEL}", chain_worker(yard, 2).id)
    command(yard, "unassign yard 1")
    yard.expect_rows(row_actors(yard, "yard") == {}, row_actors(yard, "bay") == {}, row_actors(yard, "parcel") == {HAND_GIVEN_PARCEL: chain_worker(yard, 2).id}, detail=str(row_actors(yard, "parcel")))


def test_unassigning_a_hand_given_parcel_leaves_it_unassigned_and_does_not_fall_back_to_its_bay(yard):
    assigned(yard, f"parcel {HAND_GIVEN_PARCEL}", chain_worker(yard, 2).id)
    assigned(yard, "bay 1", chain_worker(yard, 1).id)
    command(yard, f"unassign parcel {HAND_GIVEN_PARCEL}")
    yard.expect_rows(sorted(row_actors(yard, "parcel")) == [1, 3], detail=str(row_actors(yard, "parcel")))


def test_a_parcel_added_to_an_assigned_bay_is_given_the_bays_actor(yard):
    assigned(yard, "bay 1", chain_worker(yard, 1).id, "--no-cascade")
    command(yard, 'parcel make "Late parcel"')
    command(yard, f"bay-parcel make 1 {NEW_PARCEL}")
    yard.expect_rows(row_actors(yard, "parcel") == {NEW_PARCEL: chain_worker(yard, 1).id}, detail=str(row_actors(yard, "parcel")))


def test_a_bay_added_to_an_assigned_yard_is_given_the_yards_actor(yard):
    assigned(yard, "yard 1", chain_worker(yard, 3).id, "--no-cascade")
    command(yard, 'bay make 1 "Late bay"')
    yard.expect_rows(row_actors(yard, "bay") == {3: chain_worker(yard, 3).id}, detail=str(row_actors(yard, "bay")))


def test_a_parcel_added_to_a_bay_that_has_no_actor_stays_unassigned(yard):
    command(yard, 'parcel make "Late parcel"')
    command(yard, f"bay-parcel make 2 {NEW_PARCEL}")
    yard.expect_rows(row_actors(yard, "parcel") == {}, detail=str(row_actors(yard, "parcel")))


@pytest.fixture
def two_bays(yard):
    """Bay 1 is the first worker's with its parcels, bay 2 the third worker's; parcel 2 was given to the second by hand."""
    assigned(yard, "bay 2", chain_worker(yard, 3).id)
    assigned(yard, "bay 1", chain_worker(yard, 1).id)
    assigned(yard, f"parcel {HAND_GIVEN_PARCEL}", chain_worker(yard, 2).id)
    return yard


def test_a_parcel_moved_to_another_bay_keeps_a_hand_given_assignment(two_bays):
    moved_to_second_bay(two_bays, HAND_GIVEN_PARCEL)
    two_bays.expect_rows(row_actors(two_bays, "parcel")[HAND_GIVEN_PARCEL] == chain_worker(two_bays, 2).id, detail=str(row_actors(two_bays, "parcel")))


def test_a_parcel_moved_to_another_bay_takes_the_new_bays_actor_if_inherited(two_bays):
    moved_to_second_bay(two_bays, 1)
    two_bays.expect_rows(row_actors(two_bays, "parcel")[1] == chain_worker(two_bays, 3).id, detail=str(row_actors(two_bays, "parcel")))


def test_a_parcel_removed_from_a_bay_loses_an_inherited_assignment_and_keeps_a_hand_given_one(two_bays):
    command(two_bays, "bay-parcel delete 3")
    command(two_bays, f"bay-parcel delete {HAND_GIVEN_PARCEL}")
    held = row_actors(two_bays, "parcel")
    two_bays.expect_rows(3 not in held, held[HAND_GIVEN_PARCEL] == chain_worker(two_bays, 2).id, held[1] == chain_worker(two_bays, 1).id, detail=str(held))


def test_a_shipped_parcel_is_left_out_of_a_cascade_and_reopening_it_does_not_assign_it(yard):
    command(yard, f"parcel edit {SHIPPED_PARCEL} --is-shipped true")
    assigned(yard, "yard 1", chain_worker(yard, 1).id)
    command(yard, f"parcel edit {SHIPPED_PARCEL} --is-shipped false")
    yard.expect_rows(sorted(row_actors(yard, "parcel")) == [*parcel_ids(1), 4, 5], detail=str(row_actors(yard, "parcel")))
