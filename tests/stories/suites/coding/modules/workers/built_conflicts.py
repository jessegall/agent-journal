import pytest

from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.web_build import BUILT_FILE, BUILT_TEXT, build_repository


def test_a_rename_clash_in_built_files_is_deleted_and_rebuilt(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = build_repository(story)
    worker = dispatched_worker(story)
    folder = repository.worktree_folder(worker.id)
    worker_file = "app/web/dist/worker.js"
    branch_file = "app/web/dist/branch.js"
    assert repository.git("mv", BUILT_FILE, worker_file, folder=folder).returncode == 0
    repository.changed(worker.id, worker_file, "const total = 2;\n" + "const total = 1;\n" * 29)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 "cart.py:1, the cart story"', actor=worker)
    story.expect_success("worker deliver", actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    assert repository.git("mv", BUILT_FILE, branch_file).returncode == 0
    repository.committed(branch_file, "const total = 3;\n" + "const total = 1;\n" * 29, "Rename the branch build")
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, BUILT_FILE, BUILT_TEXT)
    assert not (repository.folder / worker_file).exists()
    assert not (repository.folder / branch_file).exists()
    assert repository.git("status", "--porcelain").stdout.strip() == ""


@pytest.mark.parametrize("length", [7, 8])
def test_a_merge_refuses_markers_in_a_committed_file(new_story, length):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    folder = repository.worktree_folder(worker.id)
    repository.changed(worker.id, "cart.py", "<" * length + " branch\nTOTAL = 9\n")
    assert repository.git("add", "cart.py", folder=folder).returncode == 0
    assert repository.git("commit", "-m", "A marked file", folder=folder).returncode == 0
    repository.checkout(ENVIRONMENT_BRANCH)
    base = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "conflict markers remain in cart.py", actor=story.agent)
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base)


@pytest.mark.parametrize("exit_code,reason", [(1, "the web build failed"), (0, "the web build produced no files")])
def test_a_failed_or_empty_build_leaves_the_environment_branch_unchanged(new_story, exit_code, reason):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = build_repository(story)
    worker = dispatched_worker(story)
    base = repository.tip(ENVIRONMENT_BRANCH)
    repository.changed(worker.id, BUILT_FILE, "a changed build\n")
    repository.changed(worker.id, "src/viewer/build.cjs", f"process.exit({exit_code});\n")
    story.expect_success('proof make 1 "build.cjs:1, the build story"', actor=worker)
    story.expect_success("worker deliver", actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_refusal(f"worker merge {worker.id}", reason, actor=story.agent)
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, base)
