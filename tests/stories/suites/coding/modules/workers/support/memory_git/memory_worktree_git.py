import shutil
import subprocess
from collections.abc import Sequence
from pathlib import Path, PurePosixPath

from engine.errors.refusal import Refusal
from engine.enums.file_status import FileStatus
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.task_branch_commit import TaskBranchCommit
from suites.coding.modules.workers.support.worker_folder_runs import WorkerFolderRuns
from suites.coding.modules.workers.support.worktree_changes import WorktreeChanges
from suites.coding.modules.workers.support.worktree_file_change import WorktreeFileChange
from suites.coding.modules.workers.support.worktree_git import BUILT_FOLDER, PUBLISHED_FOLDERS, WorktreeGit
from tests.stories.suites.coding.modules.workers.support.memory_git.git_story_required import GitStoryRequired
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_folder import MemoryFolder
from tests.stories.suites.coding.modules.workers.support.memory_git.memory_history import MemoryHistory
from tests.stories.suites.coding.modules.workers.support.memory_git.tree_changes import TreeChanges


class MemoryWorktreeGit(WorktreeGit):
    """Answers what the workers engine asks of git from a MemoryHistory instead of running git, for the
    stories that are not about git. It follows WorktreeGit step by step; a step it cannot answer, a merge
    conflict or a git command it does not know, raises GitStoryRequired: that story needs real git."""

    def __init__(self, runs: WorkerFolderRuns, history: MemoryHistory) -> None:
        super().__init__(runs)
        self.history = history
        self.skipped: dict[Path, set[str]] = {}

    def test_checkout(self, worktree: Worktree) -> str:
        return worktree.folder

    def base_checkout(self, environment: Environment, name: str) -> str:
        return environment.folder

    @staticmethod
    def base_folder(environment: Environment, name: str) -> str:
        return environment.folder

    def folder_files(self, folder: str | Path) -> MemoryFolder:
        return MemoryFolder(self.history.root, Path(folder))

    def working_tree(self, folder: str | Path) -> dict[str, str]:
        path = Path(folder)
        committed = self.history.tip(self.history.folder_branch(path)).tree
        skipped_texts = {name: committed[name] for name in self.skipped.get(path.resolve(), set()) if name in committed}
        return self.folder_files(path).file_texts(skipped_texts)

    def committed_tree(self, folder: str | Path) -> dict[str, str]:
        return self.history.tip(self.history.folder_branch(Path(folder))).tree

    def uncommitted_names(self, folder: str | Path) -> tuple[str, ...]:
        return TreeChanges(self.committed_tree(folder), self.working_tree(folder)).names()

    def tip(self, folder: str, branch: str) -> str:
        if not self.history.has_branch(branch):
            raise Refusal(f"branch {branch} does not exist in {folder}", "make it there, or name another with journal environment edit <name> --branch <branch>")
        return self.history.branches[branch]

    def cut(self, folder: str, worktree: Worktree, start: str) -> None:
        path = Path(worktree.folder)
        if path.exists() or path.is_symlink():
            self.runs.check_owner(worktree)
            if self.history.has_folder(path):
                raise Refusal(f"a git worktree still exists at {path}", "merge or release its worktree before reusing the folder")
            self.runs.stop(worktree)
            shutil.rmtree(path)
        try:
            self.added_worktree(folder, worktree, start)
        except Refusal:
            self.remove(folder, worktree)
            raise

    def added_worktree(self, folder: str, worktree: Worktree, start: str) -> None:
        if self.history.has_branch(worktree.branch) or not self.history.has_branch(worktree.base_branch):
            raise Refusal(f"git worktree add failed in {folder}", f"branch {worktree.branch} exists or {worktree.base_branch} does not")
        self.history.create_branch(worktree.branch, start)
        path = Path(worktree.folder)
        path.mkdir(parents=True)
        self.folder_files(path).write(self.history.tip(worktree.branch).tree)
        self.history.checked_out[path.resolve()] = worktree.branch

    def commit(self, worktree: Worktree, message: str, trailer: str) -> bool:
        self.refuse_conflicts(worktree)
        tree = self.working_tree(worktree.folder)
        if tree == self.committed_tree(worktree.folder):
            return False
        self.history.add_commit(worktree.branch, tree, f"{message}\n\n{trailer}")
        return True

    def commit_folders(self, folder: str, folders: tuple[str, ...], message: str) -> bool:
        names = self.changed_names(folder, folders)
        if not names:
            return False
        tree = {name: text for name, text in self.committed_tree(folder).items() if name not in names}
        working = self.working_tree(folder)
        self.history.add_commit(self.history.folder_branch(Path(folder)), {**tree, **{name: working[name] for name in names if name in working}}, message)
        return True

    def changed_names(self, folder: str, folders: tuple[str, ...]) -> tuple[str, ...]:
        existing = tuple(name for name in folders if Path(folder, name).exists())
        return tuple(name for name in self.uncommitted_names(folder) if name.split("/")[0] in existing)

    def is_current_branch(self, folder: str, branch: str) -> bool:
        return self.history.has_folder(Path(folder)) and self.history.folder_branch(Path(folder)) == branch

    def head(self, folder: str) -> str:
        return self.history.folder_branch(Path(folder)) if self.history.has_folder(Path(folder)) else ""

    def rebased_commit(self, worktree: Worktree, message: str, trailer: str) -> tuple[str, ...]:
        self.refuse_conflicts(worktree)
        if self.tip(worktree.folder, worktree.base_branch) != worktree.base_commit:
            self.move_onto_base(worktree)
        self.commit(worktree, message, trailer)
        return ()

    def is_merging(self, folder: str) -> bool:
        return False

    def move_onto_base(self, worktree: Worktree) -> None:
        base_tip, branch_tip = self.history.tip(worktree.base_branch), self.history.tip(worktree.branch)
        if self.history.is_ancestor(base_tip.id, branch_tip.id):
            return
        current = base_tip
        for commit in self.history.new_commits(self.history.merge_base(base_tip.id, branch_tip.id), branch_tip.id):
            tree = self.history.merged_tree(self.history.commits[commit.parents[0]].tree, current.tree, commit.tree)
            current = self.history.record(tree, commit.message, current.id)
        self.history.branches[worktree.branch] = current.id
        self.moved_files(worktree.folder, branch_tip.tree, current.tree)

    def moved_files(self, folder: str, old: dict[str, str], new: dict[str, str]) -> None:
        working = self.working_tree(folder)
        rewritten = {name: text for name, text in new.items() if old.get(name) != text}
        removed = tuple(name for name in old if name not in new)
        clashing = [name for name in (*rewritten, *removed) if name in working and working[name] != old.get(name) and working[name] != new.get(name)]
        if clashing:
            raise GitStoryRequired(f"{', '.join(clashing)} changed in the worktree and on its base branch: a story about that builds its repository with real git")
        self.folder_files(folder).write(rewritten, removed)

    def sync(self, worktree: Worktree) -> tuple[str, ...]:
        base_tip, branch_tip = self.history.tip(worktree.base_branch), self.history.tip(worktree.branch)
        if self.history.is_ancestor(base_tip.id, branch_tip.id):
            return ()
        base = self.history.commits[self.history.merge_base(base_tip.id, branch_tip.id)]
        tree = self.history.merged_tree(base.tree, branch_tip.tree, base_tip.tree)
        merge = self.history.record(tree, f"Merge branch '{worktree.base_branch}' into {worktree.branch}", branch_tip.id, base_tip.id)
        self.history.branches[worktree.branch] = merge.id
        self.moved_files(worktree.folder, branch_tip.tree, tree)
        return ()

    def siblings(self, worktree: Worktree, path: str) -> list[str]:
        return [committed for committed in self.committed_tree(worktree.folder) if str(Path(committed).parent) == str(Path(path).parent)]

    def refuse_deleted_built_files(self, worktree: Worktree, changes: WorktreeChanges) -> None:
        if any(change.deleted_under(BUILT_FOLDER) for change in changes.changes):
            raise GitStoryRequired("a story about deleted built files builds its repository with real git")

    def rebuild(self, worktree: Worktree, base_folder: str) -> None:
        changed = TreeChanges(self.history.tip(worktree.base_branch).tree, self.history.tip(worktree.branch).tree).names()
        if self.built_folders(list(changed)):
            raise GitStoryRequired("a story about rebuilt web files builds its repository with real git")

    def restore_stashes(self, worktree: Worktree) -> None:
        return

    def uncommitted_overlap(self, folder: str, worktree: Worktree) -> tuple[str, ...]:
        base = self.history.commits[self.history.merge_base(self.history.branches[worktree.base_branch], self.history.branches[worktree.branch])]
        changed = TreeChanges(base.tree, self.history.tip(worktree.branch).tree).names()
        return tuple(sorted(set(changed) & set(self.uncommitted_names(folder))))

    def merge(self, folder: str, worktree: Worktree, message: str) -> None:
        base_branch = self.history.folder_branch(Path(folder))
        base_tip, branch_tip = self.history.tip(base_branch), self.history.tip(worktree.branch)
        if self.history.is_ancestor(branch_tip.id, base_tip.id):
            return
        base = self.history.commits[self.history.merge_base(base_tip.id, branch_tip.id)]
        tree = self.history.merged_tree(base.tree, base_tip.tree, branch_tip.tree)
        merge = self.history.record(tree, message, base_tip.id, branch_tip.id)
        self.history.branches[base_branch] = merge.id
        self.moved_files(folder, base_tip.tree, tree)

    def untrack_files(self, folder: str, names: tuple[str, ...]) -> tuple[str, ...]:
        tracked = {name for name in names if name in self.committed_tree(folder)}
        self.skipped.setdefault(Path(folder).resolve(), set()).update(tracked)
        return tuple(name for name in names if name not in tracked)

    def exclude_file(self, folder: str) -> Path:
        return self.folder_files(folder).exclude_file()

    def git_folder(self, folder: str) -> Path:
        return self.exclude_file(folder).parent

    def remove(self, folder: str, worktree: Worktree) -> bool:
        self.runs.check_owner(worktree)
        path = Path(worktree.folder)
        owner = self.history.checked_out.get(path.resolve())
        if owner is not None and owner != worktree.branch:
            raise Refusal(f"another git worktree owns {worktree.folder}", "keep its folder and remove the stale worker row")
        self.runs.stop(worktree)
        if path.exists():
            shutil.rmtree(path)
        self.prune()
        if not self.is_merged(folder, worktree.base_branch, worktree.branch):
            return True
        del self.history.branches[worktree.branch]
        return False

    def prune(self) -> None:
        for path in [path for path in self.history.checked_out if path != self.history.root and not path.exists()]:
            del self.history.checked_out[path]

    def keep_tip(self, folder: str, path: str, name: str) -> None:
        self.history.tips[name] = self.history.branches[self.history.folder_branch(Path(path))]

    def has_unmerged_branch(self, folder: str, worktree: Worktree) -> bool:
        return self.history.has_branch(worktree.branch) and not self.is_merged(folder, worktree.base_branch, worktree.branch)

    def is_merged(self, folder: str, base_branch: str, branch: str | None) -> bool:
        if not base_branch or branch is None or not self.history.has_branch(branch) or not self.history.has_branch(base_branch):
            return False
        return self.history.is_ancestor(self.history.branches[branch], self.history.branches[base_branch])

    def remove_orphan(self, folder: str, path: str, base_branch: str, branch: str | None) -> bool:
        if not self.is_merged(folder, base_branch, branch):
            return False
        if not self.uncommitted_names(path) or self.is_published_folder(path):
            shutil.rmtree(path)
        self.prune()
        return not Path(path).exists()

    def is_published_folder(self, path: str) -> bool:
        names = self.uncommitted_names(path)
        return bool(names) and all(name.split("/")[0] in PUBLISHED_FOLDERS and name not in self.committed_tree(path) for name in names)

    def folders(self, folder: str) -> list[tuple[str, str | None]]:
        return [(str(path), branch) for path, branch in self.history.checked_out.items()]

    def remove_folder(self, folder: str, path: str) -> None:
        if Path(path).exists() and self.uncommitted_names(path):
            raise Refusal(f"git worktree remove failed in {folder}", f"{path} contains modified or untracked files")
        if Path(path).exists():
            shutil.rmtree(path)
        self.prune()

    def branch_commits(self, folder: str, revisions: str) -> tuple[TaskBranchCommit, ...]:
        base, tip = revisions.split("..")
        branch = self.history.folder_branch(Path(folder)) if tip == "HEAD" else tip.removeprefix("refs/heads/")
        if not self.history.has_branch(branch):
            return ()
        commits = self.history.new_commits(self.history.branches.get(base, base), self.history.branches[branch])
        return tuple(TaskBranchCommit.parsed(commit.id[:10], commit.message) for commit in commits if len(commit.parents) == 1)

    def earlier_branch(self, folder: str, worktree: Worktree, task_ids: Sequence[int]) -> str | None:
        if not self.history.has_branch(worktree.base_branch):
            return None
        prefix = f"{PurePosixPath(worktree.branch).parent}/"
        base_tip = self.history.branches[worktree.base_branch]
        branch_commits = [(commit.id, name) for name, tip in self.history.branches.items() if name.startswith(prefix) for commit in self.history.new_commits(base_tip, tip)
                 if len(commit.parents) == 1 and TaskBranchCommit.parsed(commit.id[:10], commit.message).has_task_subject(task_ids)]
        return max(branch_commits)[1] if branch_commits else None

    def dependency_folders(self, folder: str) -> tuple[str, ...]:
        return ()

    def merge_base(self, folder: str, base_branch: str, branch: str) -> str:
        return self.history.merge_base(self.history.branches[base_branch], self.history.branches[branch])

    def worker_files(self, worktree: Worktree) -> tuple[str, ...]:
        tip = self.history.branches[worktree.branch]
        commits = [commit for commit in self.history.new_commits(self.history.branches[worktree.base_branch], tip) if len(commit.parents) == 1]
        committed = (name for commit in commits for name in TreeChanges(self.history.commits[commit.parents[0]].tree, commit.tree).names())
        return tuple(dict.fromkeys((*committed, *(change.relative for change in self.file_changes(worktree.folder, tip)))))

    def uncommitted_files(self, folder: str) -> tuple[str, ...]:
        return self.uncommitted_names(folder)

    def comparison(self, worktree: Worktree) -> WorktreeChanges:
        base = self.history.merge_base(self.history.branches[worktree.base_branch], self.history.branches[worktree.branch])
        changes = self.file_changes(worktree.folder, base)
        return WorktreeChanges(base, tuple(change.relative for change in changes), changes)

    def file_changes(self, folder: str, base: str) -> tuple[WorktreeFileChange, ...]:
        committed, working = self.committed_tree(folder), self.working_tree(folder)
        tracked_texts = {name: working[name] for name in committed if name in working}
        tracked = TreeChanges(self.history.commits[base].tree, tracked_texts).tracked_changes()
        names = {change.relative for change in tracked}
        untracked = tuple(WorktreeFileChange(name, FileStatus.ADDED) for name in sorted(working) if name not in committed and name not in names)
        return (*tracked, *untracked)

    def has_commit(self, folder: str, commit: str) -> bool:
        return self.history.resolves(commit)

    def commit_contains(self, folder: str, commit: str, relative: str) -> bool:
        return self.history.resolves(commit) and relative in self.history.commits[commit].tree

    def file_text(self, folder: str, revision: str, relative: str) -> str:
        commit = revision if self.history.resolves(revision) else self.history.branches.get(revision, "")
        if not commit or relative not in self.history.commits[commit].tree:
            raise Refusal(f"git show failed in {folder}", f"{revision}:{relative} is not in the repository")
        return self.history.commits[commit].tree[relative]

    def git(self, folder: str, limit_seconds: int, *arguments: str) -> subprocess.CompletedProcess[str]:
        raise GitStoryRequired(f"git {' '.join(arguments)} is not answered by the in-memory git: this story needs real git")
