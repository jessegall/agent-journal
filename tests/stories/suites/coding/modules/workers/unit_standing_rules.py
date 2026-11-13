from pathlib import Path

from suites.coding.modules.workers.support.worker_command import WORK_STEPS
from suites.coding.support.profile_commands import WORKER_COMMANDS
from suites.coding.support.shipped_profiles import WORKER_RULES
from tests.stories.suites.coding.modules.workers.checkpoint_runs import merge
from tests.stories.suites.coding.modules.workers.free_commits import REQUEST_MERGE
from tests.stories.suites.coding.modules.workers.merge_asks import committed_list
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, single_task_worker

"""Book I of doc 1252: what stays, and the standing rules."""

SKILL = Path(__file__).resolve().parents[6] / "src/suites/coding/modules/workers/skills/journal-worker/SKILL.md"


def test_88_a_unit_of_one_merges_as_before(new_story, monkeypatch):
    worker = single_task_worker(new_story, monkeypatch)
    worker.prove_commit(TEST_LINE)
    worker.end_all_tests()
    merge(worker)
    worker.story.expect_text("task show 1", "state: completed", actor=worker.story.agent)


def test_91_the_merges_of_a_list_are_its_asks(new_story, monkeypatch):
    worker = committed_list(new_story, monkeypatch)
    worker.story.expect_success(REQUEST_MERGE, actor=worker.worker)
    merge(worker)
    merged = [line for line in worker.main_agent_lines() if "merge-ask:" in line]
    worker.story.expect_rows(len(merged) == 1, detail=str(worker.main_agent_lines()))


def test_92_the_words_agree_with_the_behaviour(new_story):
    story = new_story()
    skill = SKILL.read_text()
    texts = (WORKER_RULES, WORKER_COMMANDS, WORK_STEPS)
    story.expect_rows(all("journal worker ask-merge" in text for text in texts), not any("journal worker deliver" in text for text in texts),
                      not any("is final" in text for text in texts), "is final" not in skill)


def test_89_and_90_a_commit_of_a_unit_of_one_keeps_its_checks(new_story, monkeypatch):
    worker = single_task_worker(new_story, monkeypatch)
    worker.story.expect_refusal("worker commit --wait --differences none", "nothing is staged", actor=worker.worker)
