import pytest

from engine.errors.refusal import Refusal
from core.modules.agents.support.fold_clash_rules import FoldClashRules

SURVIVOR = 78


def test_task_reads_keep_the_latest_read_and_hand_the_rest_to_the_record():
    settled = FoldClashRules.settled("task_reads", [{"id": 1, "read_at": "2026-11-12"}, {"id": 2, "read_at": "2026-11-01"}], SURVIVOR, "agent_id")
    assert (settled.kept["id"], [row["id"] for row in settled.removed]) == (1, [2])


def test_assignments_keep_the_survivors_row_even_when_older():
    settled = FoldClashRules.settled("assignments", [{"id": 1, "actor_id": SURVIVOR}, {"id": 5, "actor_id": 30}], SURVIVOR, "actor_id")
    assert settled.kept["id"] == 1


def test_nudge_records_keep_the_oldest_and_links_too():
    assert FoldClashRules.settled("nudge_records", [{"id": 9}, {"id": 3}], SURVIVOR, "agent_id").kept["id"] == 3
    assert FoldClashRules.settled("links", [{"id": 9}, {"id": 3}], SURVIVOR, "subject_id").kept["id"] == 3


def test_a_table_with_no_rule_refuses_and_names_itself():
    with pytest.raises(Refusal, match="unknown_table"):
        FoldClashRules.settled("unknown_table", [{"id": 1}, {"id": 2}], SURVIVOR, "agent_id")
