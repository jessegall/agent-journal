from tests.unit.support.declared_merge_builds import declared_merge_builds
import subprocess

from tests.unit.support.plain_executor import plain_executor
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

BASE_BRANCH = "base"
WORKER_BRANCH = "worker-branch"
ENVIRONMENT_BRANCH = BASE_BRANCH


class SampleRepository:
    def __init__(self, folder):
        self.folder = folder

    def git(self, *arguments, folder=None):
        return subprocess.run(["git", "-c", "user.name=Sample", "-c", "user.email=sample@example.com", "-C", str(folder or self.folder), *arguments],
                              capture_output=True, text=True, check=True)

    def committed(self, name, text, message):
        (self.folder / name).write_text(text)
        self.git("add", "-A")
        self.git("commit", "-m", message)

    def tip(self, branch):
        return self.git("rev-parse", branch).stdout.strip()


def worker_checkout(tmp_path):
    repository = SampleRepository(tmp_path / "repository")
    repository.folder.mkdir()
    repository.git("init", "--initial-branch", BASE_BRANCH)
    repository.committed("cart.py", "TOTAL = 0\n", "The cart")
    folder = tmp_path / "worktree"
    repository.git("worktree", "add", "-b", WORKER_BRANCH, str(folder), BASE_BRANCH)
    return repository, folder


def worktree_row(repository, folder, base_commit):
    return Worktree(session_agent_id=1, task_id=1, creator_id=1, folder=str(folder), branch=WORKER_BRANCH, base_branch=BASE_BRANCH, base_commit=base_commit)


def own_commit(repository, folder, name, text):
    (folder / name).write_text(text)
    repository.git("add", "-A", folder=folder)
    repository.git("commit", "-m", f"task 1: {name}", folder=folder)


def test_own_files_leave_out_merged_in_files(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    base_commit = repository.tip(ENVIRONMENT_BRANCH)
    own_commit(repository, folder, "own.py", "OWN = 1\n")
    repository.committed("first.py", "FIRST = 1\n", "The first move")
    repository.git("merge", "--no-edit", ENVIRONMENT_BRANCH, folder=folder)
    repository.committed("second.py", "SECOND = 1\n", "The second move")
    repository.git("merge", "--no-edit", ENVIRONMENT_BRANCH, folder=folder)
    assert list(WorktreeGit(None, plain_executor(), declared_merge_builds()).worker_files(worktree_row(repository, folder, base_commit))) == ["own.py"]


def test_own_files_keep_a_renamed_file(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    base_commit = repository.tip(ENVIRONMENT_BRANCH)
    repository.git("mv", "cart.py", "basket.py", folder=folder)
    repository.git("commit", "-m", "task 1: rename", folder=folder)
    assert "basket.py" in WorktreeGit(None, plain_executor(), declared_merge_builds()).worker_files(worktree_row(repository, folder, base_commit))


def test_own_files_keep_a_name_with_a_space(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    base_commit = repository.tip(ENVIRONMENT_BRANCH)
    own_commit(repository, folder, "my notes.py", "NOTE = 1\n")
    assert list(WorktreeGit(None, plain_executor(), declared_merge_builds()).worker_files(worktree_row(repository, folder, base_commit))) == ["my notes.py"]


def test_own_files_hold_uncommitted_and_untracked_files_once(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    base_commit = repository.tip(ENVIRONMENT_BRANCH)
    own_commit(repository, folder, "own.py", "OWN = 1\n")
    (folder / "own.py").write_text("OWN = 2\n")
    (folder / "new.py").write_text("NEW = 1\n")
    assert WorktreeGit(None, plain_executor(), declared_merge_builds()).worker_files(worktree_row(repository, folder, base_commit)) == ("own.py", "new.py")


def test_own_files_of_a_worker_with_no_work_are_empty(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    assert WorktreeGit(None, plain_executor(), declared_merge_builds()).worker_files(worktree_row(repository, folder, repository.tip(ENVIRONMENT_BRANCH))) == ()
