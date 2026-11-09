from pathlib import Path

from core.base.file_access import FileAccess
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

GIT_LIMIT_SECONDS = 30
HANDOFF_FOLDER = Path(".journal") / "handoffs"


class MainTaskHandoff:
    """Moves the uncommitted file progress a main agent made on a task into the worktree of the worker that
    takes the task over. The progress is saved as a patch first; the main checkout is cleaned of it only
    after the worker's worktree has taken it, and files the patch does not name are never touched."""

    def __init__(self, git: WorktreeGit) -> None:
        self.git = git

    def saved(self, folder: str, task_id: int, paths: tuple[str, ...]) -> Path:
        patch = self.git.checked(folder, GIT_LIMIT_SECONDS, "diff", "HEAD", "--binary", "--", *paths).stdout
        saved = Path(folder) / HANDOFF_FOLDER / f"task-{task_id}.patch"
        saved.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(saved, patch)
        return saved

    def collect_patch(self, worktree_folder: str, patch: Path) -> None:
        if patch.stat().st_size == 0:
            return
        finished = self.git.git(worktree_folder, GIT_LIMIT_SECONDS, "apply", "--index", str(patch))
        if finished.returncode != 0:
            raise Refusal(f"the progress in {patch.name} does not fit the worker's worktree", (finished.stderr or finished.stdout).strip())

    def clear_main_patch(self, folder: str, patch: Path) -> None:
        if patch.stat().st_size == 0:
            return
        self.git.checked(folder, GIT_LIMIT_SECONDS, "apply", "-R", str(patch))
