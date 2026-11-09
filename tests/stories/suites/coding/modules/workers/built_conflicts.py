import pytest

from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.web_build import BUILT_FILE, BUILT_TEXT, build_repository
pytestmark = pytest.mark.real_git

HASHED_FILE = "app/web/dist/Chat-CD-8c9Cq.mjs"


def test_a_hand_in_that_deletes_built_files_whose_sources_stay_is_refused_with_the_build_to_run(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = build_repository(story)
    (repository.folder / "app/web/src").mkdir()
    repository.committed("app/web/src/chat.vue", "<template />\n", "The source of the built file")
    worker = dispatched_worker(story)
    expect_returncode_git_repository_2(repository, "rm", BUILT_FILE, repository.worktree_folder(worker.id), 0)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart story"', actor=worker)
    story.expect_refusal("worker deliver --wait --differences none", f"it deletes 1 built files under web/dist while their sources stay, such as {BUILT_FILE}", actor=worker)
    story.expect_refusal("worker deliver --wait --differences none", "npm --prefix src/viewer run build", actor=worker)


def expect_returncode_git_repository_2(repository, text, text_2, folder, expected) -> None:
    actual = repository.git(text, text_2, folder=folder).returncode
    assert actual == expected, actual
