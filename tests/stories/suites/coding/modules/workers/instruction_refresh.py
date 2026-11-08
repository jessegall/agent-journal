import pytest
import os

from core.base.module.module_finder import ModuleFinder
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.instruction_files import PROJECT_TEXT, project_with_instructions, worktree_file_text
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker
from tests.stories.support.story_checks import expect_value

CHANGED = "Work through the notes in this new way."
SECOND_CHANGE = "Work through the notes in yet another way."
CHANGE_PROFILE = f'profile save journal-worker --description "Works on one task" --body "{CHANGED}"'
OLD_TIME = 1_700_000_000


def instruction_tick(story):
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == "worker instruction files"]
    story.expect_rows(len(handlers) == 1)
    handlers[0].handler(story.container)


@pytest.mark.real_git
def test_a_profile_change_reaches_the_instruction_files_at_the_next_task_start_and_at_the_next_tick(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = project_with_instructions(story)
    worker = dispatched_worker(story)
    expect_value(CHANGED not in worktree_file_text(repository, worker, "AGENTS.md"), True)
    story.expect_success(CHANGE_PROFILE, actor=story.user)
    expect_value(CHANGED not in worktree_file_text(repository, worker, "AGENTS.md"), True)
    story.expect_success('task block 1 --reason "waits on a person"', actor=worker)
    story.expect_success("task unblock 1", actor=worker)
    story.expect_success("task start 1", actor=worker)
    expect_value(CHANGED in worktree_file_text(repository, worker, "AGENTS.md"), True)
    story.expect_success(CHANGE_PROFILE.replace(CHANGED, SECOND_CHANGE), actor=story.user)
    expect_value(SECOND_CHANGE not in worktree_file_text(repository, worker, "AGENTS.md"), True)
    instruction_tick(story)
    expect_value(bool(SECOND_CHANGE in worktree_file_text(repository, worker, "AGENTS.md") and SECOND_CHANGE in worktree_file_text(repository, worker, "CLAUDE.md")), True)
    repository.expect_clean(worker.id)


def test_an_instruction_file_that_already_says_the_same_is_not_written_again(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = project_with_instructions(story)
    worker = dispatched_worker(story)
    paths = [repository.worktree_folder(worker.id) / name for name in ("AGENTS.md", "CLAUDE.md")]
    for path in paths:
        os.utime(path, (OLD_TIME, OLD_TIME))
    instruction_tick(story)
    story.expect_rows(all(int(path.stat().st_mtime) == OLD_TIME for path in paths))


def test_with_the_setting_off_the_tick_leaves_the_project_s_instruction_files_alone(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = project_with_instructions(story)
    story.expect_success("setting set journal.suites.coding.workers.worker-instruction-files false --project", actor=story.user)
    worker = dispatched_worker(story)
    story.expect_success(CHANGE_PROFILE, actor=story.user)
    instruction_tick(story)
    expect_value(worktree_file_text(repository, worker, "AGENTS.md"), PROJECT_TEXT)
