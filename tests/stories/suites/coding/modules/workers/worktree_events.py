import shutil
import sys

import pytest

from tests.stories.core.modules.plugins.support.event_stories import REFUSAL, EventWorkerStarted, data_row, event_plugin_story, plugin_data, script_calls
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, DISPATCH, FIRST_PROOF, dispatched_worker, expect_clean_environment, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import CHECKOUT_BRANCH, ENVIRONMENT_BRANCH

WORKTREE_CUT = "suites.coding.workers.worker_worktree.cut"
WORKTREE_CREATED = "suites.coding.workers.worker_worktree.created"
RULES = ".commandments/rules.md"
RULES_TEXT = "the rules\n"
CHANGED_RULES_TEXT = "the rules, changed on the branch\n"
READ_FOLDER = f"""folder=$(printf '%s' "$line" | '{sys.executable}' -c 'import json, sys; print(json.load(sys.stdin)["data"]["row"]["folder"])')"""
HIDE_COMMANDMENTS = f"""{READ_FOLDER}
cd "$folder" || exit 4
'{shutil.which("git")}' ls-files .commandments | xargs '{shutil.which("git")}' update-index --skip-worktree --
rm -rf .commandments"""
FOLDER_THERE = f"""{READ_FOLDER}
if [ -d "$folder" ]; then touch "$JOURNAL_PLUGIN_DATA/folder-was-there"; fi"""


@pytest.fixture
def hiding_story(new_story):
    story = event_plugin_story(new_story, {"event": WORKTREE_CUT, "commit": "hide.sh"}, scripts={"hide.sh": HIDE_COMMANDMENTS}, fixture=EventWorkerStarted)
    story.repository = repository_environment(story)
    story.repository.checkout(ENVIRONMENT_BRANCH)
    (story.repository.folder / ".commandments").mkdir()
    story.repository.committed(RULES, RULES_TEXT, "The rules")
    story.repository.checkout(CHECKOUT_BRANCH)
    story.worker = dispatched_worker(story, DISPATCH)
    story.run_listeners()
    return story


def hand_in(story, worker) -> None:
    story.repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)


def test_s36_a_plugin_hides_a_tracked_folder_from_a_worktree_and_the_branch_keeps_it_whole(hiding_story):
    story, repository, worker = hiding_story, hiding_story.repository, hiding_story.worker
    story.expect_rows(len(script_calls(story, "hide.sh")) == 1, not (repository.worktree_folder(worker.id) / ".commandments").exists())
    repository.expect_clean(worker.id)
    hand_in(story, worker)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, RULES, RULES_TEXT)


def test_s36_the_branch_changes_the_hidden_folder_during_the_work_and_the_delivery_rebases(hiding_story):
    story, repository, worker = hiding_story, hiding_story.repository, hiding_story.worker
    story.expect_rows(len(script_calls(story, "hide.sh")) == 1)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed(RULES, CHANGED_RULES_TEXT, "The rules change")
    hand_in(story, worker)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, RULES, CHANGED_RULES_TEXT)


def test_s37_a_guard_on_a_new_worktree_refuses_and_nothing_stays(new_story):
    story = event_plugin_story(new_story, {"event": WORKTREE_CREATED, "guard": "refuse.sh"}, fixture=EventWorkerStarted)
    repository = repository_environment(story)
    story.expect_refusal(DISPATCH, REFUSAL, actor=story.agent)
    expect_clean_environment(story, repository)


def test_s38_the_commit_payload_on_cut_holds_the_folder_and_branch_and_the_folder_is_there(new_story):
    story = event_plugin_story(new_story, {"event": WORKTREE_CUT, "commit": "folder.sh"}, scripts={"folder.sh": FOLDER_THERE}, fixture=EventWorkerStarted)
    repository = repository_environment(story)
    worker = dispatched_worker(story, DISPATCH)
    story.run_listeners()
    calls = script_calls(story, "folder.sh")
    story.expect_rows(len(calls) == 1, plugin_data(story, "folder-was-there").exists())
    story.expect_rows(data_row(calls[0])["folder"] == str(repository.worktree_folder(worker.id)), data_row(calls[0])["branch"] == repository.worker_branch(worker.id))
