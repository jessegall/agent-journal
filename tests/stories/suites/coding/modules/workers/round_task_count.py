import pytest
import json


from tests.stories.suites.coding.modules.workers.free_commits import three_committed_worker, two_committed_worker, first_committed_worker  # noqa: F401
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.checkpoint_runs import merge
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.phase_steps import group_worker  # noqa: F401
from tests.stories.suites.coding.modules.workers.support.phase_steps import StoryWorker
from tests.stories.support.story_checks import expect_value

"""A worker's card counts the tasks given to it since its last merge, never those of an earlier merged hand-in."""


def card_task_ids(worker: StoryWorker) -> list[int]:
    cards = json.loads(worker.story.run("agent cards --environment main --show all --limit 100 --json", actor=worker.story.agent).output_text)["rows"]
    card = next(row for row in cards if row["id"] == worker.worker.id)
    return [task["id"] for task in card["facts"]["tasks"]]


def test_a_worker_never_merged_counts_all_its_tasks(first_committed_worker):
    expect_value(card_task_ids(first_committed_worker), [1, 2, 3])


def test_a_worker_starts_again_from_zero_once_its_hand_in_is_merged(three_committed_worker):
    merge(three_committed_worker)
    expect_value(card_task_ids(three_committed_worker), [])
    for title in ("Receipts", "Totals"):
        task_id = three_committed_worker.story.new_row_id(f'task make "{title}" --brief "Print them" --environment main', actor=three_committed_worker.story.agent)
        three_committed_worker.story.expect_success(f"worker send --wait {agent_number(three_committed_worker.story, three_committed_worker.worker.id)} --task {task_id}", actor=three_committed_worker.story.agent)
    expect_value(card_task_ids(three_committed_worker), [4, 5])


@pytest.mark.real_git
def test_a_part_merge_takes_the_merged_tasks_out_of_the_count_and_keeps_the_rest(two_committed_worker):
    two_committed_worker.end_all_tests()
    number = agent_number(two_committed_worker.story, two_committed_worker.worker.id)
    two_committed_worker.repository.checkout(ENVIRONMENT_BRANCH)
    two_committed_worker.story.expect_success(f"worker merge --wait {number} --up-to 1", actor=two_committed_worker.story.agent)
    two_committed_worker.story.run_listeners()
    expect_value(card_task_ids(two_committed_worker), [2, 3])
