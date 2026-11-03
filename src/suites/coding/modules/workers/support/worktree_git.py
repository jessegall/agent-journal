import subprocess
from pathlib import Path

from core.base.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree

GIT_LIMIT_SECONDS = 60
CHECKOUT_LIMIT_SECONDS = 300
WORKTREE_EXCLUDE_FILE = "journal-exclude"
BUILT_FOLDER = "/web/dist/"
CONFLICT_MARKER = "<<<<<<< "


class WorktreeGit:
    """Runs the git of a worker's worktree under a time limit; it never reads or moves the checkout's own
    branch."""

    def tip(self, folder: str, branch: str) -> str:
        revision = self.git(folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "--quiet", f"refs/heads/{branch}")
        if revision.returncode != 0:
            raise Refusal(f"branch {branch} does not exist in {folder}", "make it there, or name another with journal environment edit <name> --branch <branch>")
        return revision.stdout.strip()

    def cut(self, folder: str, worktree: Worktree) -> None:
        self.checked(folder, CHECKOUT_LIMIT_SECONDS, "worktree", "add", "-b", worktree.branch, worktree.folder, worktree.base_branch)

    def commit(self, worktree: Worktree, message: str, trailer: str) -> bool:
        if not self.checked(worktree.folder, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.strip():
            return False
        conflicts = self.conflict_files(worktree)
        if conflicts:
            raise Refusal(f"conflict markers remain in {', '.join(conflicts)}", "settle them in the worktree, then try again")
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "add", "-A")
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "commit", "-m", message, "-m", trailer)
        return True

    def conflict_files(self, worktree: Worktree) -> tuple[str, ...]:
        unmerged = self.git(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", "--diff-filter=U").stdout.splitlines()
        files = ((path, Path(worktree.folder, path)) for path in unmerged)
        return tuple(path for path, file in files if file.exists() and CONFLICT_MARKER in file.read_text(errors="replace"))

    def head(self, folder: str) -> str:
        return self.git(folder, GIT_LIMIT_SECONDS, "symbolic-ref", "--short", "HEAD").stdout.strip()

    def sync(self, worktree: Worktree) -> tuple[str, ...]:
        if self.git(worktree.folder, CHECKOUT_LIMIT_SECONDS, "merge", "--no-edit", worktree.base_branch).returncode == 0:
            return ()
        conflicts = self.git(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", "--diff-filter=U").stdout.splitlines()
        for path in (path for path in conflicts if BUILT_FOLDER in path):
            self.use_branch_file(worktree, path)
        source_conflicts = tuple(path for path in conflicts if BUILT_FOLDER not in path)
        if not source_conflicts:
            self.checked(worktree.folder, GIT_LIMIT_SECONDS, "commit", "--no-edit")
        return source_conflicts

    def rebase(self, worktree: Worktree) -> bool:
        """Stashes the uncommitted changes of the worktree, rebases its branch on the base branch and puts the
        stash back; a rebase that clashes is aborted and False is returned, with the changes back as they were."""
        stash = self.stash(worktree)
        rebased = self.git(worktree.folder, CHECKOUT_LIMIT_SECONDS, "rebase", worktree.base_branch).returncode == 0
        if not rebased:
            self.git(worktree.folder, GIT_LIMIT_SECONDS, "rebase", "--abort")
        if stash:
            self.unstash(worktree, stash)
        return rebased

    def stash(self, worktree: Worktree) -> str:
        if not self.checked(worktree.folder, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.strip():
            return ""
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "stash", "push", "--include-untracked", "--message", f"journal merge of {worktree.branch}")
        return self.checked(worktree.folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "stash@{0}").stdout.strip()

    def unstash(self, worktree: Worktree, stash: str) -> None:
        self.git(worktree.folder, GIT_LIMIT_SECONDS, "stash", "apply", stash)
        entries = self.git(worktree.folder, GIT_LIMIT_SECONDS, "stash", "list", "--format=%H %gd").stdout.splitlines()
        for entry in (line.split() for line in entries):
            if entry[0] == stash:
                self.git(worktree.folder, GIT_LIMIT_SECONDS, "stash", "drop", entry[1])

    def use_branch_file(self, worktree: Worktree, path: str) -> None:
        if self.git(worktree.folder, GIT_LIMIT_SECONDS, "restore", "--theirs", "--", path).returncode == 0:
            self.checked(worktree.folder, GIT_LIMIT_SECONDS, "add", "--", path)
        else:
            self.checked(worktree.folder, GIT_LIMIT_SECONDS, "rm", "-f", "--", path)

    def uncommitted_overlap(self, folder: str, worktree: Worktree) -> tuple[str, ...]:
        changed = set(self.checked(folder, GIT_LIMIT_SECONDS, "diff", "--name-only", f"{worktree.base_branch}...{worktree.branch}").stdout.split())
        uncommitted = {line[3:] for line in self.checked(folder, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.splitlines()}
        return tuple(sorted(changed & uncommitted))

    def merge(self, folder: str, worktree: Worktree, message: str) -> None:
        finished = self.git(folder, CHECKOUT_LIMIT_SECONDS, "merge", "--no-ff", "-m", message, worktree.branch)
        if finished.returncode != 0:
            self.git(folder, GIT_LIMIT_SECONDS, "merge", "--abort")
            raise Refusal(f"git merge of {worktree.branch} failed in {folder}", (finished.stderr or finished.stdout).strip())

    def exclude_file(self, folder: str) -> Path:
        git_folder = Path(self.checked(folder, GIT_LIMIT_SECONDS, "rev-parse", "--absolute-git-dir").stdout.strip())
        exclude_file = git_folder / WORKTREE_EXCLUDE_FILE
        self.checked(folder, GIT_LIMIT_SECONDS, "config", "extensions.worktreeConfig", "true")
        self.checked(folder, GIT_LIMIT_SECONDS, "config", "--worktree", "core.excludesFile", str(exclude_file))
        return exclude_file

    def remove(self, folder: str, worktree: Worktree) -> bool:
        if Path(worktree.folder).exists():
            self.git(folder, GIT_LIMIT_SECONDS, "worktree", "remove", "--force", worktree.folder)
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "prune")
        unmerged = self.git(folder, GIT_LIMIT_SECONDS, "rev-list", "--count", f"refs/heads/{worktree.base_branch}..refs/heads/{worktree.branch}")
        if unmerged.returncode == 0 and unmerged.stdout.strip() != "0":
            return True
        self.git(folder, GIT_LIMIT_SECONDS, "branch", "-D", worktree.branch)
        return False

    def keep_tip(self, folder: str, path: str, name: str) -> None:
        tip = self.checked(path, GIT_LIMIT_SECONDS, "rev-parse", "HEAD").stdout.strip()
        self.checked(folder, GIT_LIMIT_SECONDS, "update-ref", f"refs/worker-tips/{name}", tip)

    def remove_orphan(self, folder: str, path: str) -> None:
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "remove", "--force", path)
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "prune")

    def folders(self, folder: str) -> list[tuple[str, str | None]]:
        blocks = self.checked(folder, GIT_LIMIT_SECONDS, "worktree", "list", "--porcelain").stdout.strip().split("\n\n")
        return [self.folder_entry(block.splitlines()) for block in blocks]

    @staticmethod
    def folder_entry(lines: list[str]) -> tuple[str, str | None]:
        branch = next((line.removeprefix("branch refs/heads/") for line in lines if line.startswith("branch refs/heads/")), None)
        return lines[0].removeprefix("worktree "), branch

    def remove_folder(self, folder: str, path: str) -> None:
        if Path(path).exists():
            self.checked(folder, GIT_LIMIT_SECONDS, "worktree", "remove", path)
        else:
            self.checked(folder, GIT_LIMIT_SECONDS, "worktree", "prune")

    def changed_files(self, worktree: Worktree) -> tuple[str, ...]:
        tracked = self.git(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", worktree.base_commit).stdout.splitlines()
        untracked = self.git(worktree.folder, GIT_LIMIT_SECONDS, "ls-files", "--others", "--exclude-standard").stdout.splitlines()
        return tuple(dict.fromkeys(path for path in (*tracked, *untracked) if path))

    def checked(self, folder: str, limit_seconds: int, *arguments: str) -> subprocess.CompletedProcess[str]:
        finished = self.git(folder, limit_seconds, *arguments)
        if finished.returncode != 0:
            raise Refusal(f"git {' '.join(arguments[:2])} failed in {folder}", (finished.stderr or finished.stdout).strip())
        return finished

    def git(self, folder: str, limit_seconds: int, *arguments: str) -> subprocess.CompletedProcess[str]:
        try:
            return subprocess.run(["git", "-C", folder, *arguments], capture_output=True, text=True, timeout=limit_seconds, check=False)
        except subprocess.TimeoutExpired as timeout:
            raise Refusal(f"git {' '.join(arguments[:2])} took longer than {limit_seconds} seconds in {folder}", "run it again once the folder is free") from timeout
