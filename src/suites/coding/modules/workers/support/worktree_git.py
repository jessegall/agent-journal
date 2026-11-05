import subprocess
import shutil
from pathlib import Path

from core.base.conflict_files import ConflictFiles
from core.base.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_changes import WorktreeChanges

GIT_LIMIT_SECONDS = 60
CHECKOUT_LIMIT_SECONDS = 300
BUILD_LIMIT_SECONDS = 300
WORKTREE_EXCLUDE_FILE = "journal-exclude"
WORKTREE_CONFIG_FILE = "config.worktree"
GIT_FOLDER_PREFIX = "gitdir:"
BUILT_FOLDER = "/web/dist/"


class WorktreeGit:
    """Runs timed Git operations on worker branches and worktrees."""

    def tip(self, folder: str, branch: str) -> str:
        revision = self.git(folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "--quiet", f"refs/heads/{branch}")
        if revision.returncode != 0:
            raise Refusal(f"branch {branch} does not exist in {folder}", "make it there, or name another with journal environment edit <name> --branch <branch>")
        return revision.stdout.strip()

    def cut(self, folder: str, worktree: Worktree) -> None:
        self.checked(folder, CHECKOUT_LIMIT_SECONDS, "worktree", "add", "-b", worktree.branch, worktree.folder, worktree.base_branch)

    def commit(self, worktree: Worktree, message: str, trailer: str) -> bool:
        self.refuse_conflicts(worktree)
        if not self.checked(worktree.folder, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.strip():
            return False
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "add", "-A")
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "commit", "-m", message, "-m", trailer)
        return True

    def rebased_commit(self, worktree: Worktree, message: str, trailer: str) -> tuple[str, ...]:
        self.restore_stashes(worktree)
        self.refuse_conflicts(worktree)
        if self.is_merging(worktree):
            self.commit(worktree, message, trailer)
            return ()
        moved = self.tip(worktree.folder, worktree.base_branch) != worktree.base_commit
        rebased = moved and self.rebase(worktree)
        conflicts = self.conflict_files(worktree) if rebased else ()
        if conflicts:
            return conflicts
        self.commit(worktree, message, trailer)
        return self.sync(worktree) if moved and not rebased else ()

    def refuse_conflicts(self, worktree: Worktree) -> None:
        conflicts = self.conflict_files(worktree)
        if conflicts:
            raise Refusal(f"conflict markers remain in {', '.join(conflicts)}", "settle them in the worktree, then try again")

    def is_merging(self, worktree: Worktree) -> bool:
        return self.git(worktree.folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "--quiet", "MERGE_HEAD").returncode == 0

    def conflict_files(self, worktree: Worktree) -> tuple[str, ...]:
        return ConflictFiles(Path(worktree.folder)).paths()

    def head(self, folder: str) -> str:
        return self.git(folder, GIT_LIMIT_SECONDS, "symbolic-ref", "--short", "HEAD").stdout.strip()

    def sync(self, worktree: Worktree) -> tuple[str, ...]:
        if self.git(worktree.folder, CHECKOUT_LIMIT_SECONDS, "merge", "--no-edit", worktree.base_branch).returncode == 0:
            return ()
        conflicts = self.git(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", "--diff-filter=U").stdout.splitlines()
        folders = self.built_folders(conflicts)
        if folders:
            self.checked(worktree.folder, GIT_LIMIT_SECONDS, "rm", "-r", "-f", "--ignore-unmatch", "--", *folders)
        source_conflicts = tuple(path for path in conflicts if BUILT_FOLDER not in path)
        if not source_conflicts:
            self.checked(worktree.folder, GIT_LIMIT_SECONDS, "commit", "--no-edit")
        return source_conflicts

    def built_folders(self, files: list[str]) -> tuple[str, ...]:
        return tuple(sorted({path.split(BUILT_FOLDER, 1)[0] + "/web/dist" for path in files if BUILT_FOLDER in path}))

    def rebuild(self, worktree: Worktree, base_folder: str) -> None:
        changed = self.checked(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", worktree.base_branch, worktree.branch).stdout.splitlines()
        folders = self.built_folders(changed)
        if not folders:
            return
        viewer = Path(worktree.folder, "src/viewer")
        if not (viewer / "package.json").is_file():
            raise Refusal("the web build needs src/viewer/package.json", "add the build command before merging generated web files")
        for folder in folders:
            path = Path(worktree.folder, folder)
            if path.exists():
                shutil.rmtree(path)
        modules = viewer / "node_modules"
        base_modules = Path(base_folder, "src/viewer/node_modules")
        linked = not modules.exists() and base_modules.is_dir()
        if linked:
            modules.symlink_to(base_modules.resolve(), target_is_directory=True)
        try:
            finished = subprocess.run(["npm", "run", "build"], cwd=viewer, capture_output=True, text=True, timeout=BUILD_LIMIT_SECONDS, check=False)
            if finished.returncode != 0:
                raise Refusal("the web build failed", (finished.stderr or finished.stdout).strip())
        except subprocess.TimeoutExpired as timeout:
            raise Refusal("the web build exceeded its time limit", "fix the build in the worker's worktree, then merge again") from timeout
        finally:
            if linked:
                modules.unlink()
        missing = [folder for folder in folders if not any(path.is_file() for path in Path(worktree.folder, folder).rglob("*"))]
        if missing:
            raise Refusal(f"the web build produced no files in {', '.join(missing)}", "fix the web build before merging")
        self.commit(worktree, "Rebuild web files from merged sources", f"Journal: worker worker-{worktree.agent_id}")

    def rebase(self, worktree: Worktree) -> bool:
        stash = self.stash(worktree)
        rebased = False
        try:
            rebased = self.git(worktree.folder, CHECKOUT_LIMIT_SECONDS, "rebase", worktree.base_branch).returncode == 0
            return rebased
        finally:
            if not rebased:
                self.git(worktree.folder, GIT_LIMIT_SECONDS, "rebase", "--abort")
            if stash:
                self.unstash(worktree, stash)

    def restore_stashes(self, worktree: Worktree) -> None:
        entries = self.checked(worktree.folder, GIT_LIMIT_SECONDS, "stash", "list", "--format=%H%x00%gs").stdout.splitlines()
        stashes = [entry.partition("\0")[0] for entry in entries if entry.partition("\0")[2].endswith(f": journal merge of {worktree.branch}")]
        if not stashes:
            return
        self.git(worktree.folder, GIT_LIMIT_SECONDS, "rebase", "--abort")
        for stash in reversed(stashes):
            self.unstash(worktree, stash)

    def stash(self, worktree: Worktree) -> str:
        if not self.checked(worktree.folder, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.strip():
            return ""
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "add", "--update")
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "stash", "push", "--include-untracked", "--message", f"journal merge of {worktree.branch}")
        return self.checked(worktree.folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "stash@{0}").stdout.strip()

    def unstash(self, worktree: Worktree, stash: str) -> None:
        applied = self.git(worktree.folder, GIT_LIMIT_SECONDS, "stash", "apply", stash).returncode == 0
        has_markers = bool(self.checked(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", "--diff-filter=U").stdout.strip())
        if not applied and not has_markers:
            raise Refusal(f"after the rebase, git stash apply failed for the uncommitted changes of worker {worktree.agent_id}", f"they stay in its stash {stash}: the worker applies them")
        entries = self.git(worktree.folder, GIT_LIMIT_SECONDS, "stash", "list", "--format=%H %gd").stdout.splitlines()
        for entry in (line.split() for line in entries):
            if entry[0] == stash:
                self.git(worktree.folder, GIT_LIMIT_SECONDS, "stash", "drop", entry[1])

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
        git_folder = self.git_folder(folder)
        exclude_file = git_folder / WORKTREE_EXCLUDE_FILE
        worktree_config = git_folder / WORKTREE_CONFIG_FILE
        if worktree_config.exists() and str(exclude_file) in worktree_config.read_text():
            return exclude_file
        self.checked(folder, GIT_LIMIT_SECONDS, "config", "extensions.worktreeConfig", "true")
        self.checked(folder, GIT_LIMIT_SECONDS, "config", "--worktree", "core.excludesFile", str(exclude_file))
        return exclude_file

    def git_folder(self, folder: str) -> Path:
        link = Path(folder) / ".git"
        if link.is_file():
            return (Path(folder) / link.read_text().removeprefix(GIT_FOLDER_PREFIX).strip()).resolve()
        return Path(self.checked(folder, GIT_LIMIT_SECONDS, "rev-parse", "--absolute-git-dir").stdout.strip())

    def remove(self, folder: str, worktree: Worktree) -> bool:
        if Path(worktree.folder).exists():
            self.git(folder, GIT_LIMIT_SECONDS, "worktree", "remove", "--force", worktree.folder)
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "prune")
        if not self.is_merged(folder, worktree.base_branch, worktree.branch):
            return True
        self.git(folder, GIT_LIMIT_SECONDS, "branch", "-D", worktree.branch)
        return False

    def keep_tip(self, folder: str, path: str, name: str) -> None:
        tip = self.checked(path, GIT_LIMIT_SECONDS, "rev-parse", "HEAD").stdout.strip()
        self.checked(folder, GIT_LIMIT_SECONDS, "update-ref", f"refs/worker-tips/{name}", tip)

    def is_merged(self, folder: str, base_branch: str, branch: str | None) -> bool:
        if not base_branch or branch is None:
            return False
        finished = self.git(folder, GIT_LIMIT_SECONDS, "merge-base", "--is-ancestor", f"refs/heads/{branch}", f"refs/heads/{base_branch}")
        return finished.returncode == 0

    def remove_orphan(self, folder: str, path: str, base_branch: str, branch: str | None) -> bool:
        if not self.is_merged(folder, base_branch, branch):
            return False
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "remove", path)
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "prune")
        return not Path(path).exists()

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
        return self.changed_paths(worktree, worktree.base_commit)

    def comparison(self, worktree: Worktree) -> WorktreeChanges:
        base = self.checked(worktree.folder, GIT_LIMIT_SECONDS, "merge-base", worktree.base_branch, worktree.branch).stdout.strip()
        return WorktreeChanges(base, self.changed_paths(worktree, base))

    def changed_paths(self, worktree: Worktree, base: str) -> tuple[str, ...]:
        tracked = self.git(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", base).stdout.splitlines()
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
