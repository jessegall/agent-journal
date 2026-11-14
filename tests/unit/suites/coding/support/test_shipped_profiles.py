from pathlib import Path

from engine.enums.occupant import Occupant
from suites.coding.drivers.worker.worker_driver import WorkerDriver
from suites.coding.support.profile_commands import WORKER_COMMANDS
from suites.coding.support.shipped_profiles import HELPER_PROFILES, WORKER_PROFILES, WORKER_RULES
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE

MERGER = next(profile for profile in HELPER_PROFILES if profile.name == f"{MERGER_PROFILE.name}")
PLAN_REVIEWER = next(profile for profile in HELPER_PROFILES if profile.name == f"{PLAN_REVIEWER_PROFILE.name}")


def test_the_merger_gets_a_new_session_at_each_launch():
    assert MERGER.occupant is Occupant.LAUNCH_ROTATION


def test_the_merger_is_told_to_read_its_memories_and_to_write_one_after_each_advice():
    assert all(phrase in MERGER.body for phrase in ("journal memory list", "journal memory make", "one memory"))


def test_the_merger_keeps_its_program_choice():
    assert (MERGER.model, MERGER.codex_model) == ("sonnet", "gpt-6.1-sol")


def test_the_plan_reviewer_gets_a_new_session_at_each_launch_and_is_told_to_write_no_memories():
    assert PLAN_REVIEWER.occupant is Occupant.LAUNCH_ROTATION
    assert "Write no memories" in PLAN_REVIEWER.body


def test_no_shipped_worker_text_names_a_program_of_one_project():
    skill = (Path(__file__).resolve().parents[5] / "src/suites/coding/modules/workers/skills/journal-worker/SKILL.md").read_text() + (Path(__file__).resolve().parents[5] / "src/suites/coding/modules/workers/skills/journal-dispatching-workers/SKILL.md").read_text()
    shipped = [*(profile.body for profile in (*HELPER_PROFILES, *WORKER_PROFILES)), *WorkerDriver.opening_lines, WORKER_COMMANDS, WORKER_RULES, skill]
    assert not [text for text in shipped if "python3" in text]


def test_the_rules_every_worker_reads_name_journal_worker_update():
    assert "journal worker update" in WORKER_RULES


def test_the_merger_prompt_names_the_commands_for_a_worktree_behind_its_base():
    assert all(command in MERGER.body for command in ("journal merger behind <worker>", "journal merger leave <worker> --why", "journal merger update <worker> --why", "journal merger pass <worker>"))
