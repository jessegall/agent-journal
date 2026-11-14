from pathlib import Path

from tests.stories.suites.coding.modules.workers.support.memory_git.git_story_required import GitStoryRequired
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_commit import MemoryCommit

FIRST_COMMIT_NUMBER = 4096


class MemoryHistory:
    """The commits, branches and checked-out folders of one repository, kept in memory: the root folder and
    every worktree cut from it, each on one branch. The files of a folder stay real files; only commits are
    held here."""

    def __init__(self, root: Path) -> None:
        self.root = root.resolve()
        self.commits: dict[str, MemoryCommit] = {}
        self.branches: dict[str, str] = {}
        self.checked_out: dict[Path, str] = {}
        self.tips: dict[str, str] = {}
        self.stashes: list[str] = []

    def start(self, branch: str, tree: dict[str, str], message: str) -> MemoryCommit:
        first = self.record(tree, message)
        self.branches[branch] = first.id
        self.checked_out[self.root] = branch
        return first

    def record(self, tree: dict[str, str], message: str, *parents: str) -> MemoryCommit:
        commit = MemoryCommit(f"{FIRST_COMMIT_NUMBER + len(self.commits):040x}", parents, dict(tree), message)
        self.commits[commit.id] = commit
        return commit

    def add_commit(self, branch: str, tree: dict[str, str], message: str) -> MemoryCommit:
        commit = self.record(tree, message, self.branches[branch])
        self.branches[branch] = commit.id
        return commit

    def create_branch(self, name: str, base_branch: str) -> None:
        self.branches[name] = self.branches[base_branch]

    def tip(self, branch: str) -> MemoryCommit:
        return self.commits[self.branches[branch]]

    def has_branch(self, branch: str) -> bool:
        return branch in self.branches

    def folder_branch(self, folder: Path) -> str:
        return self.checked_out[folder.resolve()]

    def has_folder(self, folder: Path) -> bool:
        return folder.resolve() in self.checked_out

    def ancestors(self, commit_id: str) -> list[str]:
        reached: list[str] = []
        waiting = [commit_id]
        while waiting:
            reached_id = waiting.pop()
            if reached_id not in reached:
                reached.append(reached_id)
                waiting.extend(self.commits[reached_id].parents)
        return reached

    def is_ancestor(self, older: str, newer: str) -> bool:
        return older in self.ancestors(newer)

    def merge_base(self, first: str, second: str) -> str:
        shared = [commit for commit in self.ancestors(first) if commit in self.ancestors(second)]
        return max(shared, key=lambda commit: int(commit, 16))

    def new_commits(self, base: str, tip: str) -> list[MemoryCommit]:
        reached = set(self.ancestors(base))
        return sorted((self.commits[commit] for commit in self.ancestors(tip) if commit not in reached), key=lambda commit: int(commit.id, 16))

    def resolves(self, revision: str) -> bool:
        return revision in self.commits

    @staticmethod
    def merged_tree(base_tree: dict[str, str], current_tree: dict[str, str], incoming_tree: dict[str, str]) -> dict[str, str]:
        merged: dict[str, str] = {}
        for name in sorted({*base_tree, *current_tree, *incoming_tree}):
            base_text, current_text, incoming_text = base_tree.get(name), current_tree.get(name), incoming_tree.get(name)
            if current_text == incoming_text or base_text == incoming_text:
                merged_text = current_text
            elif base_text == current_text:
                merged_text = incoming_text
            else:
                raise GitStoryRequired(f"{name} was changed on both sides: a story about merge conflicts builds its repository with real git")
            if merged_text is not None:
                merged[name] = merged_text
        return merged
