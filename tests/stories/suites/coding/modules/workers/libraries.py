from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, expect_clean_environment, repository_environment
LIBRARY_FILE = "index.js"
LIBRARY_TEXT = "module.exports = 1\n"


def test_a_folder_named_to_link_is_a_link_to_the_environments_folder_that_git_never_sees(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    repository.library("node_modules", LIBRARY_FILE, LIBRARY_TEXT)
    worker_id = dispatched_worker(story, f"{DISPATCH} --library-link node_modules").id
    repository.expect_link(worker_id, "node_modules")
    repository.expect_excluded(worker_id, "node_modules")
    repository.expect_root_exclude_unchanged()


def test_a_folder_the_environment_copies_is_a_copy_in_the_worktree_that_git_never_sees(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    repository.library("vendor", LIBRARY_FILE, LIBRARY_TEXT)
    story.expect_success("""setting make workers.library-copies '["vendor"]' --environment main""", "key: workers.library-copies")
    worker_id = dispatched_worker(story).id
    repository.expect_copy(worker_id, "vendor", LIBRARY_FILE, LIBRARY_TEXT)
    repository.expect_excluded(worker_id, "vendor")
    repository.expect_root_exclude_unchanged()


def test_a_library_name_that_is_no_folder_inside_the_environments_folder_is_refused_and_makes_nothing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.expect_refusal(f"{DISPATCH} --library-link node_modules", f"node_modules is no folder in {repository.folder}", actor=story.agent)
    story.expect_refusal(f"{DISPATCH} --library-copy ..", f".. is no folder in {repository.folder}", actor=story.agent)
    expect_clean_environment(story, repository)


def test_a_library_copy_that_fails_leaves_no_worktree_and_no_branch(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    repository.library("vendor", LIBRARY_FILE, LIBRARY_TEXT)
    (repository.folder / "vendor" / LIBRARY_FILE).chmod(0)
    story.expect_success("""setting make workers.library-copies '["vendor"]' --environment main""", "key: workers.library-copies")
    outcome = story.run(DISPATCH, actor=story.agent)
    (repository.folder / "vendor" / LIBRARY_FILE).chmod(0o644)
    story.expect_rows(outcome.code != 0)
    expect_clean_environment(story, repository)
