from pathlib import Path

from suites.coding.modules.workers.commands.commit_worker_work.commit_worker_work_subcommand import CommitWorkerWorkSubcommand
from suites.coding.modules.workers.commands.update_worker.update_worker_subcommand import UpdateWorkerSubcommand
from suites.coding.support.shipped_profiles import WORKER_UNIT_RULES

SKILL = Path("src/suites/coding/modules/workers/skills/journal-worker/SKILL.md")


def test_the_worker_prompt_says_when_to_run_journal_worker_update_and_to_settle_its_clashes():
    assert "journal worker update when you are told your base branch moved, or at a stopping point, never in the middle of an edit" in WORKER_UNIT_RULES
    assert "settle their markers before your next commit" in WORKER_UNIT_RULES


def test_the_workers_skill_names_journal_worker_update():
    text = SKILL.read_text()
    assert "`journal worker update` brings your worktree up to the base branch" in text and "edit no file until it ends" in text


def test_the_update_and_commit_commands_name_the_update_in_their_help():
    assert "brings the worker's worktree up to the base branch" in (UpdateWorkerSubcommand.__doc__ or "")
    assert "journal worker update" in (CommitWorkerWorkSubcommand.__doc__ or "")
