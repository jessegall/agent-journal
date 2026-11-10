import pytest
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, expect_clean_environment, repository_environment
from tests.stories.support.story_checks import expect_command_file, expect_value_without
LIBRARY_FILE = "index.js"
LIBRARY_TEXT = "module.exports = 1\n"


def test_a_folder_named_both_in_the_setting_and_at_dispatch_is_linked_once(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.library("node_modules", LIBRARY_FILE, LIBRARY_TEXT)
    story.expect_success("""setting make journal.suites.coding.workers.library-links '["node_modules"]' --environment main""", "key: journal.suites.coding.workers.library-links")
    worker_id = dispatched_worker(story, f"{DISPATCH} --library-link node_modules").id
    repository.expect_link(worker_id, "node_modules")


def test_a_folder_named_to_link_is_a_link_to_the_environments_folder_that_git_never_sees(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.library("node_modules", LIBRARY_FILE, LIBRARY_TEXT)
    worker_id = dispatched_worker(story, f"{DISPATCH} --library-link node_modules").id
    repository.expect_link(worker_id, "node_modules")
    repository.expect_excluded(worker_id, "node_modules")
    repository.expect_root_exclude_unchanged()


def test_a_program_that_picks_its_own_session_is_bound_to_its_worker_row_by_its_first_hook(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story, "worker dispatch --test-command python=pytest --program codex --model gpt-6.1-sol 1")
    launch_name = story.container.get(Queries).query(Agent).find(worker.id).session
    story.hook("real-codex-session", HookSamples.sample("session_start").with_fields(launch=launch_name, program="codex"))
    expect_session(story, worker, "real-codex-session")


def test_a_library_name_that_is_no_folder_inside_the_environments_folder_is_refused_and_makes_nothing(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_refusal(f"{DISPATCH} --library-link node_modules", f"node_modules is no folder in {repository.folder}", actor=story.agent)
    story.expect_refusal(f"{DISPATCH} --library-copy ..", f".. is no folder in {repository.folder}", actor=story.agent)
    expect_clean_environment(story, repository)


@pytest.mark.real_git
def test_a_launch_worktree_is_given_the_libraries_and_commands_of_the_environment_named_not_of_another_in_its_folder(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    repository.library("node_modules", LIBRARY_FILE, LIBRARY_TEXT)
    repository.library("vendor", LIBRARY_FILE, LIBRARY_TEXT)
    folder = repository.folder / ".claude" / "worktrees" / "cart"
    story.expect_success(f"environment make cart {repository.folder} --branch worktree-cart")
    story.expect_success("""setting make journal.suites.coding.workers.library-links '["vendor"]' --environment main""", "key: journal.suites.coding.workers.library-links")
    story.expect_success("""setting make journal.suites.coding.workers.library-links '["node_modules"]' --environment cart""", "key: journal.suites.coding.workers.library-links")
    story.expect_success("""setting make journal.suites.coding.workers.library-copies '["vendor"]' --environment cart""", "key: journal.suites.coding.workers.library-copies")
    story.expect_success("""setting make journal.suites.coding.workers.worktree-commands '["echo $JOURNAL_BRANCH > prepared.txt"]' --environment cart""",
                         "key: journal.suites.coding.workers.worktree-commands")
    repository.git("worktree", "add", "-b", "worktree-cart", str(folder))
    story.expect_success(f"worktree prepare {folder} {repository.folder} cart", actor=story.user)
    expect_symlink_folder_node(folder, "node_modules")
    expect_resolve_folder_node(folder, "node_modules", (repository.folder / "node_modules").resolve())
    expect_folder_vendor_library(folder, "vendor", LIBRARY_FILE, LIBRARY_TEXT)
    expect_absent_symlink_folder_vendor(folder, "vendor")
    expect_command_file(folder, "prepared.txt", "worktree-cart")
    status = repository.git("status", "--porcelain", "--untracked-files=all", folder=folder).stdout
    expect_value_without(status, "node_modules")
    expect_value_without(status, "vendor")


def test_a_launch_worktree_of_an_environment_that_does_not_exist_is_refused(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_refusal(f"worktree prepare {repository.folder} {repository.folder} nowhere", "no environment named nowhere", actor=story.user)


def expect_folder_vendor_library(folder, text, item, expected) -> None:
    actual = (folder / text / item).read_text()
    assert actual == expected, actual


def expect_absent_symlink_folder_vendor(folder, text) -> None:
    actual = (folder / text).is_symlink()
    assert not actual, actual


def expect_symlink_folder_node(folder, text) -> None:
    actual = (folder / text).is_symlink()
    assert actual, actual


def expect_resolve_folder_node(folder, text, expected) -> None:
    actual = (folder / text).resolve()
    assert actual == expected, actual


def expect_session(story, worker, expected) -> None:
    actual = story.container.get(Queries).query(Agent).find(worker.id).session
    assert actual == expected, actual
