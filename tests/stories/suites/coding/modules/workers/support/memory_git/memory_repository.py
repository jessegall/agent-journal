import shutil
import subprocess
from pathlib import Path

from tests.stories.suites.coding.modules.workers.support.git_repository import CHECKOUT_BRANCH, ENVIRONMENT_BRANCH, WORKER_BRANCHES, GitRepository
from tests.stories.suites.coding.modules.workers.support.memory_git.git_story_required import GitStoryRequired
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_folder import MemoryFolder
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_history import MemoryHistory
from tests.stories.suites.coding.modules.workers.support.memory_git.tree_changes import TreeChanges

IGNORED_FIRST = ".journal\n"


class MemoryRepository(GitRepository):
    """The repository of a story that is not about git: the same folders, branches and checks as GitRepository,
    kept in a MemoryHistory so no git program runs. A check only git can answer raises GitStoryRequired."""

    def __init__(self, folder: Path, history: MemoryHistory) -> None:
        super().__init__(folder)
        self.history = history

    @classmethod
    def sample(cls, folder: Path) -> "MemoryRepository":
        shutil.rmtree(folder, ignore_errors=True)
        folder.mkdir(parents=True)
        (folder / ".gitignore").write_text(IGNORED_FIRST)
        history = MemoryHistory(folder)
        first = history.start(CHECKOUT_BRANCH, {".gitignore": IGNORED_FIRST}, "The first commit")
        history.create_branch(ENVIRONMENT_BRANCH, CHECKOUT_BRANCH)
        history.add_commit(ENVIRONMENT_BRANCH, {**first.tree, "cart.py": "TOTAL = 0\n"}, "The cart")
        return cls(folder, history)

    def files(self, folder: Path | None = None) -> MemoryFolder:
        return MemoryFolder(self.history.root, folder or self.folder)

    def uncommitted_names(self, folder: Path) -> tuple[str, ...]:
        committed = self.history.tip(self.history.folder_branch(folder)).tree
        return TreeChanges(committed, self.files(folder).file_texts()).names()

    def git(self, *arguments: str, folder: Path | None = None) -> subprocess.CompletedProcess[str]:
        raise GitStoryRequired(f"git {' '.join(arguments)} is a check only real git answers: this story builds its repository with real git")

    def committed(self, name: str, text: str, message: str) -> None:
        (self.folder / name).write_text(text)
        branch = self.history.folder_branch(self.folder)
        self.history.add_commit(branch, {**self.history.tip(branch).tree, name: text}, message)

    def checkout(self, branch: str) -> None:
        old = self.history.tip(self.history.folder_branch(self.folder)).tree
        new = self.history.tip(branch).tree
        self.files().write({name: text for name, text in new.items() if old.get(name) != text}, tuple(name for name in old if name not in new))
        self.history.checked_out[self.history.root] = branch

    def tip(self, branch: str) -> str:
        return self.history.branches.get(branch, "")

    def expect_file(self, branch: str, name: str, text: str) -> None:
        content = self.history.tip(branch).tree.get(name, "")
        assert content == text, f"{name} on {branch} holds {content!r}, not {text!r}"

    def expect_merge_commit(self, branch: str) -> None:
        parents = self.history.tip(branch).parents
        assert len(parents) == 2, f"the last commit of {branch} is no merge: its parents are {parents}"

    def expect_merge_commits_after(self, branch: str, commit: str, count: int) -> None:
        merges = [made for made in self.history.new_commits(commit, self.history.branches[branch]) if len(made.parents) == 2]
        assert len(merges) == count, f"{branch} holds {len(merges)} merge commits after {commit}, not {count}"

    def expect_no_stash(self) -> None:
        assert not self.history.stashes, f"a stash was left: {self.history.stashes}"

    def expect_commit(self, branch: str, *message_lines: str) -> None:
        message = self.history.tip(branch).message.splitlines()
        missing = [line for line in message_lines if line not in message]
        assert not missing, f"the last commit of {branch} has no line {missing}: {message}"

    def expect_clean(self, worker_id: int) -> None:
        names = self.uncommitted_names(self.worktree_folder(worker_id))
        assert not names, f"the worktree of worker {worker_id} holds uncommitted changes: {names}"

    def expect_head(self, branch: str, folder: Path | None = None) -> None:
        head = self.history.folder_branch(folder or self.folder)
        assert head == branch, f"{folder or self.folder} has {head!r} checked out, not {branch}"

    def expect_no_worktree(self) -> None:
        branches = [name for name in self.history.branches if name.startswith(WORKER_BRANCHES.removesuffix("*"))]
        worktrees = [path for path in self.history.checked_out if path != self.history.root]
        folders = list((self.folder / ".journal" / "worktrees").glob("*/*"))
        assert (branches, worktrees, folders) == ([], [], []), f"a worktree was left: branches {branches}, worktrees {worktrees}, folders {folders}"

    def expect_excluded(self, worker_id: int, name: str) -> None:
        files = self.files(self.worktree_folder(worker_id))
        assert files.hides(name, files.patterns()) and name not in files.file_texts(), f"git sees {name} in {files.folder}"

    def expect_root_exclude_unchanged(self) -> None:
        exclude_file = self.files().exclude_file()
        text = exclude_file.read_text() if exclude_file.exists() else ""
        assert "/node_modules" not in text and "/vendor" not in text, f"the root checkout's own exclude file was changed: {text}"
