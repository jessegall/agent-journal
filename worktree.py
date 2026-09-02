"""Worktrees share the journal: a linked worktree's .journal is a symlink, never a copy.

A `git worktree add` checks the committed .journal/ out again, and from that moment two
journals drift: a pin written in the worktree is not in the main checkout, a to-do closed
in one is open in the other. The user's ruling: the journal folder in a worktree must be
symlinked, not copied.

DONE AT SESSION START, SAFELY. A linked worktree is known from git itself — its common
dir is the main checkout's .git — so the main .journal is found without guessing. If the
worktree's .journal is a plain directory that is CLEAN (nothing in it differs from what
is committed) it is replaced with a symlink and said once. If it is dirty, nothing is
deleted: every command and hook is REDIRECTED to the main journal for this session, and
the notice says the copy should go. Either way one record.
"""
from __future__ import annotations

import shutil
import subprocess
from pathlib import Path


def _git(cwd: Path, *args: str) -> str | None:
    try:
        p = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, timeout=10)
    except (OSError, subprocess.TimeoutExpired):
        return None
    return p.stdout.strip() if p.returncode == 0 else None


def main_root(project: Path) -> Path | None:
    """The main checkout's root if `project` is a LINKED worktree, else None."""
    common = _git(project, "rev-parse", "--git-common-dir")
    own = _git(project, "rev-parse", "--git-dir")
    if not common or not own:
        return None
    common_p = (project / common).resolve() if not Path(common).is_absolute() else Path(common).resolve()
    own_p = (project / own).resolve() if not Path(own).is_absolute() else Path(own).resolve()
    if common_p == own_p:
        return None
    root = common_p.parent
    return root if (root / ".journal" / "journal.py").is_file() else None


_ARTIFACTS = ("runtime", "__pycache__")


def _dirty(project: Path, root: Path) -> bool:
    """Does this copy hold anything a delete would lose?

    JUDGED BY WALKING, NOT BY ASKING GIT ALONE. The exclude written by `_hide_from_git`
    hides untracked files under .journal from `git status`, so a copy with a new file
    would read as clean and be deleted. So: a tracked file modified (git knows), or any
    file present that git does not track and that is not a runtime artifact.
    """
    status = _git(project, "status", "--porcelain", "--", ".journal")
    if status is None or status.strip():
        return True
    tracked = set((_git(project, "ls-files", "--", ".journal") or "").splitlines())
    for f in root.rglob("*"):
        if not f.is_file():
            continue
        rel = f.relative_to(project).as_posix()
        parts = f.relative_to(root).parts
        if parts and parts[0] in _ARTIFACTS or f.suffix in (".lock", ".tmp", ".pyc"):
            continue
        if rel not in tracked:
            return True
    return False


def _hide_from_git(project: Path) -> None:
    """After the symlink: git in this worktree must never see .journal as changed.

    THE SYMLINK REPLACES A TRACKED DIRECTORY, so without this git sees every tracked file
    under .journal/ as deleted and the link as new, and the next `git add -A` in the
    worktree commits a symlink — measured: a release commit whose .journal was a link to
    itself. So every tracked path under .journal/ is marked skip-worktree, which makes
    git ignore that it is gone, and the link itself goes in the repository's exclude file,
    which makes git ignore that it is there. A commit in the worktree then touches
    .journal not at all; the main checkout commits the real one.
    """
    tracked = _git(project, "ls-files", "--", ".journal") or ""
    for line in tracked.splitlines():
        if line.strip():
            _git(project, "update-index", "--skip-worktree", "--", line.strip())
    common = _git(project, "rev-parse", "--git-common-dir")
    if common:
        exclude = (project / common if not Path(common).is_absolute() else Path(common)) / "info" / "exclude"
        try:
            have = exclude.read_text() if exclude.is_file() else ""
            if "/.journal\n" not in have + "\n":
                exclude.parent.mkdir(parents=True, exist_ok=True)
                exclude.write_text(have.rstrip("\n") + ("\n" if have.strip() else "") + "/.journal\n")
        except OSError:
            pass


def resolve(root: Path) -> tuple[Path, str]:
    """(the .journal to use, a note or ""). Links a clean copy; redirects a dirty one."""
    project = root.parent
    if root.is_symlink():
        return root.resolve(), ""
    main = main_root(project)
    if main is None:
        return root, ""
    target = main / ".journal"
    if target.resolve() == root.resolve():
        return root, ""
    if not _dirty(project, root):
        try:
            shutil.rmtree(root)
            root.symlink_to(target, target_is_directory=True)
            _hide_from_git(project)
            return target, (f"journal: this is a worktree of {main.name}; its checked-out copy of .journal was "
                            f"replaced with a symlink to the main checkout's, so both share one record.")
        except OSError as e:
            return target, f"journal: could not link .journal to {target} ({e}); using the main journal directly."
    return target, (f"journal: this is a worktree of {main.name}, and its .journal is a copy with local changes. "
                    f"Using the main checkout's journal instead. Move anything you need out of the copy, then "
                    f"`journal worktree link` replaces it with a symlink.")


def link(root: Path) -> tuple[bool, str]:
    """`journal worktree link`: replace a copy with the symlink, whatever its state."""
    project = root.parent
    if root.is_symlink():
        return True, f".journal already links to {root.resolve()}"
    main = main_root(project)
    if main is None:
        return False, "this is not a linked worktree (or the main checkout has no .journal); nothing to link"
    target = main / ".journal"
    keep = project / ".journal.copy"
    if keep.exists():
        shutil.rmtree(keep)
    root.rename(keep)
    root.symlink_to(target, target_is_directory=True)
    _hide_from_git(project)
    return True, (f".journal now links to {target}\n  the old copy is at .journal.copy — delete it once "
                  "nothing in it is missed")
