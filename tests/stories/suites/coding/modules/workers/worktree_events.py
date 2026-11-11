from tests.stories.suites.coding.modules.workers.support.commit_command import asked_for_merge
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.core.support.agent_labels import agent_number
import shutil
import sys

import pytest

from tests.stories.core.modules.plugins.support.event_stories import REFUSAL, EventWorkerStarted, data_row, event_plugin_story, plugin_data, plugin_row, script_calls
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, FIRST_PROOF, dispatched_worker, expect_clean_environment, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import CHECKOUT_BRANCH, ENVIRONMENT_BRANCH


pytestmark = pytest.mark.real_git

WORKTREE_CUT = "suites.coding.workers.worker_worktree.cut"
WORKTREE_DELIVER = "suites.coding.workers.worker_worktree.deliver"
WORKTREE_MERGE = "suites.coding.workers.worker_worktree.merge"
WORKTREE_REMOVAL_EVENT = "suites.coding.workers.worker_worktree.remove"
WORKTREE_CREATED = "suites.coding.workers.worker_worktree.created"
RULES = ".commandments/rules.md"
RULES_TEXT = "the rules\n"
CHANGED_RULES_TEXT = "the rules, changed on the branch\n"
READ_FOLDER = f"""folder=$(printf '%s' "$line" | '{sys.executable}' -c 'import json, sys; print(json.load(sys.stdin)["data"]["row"]["folder"])')"""
HIDE_COMMANDMENTS = f"""{READ_FOLDER}
cd "$folder" || exit 4
'{shutil.which("git")}' ls-files .commandments | xargs '{shutil.which("git")}' update-index --skip-worktree --
rm -rf .commandments"""
RESTORE_RULES_SCRIPT = f"""{READ_FOLDER}
cd "$folder" || exit 4
'{shutil.which("git")}' ls-files .commandments | xargs '{shutil.which("git")}' update-index --no-skip-worktree --
'{shutil.which("git")}' checkout -- .commandments"""
CHECK_FOLDER_SCRIPT = f"""{READ_FOLDER}
if [ -d "$folder" ]; then touch "$JOURNAL_PLUGIN_DATA/folder-was-there"; fi"""


def story_with_hidden_rules(new_story, *extra_entries, **extra_scripts):
    story = event_plugin_story(new_story, {"event": WORKTREE_CUT, "commit": "hide.sh"}, *extra_entries, scripts={"hide.sh": HIDE_COMMANDMENTS, **extra_scripts}, fixture=EventWorkerStarted)
    story.repository = repository_environment(story)
    story.repository.checkout(ENVIRONMENT_BRANCH)
    (story.repository.folder / ".commandments").mkdir()
    story.repository.committed(RULES, RULES_TEXT, "The rules")
    story.repository.checkout(CHECKOUT_BRANCH)
    story.worker = dispatched_worker(story, DISPATCH)
    story.run_listeners()
    return story


@pytest.fixture
def hiding_story(new_story):
    return story_with_hidden_rules(new_story)


@pytest.fixture
def lifting_story(new_story):
    story = story_with_hidden_rules(new_story, {"event": WORKTREE_DELIVER, "commit": "lift.sh"}, **{"lift.sh": RESTORE_RULES_SCRIPT})
    delivery_line(story)
    story.run_listeners()
    return story


def delivery_line(story) -> None:
    story.repository.changed(story.worker.id, "cart.py", "TOTAL = 1\n")
    story.expect_success(FIRST_PROOF, "point: 1", actor=story.worker)
    story.expect_success(COMMIT, actor=story.worker)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.expect_success(f"worker logs {agent_number(story, story.worker.id)}", actor=story.agent)


def worktree_state(story) -> tuple[str, str, bool]:
    folder = story.repository.worktree_folder(story.worker.id)
    marks = story.repository.git("ls-files", "-v", ".commandments", folder=folder).stdout
    return marks, story.repository.git("status", "--porcelain", folder=folder).stdout, (folder / ".commandments").exists()


def test_s36_a_plugin_hides_a_tracked_folder_from_a_worktree(hiding_story):
    story, repository, worker = hiding_story, hiding_story.repository, hiding_story.worker
    story.expect_rows(len(script_calls(story, "hide.sh")) == 1, not (repository.worktree_folder(worker.id) / ".commandments").exists())
    repository.expect_clean(worker.id)


def test_s36_a_commit_script_on_the_delivery_lifts_the_mark_and_restores_the_folder(lifting_story):
    story, repository, worker = lifting_story, lifting_story.repository, lifting_story.worker
    story.expect_rows(worktree_state(story) == (f"H {RULES}\n", "", True), plugin_row(story).fault_count == 0)
    repository.checkout(ENVIRONMENT_BRANCH)
    asked_for_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, RULES, RULES_TEXT)


def removal_story(new_story):
    story = event_plugin_story(new_story, {"event": WORKTREE_REMOVAL_EVENT, "commit": "see.sh"}, fixture=EventWorkerStarted)
    story.repository = repository_environment(story)
    story.worker = dispatched_worker(story, DISPATCH)
    return story


@pytest.fixture
def removable(new_story):
    return removal_story(new_story)



def test_a_removal_event_fires_when_a_merge_removes_the_worktree(removable):
    story = removable
    delivery_line(story)
    story.repository.checkout(ENVIRONMENT_BRANCH)
    asked_for_merge(story, story.worker)
    story.expect_success(f"worker merge --wait {agent_number(story, story.worker.id)}", actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1)


def test_a_removal_event_fires_when_a_worker_is_released(removable):
    story = removable
    story.expect_success(f'worker release {agent_number(story, story.worker.id)} "not needed"', actor=story.agent)
    story.run_listeners()
    calls = script_calls(story, "see.sh")
    story.expect_rows(len(calls) == 1, data_row(calls[0])["folder"] == str(story.repository.worktree_folder(story.worker.id)))


def test_s37_a_guard_on_a_new_worktree_refuses_and_nothing_stays(new_story):
    story = event_plugin_story(new_story, {"event": WORKTREE_CREATED, "guard": "refuse.sh"}, fixture=EventWorkerStarted)
    repository = repository_environment(story)
    story.expect_refusal(DISPATCH, REFUSAL, actor=story.agent)
    expect_clean_environment(story, repository)
