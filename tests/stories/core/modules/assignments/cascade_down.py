import pytest

from tests.stories.core.modules.assignments.support.assignable_chain import CHAIN
from tests.stories.core.modules.assignments.support.assignment_fixtures import YardWithBays, chain_worker, parcel_ids
from tests.stories.core.modules.assignments.support.assignment_reads import row_actors, assigned, assignment_record, logged_events

ALL_PARCELS = [*parcel_ids(1), *parcel_ids(2)]


@pytest.fixture
def yard(new_story):
    return new_story(CHAIN, fixture=YardWithBays)


def test_assigning_a_yard_assigns_its_bays_and_parcels_in_one_command_prints_the_counts_and_passes_over_a_shipped_parcel_for_good(yard):
    worker_id = chain_worker(yard, 1).id
    yard.expect_success("parcel edit 6 --stage shipped --environment main", actor=yard.user)
    summary = assigned(yard, "yard 1", worker_id)
    yard.expect_rows("assigned 1 yard, 2 bays, 5 parcels" in summary, "kept 1 parcel (passed over by its model)" in summary, detail=summary)
    yard.expect_rows(row_actors(yard, "yard") == {1: worker_id}, row_actors(yard, "bay") == {1: worker_id, 2: worker_id},
                     row_actors(yard, "parcel") == {parcel_id: worker_id for parcel_id in ALL_PARCELS if parcel_id != 6}, detail=str(row_actors(yard, "parcel")))
    yard.expect_success("parcel edit 6 --stage stored --environment main", actor=yard.user)
    yard.expect_rows(6 not in row_actors(yard, "parcel"), detail="a parcel stored again is not assigned by that")


def test_assigning_a_bay_assigns_only_its_parcels_which_carry_their_source_and_never_changes_the_yards_assignee(yard):
    assigned(yard, "bay 1", chain_worker(yard, 2).id)
    bay_assignment = assignment_record(yard, "bay", 1)
    shown = yard.run(f"assignment show {assignment_record(yard, 'parcel', 1)['id']}", actor=yard.user).output_text
    yard.expect_rows(bay_assignment["source_id"] is None, f"source_id: {bay_assignment['id']}" in shown, detail=shown)
    yard.expect_rows(row_actors(yard, "yard") == {}, row_actors(yard, "bay") == {1: chain_worker(yard, 2).id},
                     sorted(row_actors(yard, "parcel")) == parcel_ids(1), detail=str(row_actors(yard, "parcel")))


def test_assigning_one_parcel_to_v_leaves_the_yard_the_bays_and_other_parcels_with_w(yard):
    first_id, second_id = chain_worker(yard, 1).id, chain_worker(yard, 2).id
    assigned(yard, "parcel 2", second_id)
    assigned(yard, "yard 1", first_id)
    expected = {parcel_id: first_id for parcel_id in ALL_PARCELS} | {2: second_id}
    yard.expect_rows(row_actors(yard, "yard") == {1: first_id}, row_actors(yard, "bay") == {1: first_id, 2: first_id}, row_actors(yard, "parcel") == expected, detail=str(row_actors(yard, "parcel")))


def test_each_child_assignment_is_its_own_event_caused_by_the_command_event(yard):
    assigned(yard, "bay 1", chain_worker(yard, 1).id, "--override")
    created = logged_events(yard, "assignment.create")
    yard.expect_rows(len(created) == 4, len({event["command"] for event in created}) == 1, len({event["cause_id"] for event in created}) == 1, detail=str(created))


def test_no_cascade_flag_assigns_only_the_parent(yard):
    summary = assigned(yard, "yard 1", chain_worker(yard, 1).id, "--no-cascade")
    yard.expect_rows("assigned 1 yard" in summary, row_actors(yard, "bay") == {}, row_actors(yard, "parcel") == {}, detail=summary)
