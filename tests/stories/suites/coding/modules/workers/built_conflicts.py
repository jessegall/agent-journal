import pytest

from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.web_build import BUILT_FILE, BUILT_TEXT, build_repository
from tests.stories.support.story_checks import expect_absent_exists_folder_repository


pytestmark = pytest.mark.real_git

HASHED_FILE = "app/web/dist/Chat-CD-8c9Cq.mjs"


def test_a_rename_clash_in_built_files_is_deleted_and_rebuilt(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = build_repository(story)
    worker = dispatched_worker(story)
    folder = repository.worktree_folder(worker.id)
    worker_file = "app/web/dist/worker.js"
    branch_file = "app/web/dist/branch.js"
    expect_returncode_git_repository(repository, "mv", BUILT_FILE, worker_file, folder, 0)
    repository.changed(worker.id, worker_file, "const total = 2;\n" + "const total = 1;\n" * 29)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart story"', actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    expect_returncode_git_repository_3(repository, "mv", BUILT_FILE, branch_file, 0)
    repository.committed(branch_file, "const total = 3;\n" + "const total = 1;\n" * 29, "Rename the branch build")
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, BUILT_FILE, BUILT_TEXT)
    expect_absent_exists_folder_repository(repository, worker_file)
    expect_absent_exists_folder_repository(repository, branch_file)
    expect_stdout_git_repository(repository, "status", "--porcelain", "")


def test_a_hand_in_that_deletes_built_files_whose_sources_stay_is_refused_with_the_build_to_run(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = build_repository(story)
    (repository.folder / "app/web/src").mkdir()
    repository.committed("app/web/src/chat.vue", "<template />\n", "The source of the built file")
    worker = dispatched_worker(story)
    expect_returncode_git_repository_2(repository, "rm", BUILT_FILE, repository.worktree_folder(worker.id), 0)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart story"', actor=worker)
    story.expect_refusal("worker deliver --wait --differences none", f"it deletes 1 built files under web/dist while their sources stay, such as {BUILT_FILE}", actor=worker)
    story.expect_refusal("worker deliver --wait --differences none", "npm --prefix src/viewer run build", actor=worker)


def hashed_build_handed_in(story):
    repository = build_repository(story)
    repository.committed(HASHED_FILE, "const first = 1;\n", "A built file with a hash in its name")
    (repository.folder / "app/web/src").mkdir()
    repository.committed("app/web/src/chat.vue", "<template />\n", "The source of the built file")
    worker = dispatched_worker(story)
    expect_returncode_git_repository_2(repository, "rm", HASHED_FILE, repository.worktree_folder(worker.id), 0)
    return repository, worker


def test_a_built_file_that_came_back_under_a_new_hash_is_a_rebuild(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository, worker = hashed_build_handed_in(story)
    repository.changed(worker.id, "app/web/dist/Chat-Xy-1b2c3.js", "export const other = 2;\n" * 40)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart story"', actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)


def test_a_built_file_with_a_hash_that_did_not_come_back_is_refused(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository, worker = hashed_build_handed_in(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.run_listeners()
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart story"', actor=worker)
    story.expect_refusal("worker deliver --wait --differences none", f"such as {HASHED_FILE}", actor=worker)


@pytest.mark.parametrize("length", [7, 8])
def test_a_merge_refuses_markers_in_a_committed_file(new_story, length):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    folder = repository.worktree_folder(worker.id)
    repository.changed(worker.id, "cart.py", "<" * length + " branch\nTOTAL = 9\n")
    expect_returncode_git_repository_2(repository, "add", "cart.py", folder, 0)
    expect_returncode_git_repository(repository, "commit", "-m", "A marked file", folder, 0)
    repository.checkout(ENVIRONMENT_BRANCH)
    base = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge --wait {worker.id}", "conflict markers remain in cart.py", actor=story.agent)
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base)


@pytest.mark.parametrize("exit_code,reason", [(1, "the web build failed"), (0, "the web build produced no files")])
def test_a_failed_or_empty_build_leaves_the_environment_branch_unchanged(new_story, exit_code, reason):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = build_repository(story)
    worker = dispatched_worker(story)
    base = repository.tip(ENVIRONMENT_BRANCH)
    repository.changed(worker.id, BUILT_FILE, "a changed build\n")
    repository.changed(worker.id, "src/viewer/build.cjs", f"process.exit({exit_code});\n")
    story.expect_success('proof make 1 --task 1 "build.cjs:1, the build story"', actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    story.expect_refusal(f"worker merge --wait {worker.id}", reason, actor=story.agent)
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base)


def expect_returncode_git_repository(repository, text, text_2, text_3, folder, expected) -> None:
    actual = repository.git(text, text_2, text_3, folder=folder).returncode
    assert actual == expected, actual


def expect_returncode_git_repository_2(repository, text, text_2, folder, expected) -> None:
    actual = repository.git(text, text_2, folder=folder).returncode
    assert actual == expected, actual


def expect_stdout_git_repository(repository, text, text_2, expected) -> None:
    actual = repository.git(text, text_2).stdout.strip()
    assert actual == expected, actual


def expect_returncode_git_repository_3(repository, text, item, branch_file, expected) -> None:
    actual = repository.git(text, item, branch_file).returncode
    assert actual == expected, actual
