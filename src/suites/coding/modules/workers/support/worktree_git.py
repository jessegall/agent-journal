from engine.file.file_access import FileAccess
import fcntl
import json
import re
import subprocess
from collections.abc import Generator, Sequence
from contextlib import contextmanager
from functools import lru_cache
from engine.file.file_version import FileVersion
import shutil
from pathlib import Path, PurePosixPath

from engine.file.conflict_files import ConflictFiles
from engine.instruction.instruction_imports import INSTRUCTION_FILES
from engine.errors.refusal import Refusal
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.worktree import Worktree
from engine.enums.file_status import FileStatus
from suites.coding.modules.workers.support.task_branch_commit import TaskBranchCommit
from suites.coding.modules.workers.support.worktree_changes import WorktreeChanges
from suites.coding.modules.workers.support.worktree_file_change import WorktreeFileChange
from suites.coding.modules.workers.support.worktree_start import WorktreeStart
from suites.coding.modules.workers.support.worker_folder_runs import WorkerFolderRuns

GIT_LIMIT_SECONDS = 60
CHECKOUT_LIMIT_SECONDS = 300
BUILD_LIMIT_SECONDS = 300
WORKTREE_EXCLUDE_FILE = "journal-exclude"
WORKTREE_CONFIG_FILE = "config.worktree"
GIT_FOLDER_PREFIX = "gitdir:"
BUILT_FOLDER = "/web/dist/"
HASHED_BUILT_FILE = re.compile(r"(.+)-[\w-]{8}\.[^.]+")
# git quotes a name with a space, a quote or another letter it finds odd, unless it separates names with NUL
NAME_SEPARATOR = "\0"
COMMIT_SEPARATOR = "\x1e"
COMMIT_FORMAT = "--format=%h%x00%B%x1e"
SHORT_COMMIT_FLAG = "--abbrev=10"
# With -M -z a rename is three fields: status, old name, new name.
RENAME_STATUS = "R"
DIFF_STATUSES = {"A": FileStatus.ADDED, "D": FileStatus.DELETED}
STASH_MESSAGE = "journal merge of "
STASH_LOCK_FILE = "journal-stash.lock"
DEPENDENCY_FOLDER_NAMES = {"node_modules", "bower_components", "vendor", ".venv", "venv", "env", ".bundle"}
SKIP_WORKTREE_MARK = "S "

UNTRACKED_STATUS = "?? "
PUBLISHED_FOLDERS = (".claude", ".agents")


class WorktreeGit:
    """Runs timed Git operations on worker branches and worktrees. Every worktree of a project shares one
    stash stack, so a worktree finds its stash by its own message, and a lock holds the stack during a push or
    a drop."""

    def __init__(self, runs: WorkerFolderRuns) -> None:
        self.runs = runs

    def tip(self, folder: str, branch: str) -> str:
        revision = self.git(folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "--quiet", f"refs/heads/{branch}")
        if revision.returncode != 0:
            raise Refusal(f"branch {branch} does not exist in {folder}", "make it there, or name another with journal environment edit <name> --branch <branch>")
        return revision.stdout.strip()

    def cut(self, folder: str, worktree: Worktree, start: str) -> None:
        path = Path(worktree.folder)
        if path.exists() or path.is_symlink():
            self.runs.check_owner(worktree)
            registered = any(Path(registered_folder).resolve() == path.resolve() for registered_folder, _ in self.folders(folder))
            if registered or (path / ".git").is_dir():
                raise Refusal(f"a git worktree still exists at {path}", "merge or release its worktree before reusing the folder")
            self.runs.stop(worktree)
            shutil.rmtree(path)
        try:
            self.checked(folder, CHECKOUT_LIMIT_SECONDS, "worktree", "add", "-b", worktree.branch, worktree.folder, start)
        except Exception:
            self.remove(folder, worktree)
            raise

    def start(self, folder: str, worktree: Worktree, task_ids: Sequence[int]) -> WorktreeStart:
        branch = self.earlier_branch(folder, worktree, task_ids)
        if branch is None:
            return WorktreeStart(worktree.base_branch, self.tip(folder, worktree.base_branch))
        return WorktreeStart(branch, self.merge_base(folder, worktree.base_branch, branch))

    def earlier_branch(self, folder: str, worktree: Worktree, task_ids: Sequence[int]) -> str | None:
        pattern = f"{PurePosixPath(worktree.branch).parent}/*"
        tasks = "|".join(str(task_id) for task_id in task_ids)
        newest = self.git(folder, GIT_LIMIT_SECONDS, "log", "-1", "--no-merges", "--format=%H", "-E", f"--grep=^task ({tasks}): ", f"--branches={pattern}", "--not", worktree.base_branch).stdout.strip()
        if not newest:
            return None
        return self.checked(folder, GIT_LIMIT_SECONDS, "for-each-ref", "--contains", newest, "--sort=-version:refname", "--sort=-committerdate", "--format=%(refname:short)", f"refs/heads/{pattern}").stdout.split()[0]

    def merge_base(self, folder: str, base_branch: str, branch: str) -> str:
        return self.checked(folder, GIT_LIMIT_SECONDS, "merge-base", base_branch, branch).stdout.strip()

    def test_checkout(self, worktree: Worktree) -> str:
        folder = self.test_folder(worktree)
        commit = self.checked(worktree.folder, GIT_LIMIT_SECONDS, "rev-parse", "HEAD").stdout.strip()
        libraries = self.library_names(worktree)
        if not Path(folder, ".git").exists():
            Path(folder).parent.mkdir(parents=True, exist_ok=True)
            self.checked(worktree.folder, CHECKOUT_LIMIT_SECONDS, "worktree", "add", "--detach", folder, commit)
        else:
            self.checked(folder, CHECKOUT_LIMIT_SECONDS, "reset", "--hard", commit)
            self.checked(folder, GIT_LIMIT_SECONDS, "clean", "-fd", *(flag for name in libraries for flag in ("-e", name)))
        for name in libraries:
            if not Path(folder, name).exists():
                Path(folder, name).symlink_to(Path(worktree.folder, name).resolve(), target_is_directory=True)
        return folder

    @staticmethod
    def test_folder(worktree: Worktree) -> str:
        folder = Path(worktree.folder)
        return str(folder.parent.with_name(f"{folder.parent.name}-tests") / folder.name)

    def library_names(self, worktree: Worktree) -> tuple[str, ...]:
        linked = {path.name for path in Path(worktree.folder).iterdir() if path.is_symlink()}
        return tuple(sorted(linked | set(self.dependency_folders(worktree.folder)) | set(json.loads(worktree.library_links)) | set(json.loads(worktree.library_copies))))

    def dependency_folders(self, folder: str) -> tuple[str, ...]:
        listing = self.git(folder, GIT_LIMIT_SECONDS, "ls-files", "--others", "--ignored", "--exclude-standard", "--directory", "-z").stdout
        names = (name.rstrip("/") for name in listing.split(NAME_SEPARATOR))
        return tuple(name for name in names if PurePosixPath(name).name in DEPENDENCY_FOLDER_NAMES)

    def commit(self, worktree: Worktree, message: str, trailer: str) -> bool:
        self.refuse_conflicts(worktree)
        if not self.checked(worktree.folder, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.strip():
            return False
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "add", "-A")
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "commit", "-m", message, "-m", trailer)
        return True

    def commit_folders(self, folder: str, folders: tuple[str, ...], message: str) -> bool:
        existing = tuple(name for name in folders if Path(folder, name).exists())
        if not existing:
            return False
        self.checked(folder, GIT_LIMIT_SECONDS, "add", "-A", "--", *existing)
        if self.git(folder, GIT_LIMIT_SECONDS, "diff", "--cached", "--quiet", "--", *existing).returncode == 0:
            return False
        self.checked(folder, GIT_LIMIT_SECONDS, "commit", "-m", message, "--", *existing)
        return True

    def changed_names(self, folder: str, folders: tuple[str, ...]) -> tuple[str, ...]:
        existing = tuple(name for name in folders if Path(folder, name).exists())
        if not existing:
            return ()
        listing = self.checked(folder, GIT_LIMIT_SECONDS, "status", "--porcelain", "--untracked-files=all", "--", *existing).stdout
        return tuple(line[3:] for line in listing.splitlines())

    def is_current_branch(self, folder: str, branch: str) -> bool:
        return self.git(folder, GIT_LIMIT_SECONDS, "rev-parse", "--is-inside-work-tree").returncode == 0 and self.head(folder) == branch

    def rebased_commit(self, worktree: Worktree, message: str, trailer: str) -> tuple[str, ...]:
        self.restore_stashes(worktree)
        self.refuse_conflicts(worktree)
        if self.is_merging(worktree.folder):
            self.commit(worktree, message, trailer)
            return ()
        moved = self.tip(worktree.folder, worktree.base_branch) != worktree.base_commit
        rebased = moved and self.rebase(worktree)
        conflicts = self.without_instruction_conflicts(worktree, self.conflict_files(worktree)) if rebased else ()
        if conflicts:
            return conflicts
        self.commit(worktree, message, trailer)
        return self.sync(worktree) if moved and not rebased else ()

    def refuse_conflicts(self, worktree: Worktree) -> None:
        conflicts = self.conflict_files(worktree)
        if conflicts:
            raise Refusal(f"conflict markers remain in {', '.join(conflicts)}", AskTopic.CONFLICT.hint("settle them in the worktree, then try again"))

    def is_merging(self, folder: str) -> bool:
        return self.git(folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "--quiet", "MERGE_HEAD").returncode == 0

    def conflict_files(self, worktree: Worktree) -> tuple[str, ...]:
        return ConflictFiles(Path(worktree.folder)).paths()

    def head(self, folder: str) -> str:
        return self.git(folder, GIT_LIMIT_SECONDS, "symbolic-ref", "--short", "HEAD").stdout.strip()

    def sync(self, worktree: Worktree) -> tuple[str, ...]:
        with self.without_instruction_files(worktree.folder):
            merged = self.git(worktree.folder, CHECKOUT_LIMIT_SECONDS, "merge", "--no-edit", worktree.base_branch).returncode == 0
        if merged:
            return ()
        conflicts = self.git(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", "--diff-filter=U").stdout.splitlines()
        folders = self.built_folders(conflicts)
        if folders:
            self.checked(worktree.folder, GIT_LIMIT_SECONDS, "rm", "-r", "-f", "--ignore-unmatch", "--", *folders)
        source_conflicts = tuple(path for path in self.without_instruction_conflicts(worktree, tuple(conflicts)) if BUILT_FOLDER not in path)
        if not source_conflicts:
            self.checked(worktree.folder, GIT_LIMIT_SECONDS, "commit", "--no-edit")
        return source_conflicts

    def without_instruction_conflicts(self, worktree: Worktree, conflicts: tuple[str, ...]) -> tuple[str, ...]:
        instruction_conflicts = [path for path in conflicts if path in INSTRUCTION_FILES]
        if instruction_conflicts:
            self.checked(worktree.folder, GIT_LIMIT_SECONDS, "restore", f"--source={worktree.base_branch}", "--staged", "--worktree", "--", *instruction_conflicts)
        return tuple(path for path in conflicts if path not in INSTRUCTION_FILES)

    def built_folders(self, files: list[str]) -> tuple[str, ...]:
        return tuple(sorted({path.split(BUILT_FOLDER, 1)[0] + "/web/dist" for path in files if BUILT_FOLDER in path}))

    def is_rebuilt(self, worktree: Worktree, path: str) -> bool:
        name = self.built_name(path)
        return name is not None and name in {self.built_name(sibling) for sibling in self.siblings(worktree, path)}

    def siblings(self, worktree: Worktree, path: str) -> list[str]:
        return self.git(worktree.folder, GIT_LIMIT_SECONDS, "ls-files", "--", str(Path(path).parent)).stdout.splitlines()

    @staticmethod
    def built_name(path: str) -> str | None:
        injections = HASHED_BUILT_FILE.fullmatch(Path(path).name)
        return injections.group(1) if injections is not None else None

    def refuse_deleted_built_files(self, worktree: Worktree, changes: WorktreeChanges) -> None:
        deleted = [change.relative for change in changes.changes if change.deleted_under(BUILT_FOLDER)]
        kept = [path for path in deleted if self.git(worktree.folder, GIT_LIMIT_SECONDS, "ls-files", "--", path.split(BUILT_FOLDER, 1)[0]).stdout.strip() and not self.is_rebuilt(worktree, path)]
        if kept:
            raise Refusal(f"it deletes {len(kept)} built files under web/dist while their sources stay, such as {kept[0]}",
                          AskTopic.TOOL.hint("build them again with npm --prefix src/viewer run build, then hand in again"))

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
        self.commit(worktree, "Rebuild web files from merged sources", f"Journal: worker worker-{worktree.session_agent_id}")

    @contextmanager
    def without_instruction_files(self, folder: str) -> Generator[None]:
        written = [line[len(SKIP_WORKTREE_MARK):] for line in self.git(folder, GIT_LIMIT_SECONDS, "ls-files", "-v", "--", *INSTRUCTION_FILES).stdout.splitlines() if line.startswith(SKIP_WORKTREE_MARK)]
        kept = {name: self.git_folder(folder) / f"{name}.kept" for name in written}
        for name in written:
            FileAccess.shared().replace(Path(folder) / name, kept[name])
            self.checked(folder, GIT_LIMIT_SECONDS, "update-index", "--no-skip-worktree", "--", name)
            self.checked(folder, GIT_LIMIT_SECONDS, "restore", "--", name)
        try:
            yield
        finally:
            for name in written:
                FileAccess.shared().replace(kept[name], Path(folder) / name)
                self.git(folder, GIT_LIMIT_SECONDS, "update-index", "--skip-worktree", "--", name)

    def rebase(self, worktree: Worktree) -> bool:
        stash = self.stash(worktree)
        rebased = False
        try:
            with self.without_instruction_files(worktree.folder):
                rebased = self.git(worktree.folder, CHECKOUT_LIMIT_SECONDS, "rebase", worktree.base_branch).returncode == 0
            return rebased
        finally:
            if not rebased:
                self.git(worktree.folder, GIT_LIMIT_SECONDS, "rebase", "--abort")
            if stash:
                self.unstash(worktree, stash)

    def restore_stashes(self, worktree: Worktree) -> None:
        stashes = self.branch_stashes(worktree)
        if not stashes:
            return
        self.git(worktree.folder, GIT_LIMIT_SECONDS, "rebase", "--abort")
        for stash in reversed(stashes):
            self.unstash(worktree, stash)

    def stash(self, worktree: Worktree) -> str:
        if not self.checked(worktree.folder, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.strip():
            return ""
        self.checked(worktree.folder, GIT_LIMIT_SECONDS, "add", "--update")
        with self.stash_stack_lock(worktree):
            self.checked(worktree.folder, GIT_LIMIT_SECONDS, "stash", "push", "--include-untracked", "--message", f"{STASH_MESSAGE}{worktree.branch}")
            return self.branch_stashes(worktree)[0]

    def branch_stashes(self, worktree: Worktree) -> list[str]:
        entries = self.checked(worktree.folder, GIT_LIMIT_SECONDS, "stash", "list", "--format=%H%x00%gs").stdout.splitlines()
        return [entry.partition("\0")[0] for entry in entries if entry.partition("\0")[2].endswith(f": {STASH_MESSAGE}{worktree.branch}")]

    @contextmanager
    def stash_stack_lock(self, worktree: Worktree) -> Generator[None]:
        common_folder = self.checked(worktree.folder, GIT_LIMIT_SECONDS, "rev-parse", "--git-common-dir").stdout.strip()
        with FileAccess.shared().writer(Path(worktree.folder, common_folder, STASH_LOCK_FILE), "a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(lock, fcntl.LOCK_UN)

    def unstash(self, worktree: Worktree, stash: str) -> None:
        applied = self.git(worktree.folder, GIT_LIMIT_SECONDS, "stash", "apply", stash).returncode == 0
        has_markers = bool(self.checked(worktree.folder, GIT_LIMIT_SECONDS, "diff", "--name-only", "--diff-filter=U").stdout.strip())
        if not applied and not has_markers and not self.head_contains(worktree.folder, stash):
            raise Refusal(f"after the rebase, git stash apply failed for the uncommitted changes of the worker", AskTopic.CONFLICT.hint(f"they stay in its stash {stash}: the worker applies them"))
        with self.stash_stack_lock(worktree):
            entries = self.git(worktree.folder, GIT_LIMIT_SECONDS, "stash", "list", "--format=%H %gd").stdout.splitlines()
            for entry in (line.split() for line in entries):
                if entry[0] == stash:
                    self.git(worktree.folder, GIT_LIMIT_SECONDS, "stash", "drop", entry[1])

    def head_contains(self, folder: str, stash: str) -> bool:
        parts = [(stash, self.checked(folder, GIT_LIMIT_SECONDS, "diff", "--name-only", f"{stash}^1", stash).stdout.splitlines())]
        untracked = f"{stash}^3"
        if self.git(folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "--quiet", untracked).returncode == 0:
            parts.append((untracked, self.checked(folder, GIT_LIMIT_SECONDS, "ls-tree", "-r", "--name-only", untracked).stdout.splitlines()))
        return all(self.git(folder, GIT_LIMIT_SECONDS, "diff", "--quiet", tree, "HEAD", "--", *names).returncode == 0 for tree, names in parts if names)

    def uncommitted_overlap(self, folder: str, worktree: Worktree) -> tuple[str, ...]:
        changed = set(self.checked(folder, GIT_LIMIT_SECONDS, "diff", "--name-only", f"{worktree.base_branch}...{worktree.branch}").stdout.split())
        uncommitted = {line[3:] for line in self.checked(folder, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.splitlines()}
        return tuple(sorted(changed & uncommitted))

    def branch_contains(self, worktree: Worktree, commit: str) -> bool:
        return self.git(worktree.folder, GIT_LIMIT_SECONDS, "merge-base", "--is-ancestor", commit, worktree.branch).returncode == 0

    def merge(self, folder: str, worktree: Worktree, message: str) -> None:
        self.merge_revision(folder, worktree.branch, message)

    def merge_revision(self, folder: str, revision: str, message: str) -> None:
        finished = self.git(folder, CHECKOUT_LIMIT_SECONDS, "merge", "--no-ff", "--no-commit", revision)
        if not self.is_merging(folder):
            if finished.returncode != 0:
                raise Refusal(f"git merge of {revision} failed in {folder}", (finished.stderr or finished.stdout).strip())
            return
        self.keep_instruction_files(folder)
        if self.git(folder, GIT_LIMIT_SECONDS, "diff", "--name-only", "--diff-filter=U").stdout.strip():
            self.git(folder, GIT_LIMIT_SECONDS, "merge", "--abort")
            raise Refusal(f"git merge of {revision} failed in {folder}", (finished.stderr or finished.stdout).strip())
        self.checked(folder, GIT_LIMIT_SECONDS, "commit", "-m", message)

    def keep_instruction_files(self, folder: str) -> None:
        kept = self.checked(folder, GIT_LIMIT_SECONDS, "ls-tree", "--name-only", "HEAD", "--", *INSTRUCTION_FILES).stdout.split()
        added = [name for name in INSTRUCTION_FILES if name not in kept]
        if kept:
            self.checked(folder, GIT_LIMIT_SECONDS, "restore", "--source=HEAD", "--staged", "--worktree", "--", *kept)
        if added:
            self.checked(folder, GIT_LIMIT_SECONDS, "rm", "-f", "--quiet", "--ignore-unmatch", "--", *added)

    def untrack_files(self, folder: str, names: tuple[str, ...]) -> tuple[str, ...]:
        tracked = set(self.checked(folder, GIT_LIMIT_SECONDS, "ls-files", "--", *names).stdout.split())
        if tracked:
            self.checked(folder, GIT_LIMIT_SECONDS, "update-index", "--skip-worktree", *sorted(tracked))
        return tuple(name for name in names if name not in tracked)

    def exclude_file(self, folder: str) -> Path:
        git_folder = self.git_folder(folder)
        exclude_file = git_folder / WORKTREE_EXCLUDE_FILE
        worktree_config = git_folder / WORKTREE_CONFIG_FILE
        if worktree_config.exists() and self.has_exclusion(worktree_config, FileAccess.shared().version(worktree_config), exclude_file):
            return exclude_file
        self.checked(folder, GIT_LIMIT_SECONDS, "config", "extensions.worktreeConfig", "true")
        self.checked(folder, GIT_LIMIT_SECONDS, "config", "--worktree", "core.excludesFile", str(exclude_file))
        return exclude_file

    @staticmethod
    @lru_cache(maxsize=128)
    def has_exclusion(path: Path, version: FileVersion, excluded: Path) -> bool:
        return str(excluded) in FileAccess.shared().read(path)

    def git_folder(self, folder: str) -> Path:
        link = Path(folder) / ".git"
        if link.is_file():
            return (Path(folder) / self.linked_folder(link, FileAccess.shared().version(link))).resolve()
        return Path(self.checked(folder, GIT_LIMIT_SECONDS, "rev-parse", "--absolute-git-dir").stdout.strip())

    @staticmethod
    @lru_cache(maxsize=128)
    def linked_folder(path: Path, version: FileVersion) -> str:
        return FileAccess.shared().read(path).removeprefix(GIT_FOLDER_PREFIX).strip()

    def remove(self, folder: str, worktree: Worktree) -> bool:
        self.runs.check_owner(worktree)
        registered = [(path, branch) for path, branch in self.folders(folder) if Path(path).resolve() == Path(worktree.folder).resolve()]
        if registered and registered[0][1] != worktree.branch:
            raise Refusal(f"another git worktree owns {worktree.folder}", "keep its folder and remove the stale worker row")
        self.runs.stop(worktree)
        tests_folder = self.test_folder(worktree)
        if Path(tests_folder).exists():
            self.git(folder, GIT_LIMIT_SECONDS, "worktree", "remove", "--force", tests_folder)
            shutil.rmtree(tests_folder, ignore_errors=True)
        if Path(worktree.folder).exists():
            self.git(folder, GIT_LIMIT_SECONDS, "worktree", "remove", "--force", worktree.folder)
        if Path(worktree.folder).exists():
            shutil.rmtree(worktree.folder)
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "prune")
        if not self.is_merged(folder, worktree.base_branch, worktree.branch):
            return True
        self.git(folder, GIT_LIMIT_SECONDS, "branch", "-D", worktree.branch)
        return False

    def keep_tip(self, folder: str, path: str, name: str) -> None:
        tip = self.checked(path, GIT_LIMIT_SECONDS, "rev-parse", "HEAD").stdout.strip()
        self.checked(folder, GIT_LIMIT_SECONDS, "update-ref", f"refs/worker-tips/{name}", tip)

    def has_unmerged_branch(self, folder: str, worktree: Worktree) -> bool:
        exists = self.git(folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "--quiet", f"refs/heads/{worktree.branch}").returncode == 0
        return exists and not self.is_merged(folder, worktree.base_branch, worktree.branch)

    def is_merged(self, folder: str, base_branch: str, branch: str | None) -> bool:
        if not base_branch or branch is None:
            return False
        finished = self.git(folder, GIT_LIMIT_SECONDS, "merge-base", "--is-ancestor", f"refs/heads/{branch}", f"refs/heads/{base_branch}")
        return finished.returncode == 0

    def remove_orphan(self, folder: str, path: str, base_branch: str, branch: str | None) -> bool:
        if not self.is_merged(folder, base_branch, branch):
            return False
        force = tuple(["--force"]) if self.is_published_folder(path) else ()
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "remove", *force, path)
        self.git(folder, GIT_LIMIT_SECONDS, "worktree", "prune")
        return not Path(path).exists()

    def is_published_folder(self, path: str) -> bool:
        lines = self.git(path, GIT_LIMIT_SECONDS, "status", "--porcelain").stdout.splitlines()
        return bool(lines) and all(line.startswith(UNTRACKED_STATUS) and line[len(UNTRACKED_STATUS):].split("/")[0] in PUBLISHED_FOLDERS for line in lines)

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

    def task_commits(self, worktree: Worktree, task_id: int) -> tuple[TaskBranchCommit, ...]:
        return tuple(commit for commit in self.branch_commits(worktree.folder, f"{worktree.base_commit}..HEAD") if commit.has_task_subject([task_id]))

    def branch_commits(self, folder: str, revisions: str) -> tuple[TaskBranchCommit, ...]:
        log = self.git(folder, GIT_LIMIT_SECONDS, "log", "--no-merges", SHORT_COMMIT_FLAG, COMMIT_FORMAT, revisions)
        if log.returncode != 0:
            return ()
        fields = (record.strip().split(NAME_SEPARATOR, 1) for record in log.stdout.split(COMMIT_SEPARATOR) if record.strip())
        return tuple(TaskBranchCommit.parsed(short_id, message) for short_id, message in fields)

    def uncommitted_files(self, folder: str) -> tuple[str, ...]:
        listing = self.checked(folder, GIT_LIMIT_SECONDS, "status", "--porcelain", "--untracked-files=all").stdout
        return tuple(line[3:].split(" -> ")[-1] for line in listing.splitlines())

    def changed_files(self, worktree: Worktree) -> tuple[str, ...]:
        return tuple(change.relative for change in self.file_changes(worktree.folder, worktree.base_commit))

    def comparison(self, worktree: Worktree) -> WorktreeChanges:
        base = self.merge_base(worktree.folder, worktree.base_branch, worktree.branch)
        changes = self.file_changes(worktree.folder, base)
        return WorktreeChanges(base, tuple(change.relative for change in changes), changes)

    def worker_files(self, worktree: Worktree) -> tuple[str, ...]:
        listing = self.checked(worktree.folder, GIT_LIMIT_SECONDS, "log", "--no-merges", "--name-only", "-z", "--format=", f"{worktree.base_branch}..HEAD").stdout
        committed = (name.strip("\n") for name in listing.split(NAME_SEPARATOR))
        waiting = self.file_changes(worktree.folder, "MERGE_HEAD" if self.is_merging(worktree.folder) else "HEAD")
        return tuple(dict.fromkeys(name for name in (*committed, *(change.relative for change in waiting)) if name))

    def file_changes(self, folder: str, base: str) -> tuple[WorktreeFileChange, ...]:
        tracked = self.tracked_changes(self.git(folder, GIT_LIMIT_SECONDS, "diff", "--name-status", "-M", "-z", base).stdout)
        names = {change.relative for change in tracked}
        untracked = self.git(folder, GIT_LIMIT_SECONDS, "ls-files", "--others", "--exclude-standard", "-z").stdout.split(NAME_SEPARATOR)[:-1]
        return (*tracked, *(WorktreeFileChange(name, FileStatus.ADDED) for name in dict.fromkeys(untracked) if name not in names))

    @staticmethod
    def tracked_changes(listing: str) -> tuple[WorktreeFileChange, ...]:
        fields = iter(listing.split(NAME_SEPARATOR)[:-1])
        changes: list[WorktreeFileChange] = []
        for status in fields:
            if status.startswith(RENAME_STATUS):
                old_name = next(fields)
                changes.append(WorktreeFileChange(next(fields), FileStatus.RENAMED, old_name))
            else:
                changes.append(WorktreeFileChange(next(fields), DIFF_STATUSES.get(status, FileStatus.CHANGED)))
        return tuple(changes)

    def has_commit(self, folder: str, commit: str) -> bool:
        return self.git(folder, GIT_LIMIT_SECONDS, "rev-parse", "--verify", "--quiet", f"{commit}^{{commit}}").returncode == 0

    def commit_contains(self, folder: str, commit: str, relative: str) -> bool:
        return self.git(folder, GIT_LIMIT_SECONDS, "cat-file", "-e", f"{commit}:{relative}").returncode == 0

    def file_text(self, folder: str, revision: str, relative: str) -> str:
        return self.checked(folder, GIT_LIMIT_SECONDS, "show", f"{revision}:{relative}").stdout

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
