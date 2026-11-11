import pytest

from tests.stories.core.modules.assignments.support.assignable_chain import CHAIN
from tests.stories.core.modules.assignments.support.assignment_fixtures import YardWithBays, chain_worker, parcel_ids
from tests.stories.core.modules.assignments.support.assignment_reads import row_actors, assigned, assignment_of

HAND_GIVEN_PARCEL = 2
INHERIT = f"assign parcel {HAND_GIVEN_PARCEL} --from-parent --environment main"


@pytest.fixture
def yard(new_story):
    return new_story(CHAIN, fixture=YardWithBays)


@pytest.fixture
def shared_yard(yard):
    """The yard is the first worker's, and one of its parcels was given to the second worker by hand."""
    assigned(yard, "yard 1", chain_worker(yard, 1).id)
    assigned(yard, f"parcel {HAND_GIVEN_PARCEL}", chain_worker(yard, 2).id)
    return yard


def test_assigning_the_yard_to_x_moves_inherited_rows_and_keeps_the_parcel_given_to_v_and_override_takes_that_parcel_too(shared_yard):
    first_id, second_id, third_id = chain_worker(shared_yard, 1).id, chain_worker(shared_yard, 2).id, chain_worker(shared_yard, 3).id
    summary = assigned(shared_yard, "yard 1", third_id)
    expected = {parcel_id: third_id for parcel_id in (*parcel_ids(1), *parcel_ids(2))} | {HAND_GIVEN_PARCEL: second_id}
    shared_yard.expect_rows(row_actors(shared_yard, "yard") == {1: third_id}, row_actors(shared_yard, "bay") == {1: third_id, 2: third_id},
                            row_actors(shared_yard, "parcel") == expected, "kept 1 parcel (given by hand)" in summary, detail=summary)
    summary = assigned(shared_yard, "yard 1", first_id, "--override")
    taken = assignment_of(shared_yard, "parcel", HAND_GIVEN_PARCEL)
    shared_yard.expect_rows(taken["actor_id"] == first_id, taken["source_id"] == assignment_of(shared_yard, "bay", 1)["id"], "kept" not in summary, detail=summary)


def test_from_parent_is_refused_while_no_parent_is_assigned_and_gives_a_parcel_back_to_its_bays_actor_once_one_is(yard):
    yard.expect_refusal(INHERIT, f"parcel {HAND_GIVEN_PARCEL} has no assigned parent to inherit from", actor=yard.user)
    yard.expect_rows(row_actors(yard, "parcel") == {}, detail=str(row_actors(yard, "parcel")))
    assigned(yard, "yard 1", chain_worker(yard, 1).id)
    assigned(yard, f"parcel {HAND_GIVEN_PARCEL}", chain_worker(yard, 2).id)
    yard.expect_success(INHERIT, actor=yard.user)
    inherited = assignment_of(yard, "parcel", HAND_GIVEN_PARCEL)
    yard.expect_rows(inherited["actor_id"] == chain_worker(yard, 1).id, inherited["source_id"] == assignment_of(yard, "bay", 1)["id"], detail=str(inherited))


def test_a_parcel_inherited_from_something_else_is_kept(yard):
    first_id, second_id = chain_worker(yard, 1).id, chain_worker(yard, 2).id
    assigned(yard, "bay 1", second_id)
    summary = assigned(yard, "yard 1", first_id)
    expected = {parcel_id: second_id for parcel_id in parcel_ids(1)} | {parcel_id: first_id for parcel_id in parcel_ids(2)}
    yard.expect_rows(row_actors(yard, "bay") == {1: second_id, 2: first_id}, row_actors(yard, "parcel") == expected, "kept 1 bay (given by hand)" in summary, detail=summary)
