import fcntl
import os
import shutil
import subprocess
import time
from pathlib import Path

from journal.support.kept_tips import TIPS_REF
from journal.support.worktree_failure import WorktreeFailure

GIT_SECONDS = 60
JOURNAL = ".journal"
SKILL_FOLDERS = (".claude/skills", ".agents/skills")
IGNORED_COPIES = (".claude/settings.json", ".claude/settings.local.json", ".codex/hooks.json", ".codex/agents", ".claude/agents", "AGENTS.md", "CLAUDE.md")


class Worktree:
    """The git worktree a launch works in, at .claude/worktrees/<name> on the branch worktree-<name>, where Claude Code keeps its own: made when it is not there, and never removed by the journal or handed to the agent to remove."""

    def __init__(self, root: Path, name: str) -> None:
        self.root, self.name = root, name

    @property
    def path(self) -> Path:
        return self.root / ".claude" / "worktrees" / self.name

    @property
    def branch(self) -> str:
        return f"worktree-{self.name}"

    def badges(self) -> tuple[str, ...]:
        if not self.path.is_dir():
            return ()
        return (f"worktree on {self.current_branch()}",)

    def current_branch(self) -> str:
        return self.git_in("rev-parse", "--abbrev-ref", "HEAD").stdout.strip()

    def made(self) -> Path:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with (self.path.parent / f".{self.name}.lock").open("w") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            if self.path.exists() and not self.is_registered():
                self.moved_aside()
            if not self.path.is_dir():
                self.added()
            self.shared()
            self.git("update-ref", f"{TIPS_REF}/{self.name}", self.branch_here())
        return self.path

    def branch_here(self) -> str:
        return self.git_in("rev-parse", "HEAD").stdout.strip()

    def added(self) -> None:
        self.git("worktree", "prune")
        if self.has(f"refs/heads/{self.branch}"):
            added = self.git("worktree", "add", str(self.path), self.branch)
        elif self.has(f"{TIPS_REF}/{self.name}"):
            added = self.git("worktree", "add", "-b", self.branch, str(self.path), f"{TIPS_REF}/{self.name}")
        else:
            added = self.git("worktree", "add", "-b", self.branch, str(self.path))
        if added.returncode != 0:
            self.git("worktree", "prune")
            if self.path.exists():
                self.moved_aside()
            raise WorktreeFailure(self.name, added.stderr.strip())

    def dropped(self) -> str:
        if not self.path.is_dir():
            return ""
        left = [line[3:] for line in self.git_in("status", "--porcelain").stdout.splitlines() if line.strip()]
        if left:
            return f"its worktree {self.path} stays, since {len(left)} files in it are not committed: {', '.join(left[:10])}"
        tip = self.git_in("rev-parse", "HEAD").stdout.strip()
        if self.git("merge-base", "--is-ancestor", tip, "HEAD").returncode != 0:
            return f"its worktree {self.path} stays, since its branch has commits not yet in {self.git('rev-parse', '--abbrev-ref', 'HEAD').stdout.strip()}"
        self.git("update-ref", f"{TIPS_REF}/{self.name}", tip)
        branch = self.git_in("rev-parse", "--abbrev-ref", "HEAD").stdout.strip()
        self.git("worktree", "remove", "--force", str(self.path))
        self.git("branch", "-D", branch)
        return f"its worktree and branch are removed, its work already merged; its last commit is kept as {TIPS_REF}/{self.name}"

    def is_registered(self) -> bool:
        listed = self.git("worktree", "list", "--porcelain").stdout.splitlines()
        return f"worktree {self.path.resolve()}" in listed or f"worktree {self.path}" in listed

    def moved_aside(self) -> Path:
        aside = self.path.with_name(f"{self.name}.moved-aside-{int(time.time())}")
        self.path.rename(aside)
        self.git("worktree", "prune")
        return aside

    def shared(self) -> None:
        wanted = [Path(JOURNAL), *self.untracked(self.skills()), *self.ignored([Path(p) for p in IGNORED_COPIES if (self.root / p).exists()])]
        self.excluded(wanted)
        self.cleared(self.path / JOURNAL)
        for path in wanted:
            self.linked(self.path / path, self.root / path)

    def skills(self) -> list[Path]:
        return [Path(folder) / entry.name for folder in SKILL_FOLDERS if (self.root / folder).is_dir() for entry in sorted((self.root / folder).iterdir())]

    def untracked(self, paths: list[Path]) -> list[Path]:
        tracked = {Path(name).parts[:3] for name in self.git("ls-files", "-z", "--", *map(str, paths)).stdout.split("\0") if name} if paths else set()
        return [path for path in paths if path.parts[:3] not in tracked]

    def ignored(self, paths: list[Path]) -> list[Path]:
        named = set(self.git("check-ignore", *map(str, paths)).stdout.splitlines()) if paths else set()
        return [path for path in paths if str(path) in named]

    def excluded(self, paths: list[Path]) -> None:
        exclude = Path(self.root, self.git("rev-parse", "--git-common-dir").stdout.strip(), "info", "exclude")
        exclude.parent.mkdir(parents=True, exist_ok=True)
        had = exclude.read_text() if exclude.is_file() else ""
        lines = [line for line in ("/.claude/worktrees/", *(f"/{path}" for path in paths)) if line not in had.splitlines()]
        if lines:
            exclude.write_text(had + ("" if had.endswith("\n") or not had else "\n") + "\n".join(lines) + "\n")

    def cleared(self, place: Path) -> None:
        if place.is_symlink() or not place.is_dir():
            return
        tracked = [name for name in self.git_in("ls-files", "-z", "--", JOURNAL).stdout.split("\0") if name]
        if tracked:
            self.git_in("update-index", "--skip-worktree", "--", *tracked)
        shutil.rmtree(place)

    @staticmethod
    def linked(place: Path, target: Path) -> None:
        if place.is_symlink() and place.resolve() == target.resolve():
            return
        if place.exists() and not place.is_symlink():
            return
        place.parent.mkdir(parents=True, exist_ok=True)
        fresh = place.with_name(f".{place.name}.{os.getpid()}.link")
        fresh.unlink(missing_ok=True)
        fresh.symlink_to(target, target_is_directory=target.is_dir())
        os.replace(fresh, place)

    def git_in(self, *args: str) -> subprocess.CompletedProcess:
        return subprocess.run(["git", "-C", str(self.path), *args], capture_output=True, text=True, timeout=GIT_SECONDS)

    def has(self, ref: str) -> bool:
        return self.git("rev-parse", "--verify", "--quiet", ref).returncode == 0

    def git(self, *args: str) -> subprocess.CompletedProcess:
        return subprocess.run(["git", "-C", str(self.root), *args], capture_output=True, text=True, timeout=GIT_SECONDS)
