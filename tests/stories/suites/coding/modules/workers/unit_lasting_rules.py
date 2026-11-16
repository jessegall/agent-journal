from tests.stories.suites.coding.modules.workers.merge_asks import committed_worker  # noqa: F401
from tests.stories.suites.coding.modules.workers.support.phase_steps import single_worker  # noqa: F401
from pathlib import Path

from tests.stories.suites.coding.modules.workers.checkpoint_runs import merge
from tests.stories.suites.coding.modules.workers.free_commits import REQUEST_MERGE
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE

"""Book I of doc 1252: what stays, and the rules that hold throughout."""

SKILL = Path(__file__).resolve().parents[6] / "src/suites/coding/modules/workers/skills/journal-worker/SKILL.md"


def test_88_a_unit_of_one_merges_as_before(single_worker):
    single_worker.prove_commit(TEST_LINE)
    single_worker.end_all_tests()
    merge(single_worker)
    single_worker.story.expect_text("task show 1", "state: completed", actor=single_worker.story.agent)


def test_91_the_merges_of_a_list_are_its_asks(committed_worker):
    committed_worker.story.expect_success(REQUEST_MERGE, actor=committed_worker.worker)
    merge(committed_worker)
    merged = [line for line in committed_worker.main_agent_lines() if "merge-ask:" in line]
    committed_worker.story.expect_rows(len(merged) == 1, detail=str(committed_worker.main_agent_lines()))


def test_89_and_90_a_commit_of_a_unit_of_one_keeps_its_checks(single_worker):
    single_worker.story.expect_refusal("worker commit --wait --differences none", "nothing is staged", actor=single_worker.worker)
