import json

import pytest

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.checkpoint_runs import merge
from tests.stories.suites.coding.modules.workers.free_commits import commit_each
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.phase_steps import StoryWorker, unplanned_group_worker
from tests.stories.support.story_checks import expect_value

"""A worker's card counts the tasks given to it since its last merge, never those of an earlier merged hand-in."""


def card_task_ids(worker: StoryWorker) -> list[int]:
    cards = json.loads(worker.story.run("agent cards --environment main --show all --limit 100 --json", actor=worker.story.agent).output_text)["rows"]
    card = next(row for row in cards if row["id"] == worker.worker.id)
    return [task["id"] for task in card["facts"]["tasks"]]


def test_a_worker_never_merged_counts_all_its_tasks(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_each(worker, tuple([1]))
    expect_value(card_task_ids(worker), [1, 2, 3])


def test_a_worker_starts_again_from_zero_once_its_hand_in_is_merged(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_each(worker, (1, 2, 3))
    merge(worker)
    expect_value(card_task_ids(worker), [])
    for title in ("Receipts", "Totals"):
        task_id = worker.story.new_row_id(f'task make "{title}" --brief "Print them" --environment main', actor=worker.story.agent)
        worker.story.expect_success(f"worker send --wait {agent_number(worker.story, worker.worker.id)} --task {task_id}", actor=worker.story.agent)
    expect_value(card_task_ids(worker), [4, 5])


@pytest.mark.real_git
def test_a_part_merge_takes_the_merged_tasks_out_of_the_count_and_keeps_the_rest(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    commit_each(worker, (1, 2))
    worker.end_all_tests()
    number = agent_number(worker.story, worker.worker.id)
    worker.repository.checkout(ENVIRONMENT_BRANCH)
    worker.story.expect_success(f"worker merge --wait {number} --up-to 1", actor=worker.story.agent)
    worker.story.run_listeners()
    expect_value(card_task_ids(worker), [2, 3])
