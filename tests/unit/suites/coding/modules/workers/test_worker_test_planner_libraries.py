from types import SimpleNamespace

from suites.coding.modules.workers.support.worker_test_planner import WorkerTestPlanner

TEST_CHECKOUT = "/project/.journal/worktrees/main-tests/worker-7"
RUNNING_FOLDER = "/project/.journal/worktrees/main-tests/worker-8"


class Git:
    """Makes the test checkout of a worktree at the path a real one has, and names the running one's folder."""

    def test_checkout(self, worktree: object) -> str:
        return TEST_CHECKOUT

    def test_folder(self, worktree: object) -> str:
        return RUNNING_FOLDER


class Libraries:
    """Records the checkouts given the worktree's library copies and links."""

    def __init__(self) -> None:
        self.given: list[str] = []

    def worker_checkout(self, worktree: object, folder: str) -> str:
        self.given.append(folder)
        return folder


def planner(libraries: Libraries) -> WorkerTestPlanner:
    return WorkerTestPlanner(None, None, None, Git(), None, None, None, libraries)  # type: ignore[arg-type]


def test_a_new_test_checkout_of_a_worker_is_given_its_library_copies_and_links():
    libraries = Libraries()
    worktree = SimpleNamespace(id=7, merged_at=None)

    folder = planner(libraries).test_folder(worktree, set())  # type: ignore[arg-type]

    assert folder == TEST_CHECKOUT and libraries.given == [TEST_CHECKOUT]


def test_the_folder_of_a_test_still_running_is_left_as_it_is():
    libraries = Libraries()
    worktree = SimpleNamespace(id=8, merged_at=None)

    folder = planner(libraries).test_folder(worktree, {8})  # type: ignore[arg-type]

    assert folder == RUNNING_FOLDER and libraries.given == []
