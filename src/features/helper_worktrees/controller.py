import re
from dataclasses import dataclass
from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from engine.worktree import WORKTREES, contains, current_branch, git, included, present, share_journal, tip
from features.helper_worktrees.resource import Worktree
from resources.base import Refused
from controllers.marks import lasting

NAMED = re.compile(r"^[a-z0-9][a-z0-9-]{0,39}$")
BRANCH = "helper-"
KEPT = "refs/journal/helpers"
SHOWN = 5


@dataclass(frozen=True)
class Drift:
    working: str
    base: str
    tip: str
    gained: tuple[str, ...]
    current: bool

    @property
    def told(self) -> str:
        shown = "; ".join(self.gained[:SHOWN]) + (f"; and {len(self.gained) - SHOWN} more" if len(self.gained) > SHOWN else "")
        return f"{len(self.gained)} commit{'s' if len(self.gained) != 1 else ''} ({shown})"


def listed(project: Path, *args: str) -> list[str]:
    return [line for line in git(project, *args).stdout.splitlines() if line.strip()]


def within(folder: Path, places: tuple[Path, ...], commands: tuple[str, ...]) -> bool:
    named = re.compile(re.escape(str(folder)) + r"(?![\w.-])")
    return any(place == folder or folder in place.parents for place in places) or any(named.search(said) for said in commands)


class Worktrees(Controller):
    resource = Worktree

    @lasting
    def cut(self, name: str, helper: str = "") -> str:
        if not NAMED.match(name):
            raise Refused(f"a worktree name is lowercase letters, digits and dashes, not {name!r}")
        project = self._project()
        working = self._working(project)
        folder, branch = project.joinpath(*WORKTREES, name), f"{BRANCH}{name}"
        if self._titled(name, standing=True) or folder.exists() or present(project, f"refs/heads/{branch}"):
            raise Refused(f"the worktree {name} is taken: drop it, or choose another name")
        base = tip(project, working)
        made = git(project, "worktree", "add", "-q", "-b", branch, str(folder), base)
        if made.returncode:
            raise Refused(f"the worktree {name} could not be made: {made.stderr.strip()}")
        included(project, folder)
        share_journal(folder, self.record.root)
        row = self.create(name, path=str(folder), branch=branch, working=working, base=base, helper=helper)
        return (f"worktree {row.n}: {folder} on branch {branch}, cut from {working} at {base[:10]}. "
                f"Tell the helper to work and commit only there, and to rebase onto {working} before it reports.")

    def drift(self, n: int) -> str:
        row = self._unfinished(n, "dropped")
        found = self._drift(row)
        moved = f"{found.working} gained {found.told} since the cut" if found.gained else f"{found.working} has not moved since the cut"
        return f"{moved}; {row.branch} {'contains' if found.current else 'does not contain'} its tip {found.tip[:10]}"

    @lasting
    def take(self, n: int) -> str:
        row = self._unfinished(n, "dropped")
        project = self._project()
        if self._working(project) != row.working:
            raise Refused(f"the main checkout is not on {row.working}; switch it back before taking worktree {n}")
        found = self._drift(row)
        if not found.current:
            raise Refused(f"{row.branch} does not contain the tip of {row.working}, which gained {found.told}: "
                          f"rebase it onto {row.working} in {row.path} first")
        commits = listed(project, "rev-list", "--reverse", f"{row.working}..{row.branch}")
        if not commits:
            raise Refused(f"{row.branch} has no commits beyond {row.working}: nothing to take")
        if listed(project, "rev-list", "--merges", f"{row.working}..{row.branch}"):
            raise Refused(f"{row.branch} carries merge commits: rebase it onto {row.working} so its history is a straight line")
        touched = listed(project, "diff", "--name-only", f"{row.working}...{row.branch}")
        dirty = listed(project, "status", "--porcelain", "--", *touched)
        if dirty:
            raise Refused(f"the main checkout has changes in files this take would touch: {', '.join(line[3:] for line in dirty)}; commit or move them first")
        picked = git(project, "cherry-pick", *commits)
        if picked.returncode:
            git(project, "cherry-pick", "--abort")
            raise Refused(f"the cherry-pick stopped and was undone: {(picked.stderr or picked.stdout).strip()}")
        self.update(row.n, taken=tip(project, row.branch))
        return f"took {len(commits)} commit{'s' if len(commits) != 1 else ''} from {row.branch} onto {row.working}, now at {tip(project, row.working)[:10]}"

    @lasting
    def complete(self, n: int, how: str = "", **data):
        row = self._unfinished(n, "dropped")
        project = self._project()
        folder = Path(row.path) if row.path else None
        if folder and folder.is_dir():
            if listed(folder, "status", "--porcelain"):
                raise Refused(f"{folder} has uncommitted changes: commit them, or remove them, before dropping it")
            git(project, "worktree", "remove", str(folder))
        if row.branch and present(project, f"refs/heads/{row.branch}"):
            git(project, "update-ref", f"{KEPT}/{row.title}", f"refs/heads/{row.branch}")
            git(project, "branch", "-D", row.branch)
        return super().complete(n, how or f"dropped; its last commit is kept at {KEPT}/{row.title}", **data)

    def _drift(self, row) -> Drift:
        project = self._project()
        now = tip(project, row.working)
        if not now or not row.base:
            raise Refused(f"worktree {row.n} has no working branch to measure against")
        gained = tuple(listed(project, "log", "--format=%h %s", f"{row.base}..{now}"))
        return Drift(row.working, row.base, now, gained, bool(row.branch) and contains(project, now, row.branch))

    def _has_new_tip(self, row) -> bool:
        return row.told != tip(self._project(), row.working)

    def _touched(self, places: tuple[Path, ...], commands: tuple[str, ...]) -> list:
        return [row for row in self._standing() if row.path and within(Path(row.path), places, commands)]

    def _told(self, row, now: str) -> None:
        self.update(row.n, told=now)

    def _project(self) -> Path:
        return self.record.root.resolve().parent

    def _working(self, project: Path) -> str:
        working = current_branch(project)
        if not working:
            raise Refused(f"{project} is on no branch, so there is no working branch to cut from")
        return working


resources_module.register(Worktree)
types_module.register(Worktrees)
