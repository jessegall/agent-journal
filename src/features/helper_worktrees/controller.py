import re
from dataclasses import dataclass
from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from engine import runtime
from engine.state import State
from engine.wording import plural
from features.agent_sessions.launch import running_at
from engine.worktree import contains, current_branch, freed, git, included, lines, link_folders, present, scratch_cleared, share_journal, tip
from providers import workspace_folders
from features.helper_worktrees.resource import Worktree
from controllers.types import Agents, Todos
from resources.base import Refused, SYSTEM
from controllers.marks import action

NAMED = re.compile(r"^[a-z0-9][a-z0-9-]{0,39}$")
BRANCH = "helper-"
KEPT = "refs/journal/helpers"
SHOWN = 5
VIEWER_TEXT = ("src/web/src/*.vue", "src/web/src/*.js", "src/features/*/details.py")
WORDED = re.compile(r"^\+(?!\+\+).*[\"'`][A-Z][a-z]+ [a-z][^\"'`]{6,}[\"'`]")
CHECKED_TIPS = "worktree-tips.json"


@dataclass(frozen=True)
class Drift:
    working: str
    base: str
    tip: str
    gained: tuple[str, ...]
    current: bool

    @property
    def commits(self) -> str:
        first = "; ".join(self.gained[:SHOWN]) + (f"; and {len(self.gained) - SHOWN} more" if len(self.gained) > SHOWN else "")
        return f"{plural(len(self.gained), 'commit')} ({first})"


def within(folder: Path, places: tuple[Path, ...], commands: tuple[str, ...]) -> bool:
    named = re.compile(re.escape(str(folder)) + r"(?![\w.-])")
    return any(place == folder or folder in place.parents for place in places) or any(named.search(said) for said in commands)


class Worktrees(Controller):
    resource = Worktree

    @action(network=True)
    def cut(self, name: str, helper: str = "") -> str:
        row = self._cut(name, helper)
        self._marked("Cut worktree", row)
        return (f"worktree {row.n}: {row.path} on branch {row.branch}, cut from {row.working} at {row.base[:10]}. "
                f"Tell the helper to work and commit only there, and to rebase onto {row.working} before it reports.")

    def _cut(self, name: str, helper: str = ""):
        if not NAMED.match(name):
            raise Refused(f"a worktree name is lowercase letters, digits and dashes, not {name!r}")
        project = self._project()
        working = self._working(project)
        folder, branch = project.joinpath(*workspace_folders().worktree_home, name), f"{BRANCH}{name}"
        base = tip(project, working)
        if not base:
            raise Refused(f"{working} has no commits yet, so there is nothing to cut from: make a first commit")
        finished = self.rows.by_title(name, standing=True)
        if finished and self._reusable(finished):
            return self._reused(finished, working, base, helper)
        if finished or folder.exists() or present(project, f"refs/heads/{branch}"):
            raise Refused(f"the worktree {name} is taken: drop it, or choose another name")
        made = git(project, "worktree", "add", "-q", "-b", branch, str(folder), base)
        if made.returncode:
            raise Refused(f"the worktree {name} could not be made: {made.stderr.strip()}")
        included(project, folder)
        link_folders(project, folder)
        share_journal(folder, self.record.root, workspace_folders())
        return self.create(name, path=str(folder), branch=branch, working=working, base=base, helper=helper)

    def _reusable(self, row) -> bool:
        """A worktree whose work was taken, that no agent runs in and that holds nothing unsaved is cut again for the same name instead of a second one."""
        folder = Path(row.path) if row.path else None
        return bool(row.taken and not row.adopted and folder and folder.is_dir() and not running_at(self.record.root, folder) and not lines(folder, "status", "--porcelain"))

    def _reused(self, row, working: str, base: str, helper: str):
        """Moves a finished worktree to the working branch's tip, keeping what its branch held under the ref of the dropped ones."""
        project, folder = self._project(), Path(row.path)
        if row.branch and present(project, f"refs/heads/{row.branch}"):
            git(project, "update-ref", f"{KEPT}/{row.title}", f"refs/heads/{row.branch}")
        moved = git(folder, "checkout", "-q", "-B", row.branch, base)
        if moved.returncode:
            raise Refused(f"the worktree {row.title} could not be reused: {(moved.stderr or moved.stdout).strip()}")
        return self.update(row.n, working=working, base=base, helper=helper, taken="")

    @action
    def drift(self, n: int) -> str:
        row = self._unfinished(n, "dropped")
        found = self._drift(row)
        moved = f"{found.working} gained {found.commits} since the cut" if found.gained else f"{found.working} has not moved since the cut"
        return f"{moved}; {row.branch} {'contains' if found.current else 'does not contain'} its tip {found.tip[:10]}"

    @action(network=True)
    def take(self, n: int, reviewed: bool = False) -> str:
        row = self._unfinished(n, "dropped")
        project = self._project()
        if self._working(project) != row.working:
            raise Refused(f"the main checkout is not on {row.working}; switch it back before taking worktree {n}")
        found = self._drift(row)
        if not found.current:
            raise Refused(f"{row.branch} does not contain the tip of {row.working}, which gained {found.commits}: "
                          f"rebase it onto {row.working} in {row.path} first")
        commits = lines(project, "rev-list", "--reverse", f"{row.working}..{row.branch}")
        if not commits:
            raise Refused(f"{row.branch} has no commits beyond {row.working}: nothing to take")
        if lines(project, "rev-list", "--merges", f"{row.working}..{row.branch}"):
            raise Refused(f"{row.branch} carries merge commits: rebase it onto {row.working} so its history is a straight line")
        touched = lines(project, "diff", "--name-only", f"{row.working}...{row.branch}")
        dirty = lines(project, "status", "--porcelain", "--", *touched)
        if dirty:
            raise Refused(f"the main checkout has changes in files this take would touch: {', '.join(line[3:] for line in dirty)}; commit or move them first")
        worded = [line[1:].strip() for line in lines(project, "diff", "-U0", f"{row.working}...{row.branch}", "--", *VIEWER_TEXT) if WORDED.match(line)]
        if worded and not reviewed:
            raise Refused(f"{row.branch} changes {plural(len(worded), 'line')} of text people read in the viewer, such as {worded[0][:120]!r}: "
                          f"before taking it, have a read-only subagent read only those lines (git diff {row.working}...{row.branch} -- "
                          f"{' '.join(VIEWER_TEXT)}) against rule 59 and return the text now and plain dashboard wording; send the fixes "
                          f"to the helper, then journal worktree take {n} --reviewed")
        picked = git(project, "cherry-pick", *commits)
        if picked.returncode:
            git(project, "cherry-pick", "--abort")
            raise Refused(f"the cherry-pick stopped and was undone: {(picked.stderr or picked.stdout).strip()}")
        self.update(row.n, taken=tip(project, row.branch))
        landed = self._land(row)
        self._marked("Took work from worktree", row)
        return (f"took {plural(len(commits), 'commit')} from {row.branch} onto {row.working}, now at {tip(project, row.working)[:10]}"
                + (f"; closed to-do {', '.join(str(n) for n in landed)}" if landed else ""))

    def _land(self, row) -> list[int]:
        listed = Todos(self.record, actor=SYSTEM)
        waiting = self._waiting(row)
        for todo in waiting:
            listed.complete(todo.n, f"{todo.merge_wait.how} (taken from {row.branch})")
        return [t.n for t in waiting]

    def _waiting(self, row) -> list:
        return [t for t in Todos(self.record, actor=SYSTEM).rows.standing() if t.merge_wait.worktree == str(row.n)]

    def _adopt(self, folder: Path, helper: str):
        """Follows a checkout a helper was launched into though the journal did not cut it, so it hears when the branch it came from moves; one of another repository has no such branch."""
        project = self._project()
        repository = common_dir(folder)
        if folder == project or repository is None or repository != common_dir(project):
            return None
        upstream = git(folder, "rev-parse", "--abbrev-ref", "@{upstream}")
        working = upstream.stdout.strip() if upstream.returncode == 0 else self._working(project)
        base = git(folder, "merge-base", working, "HEAD").stdout.strip() or tip(project, working)
        title = f"{helper.lower().replace(' ', '-')}-checkout"
        for earlier in self.rows.standing():
            if earlier.title == title:
                super().complete(earlier.n, "replaced by a newer checkout of the same helper")
        return self.create(title, path=str(folder), branch=current_branch(folder), working=working, base=base, helper=helper, adopted=True)

    def _released(self, helper: str) -> None:
        for row in (r for r in self.rows.standing() if r.adopted and r.helper == helper):
            super().complete(row.n, "its helper finished; the checkout is left as it was")

    @action(network=True)
    def complete(self, n: int, how: str = "", **data):
        row = self._unfinished(n, "dropped")
        if row.adopted:
            return super().complete(n, how or "released; the checkout is left as it was", **data)
        project = self._project()
        folder = Path(row.path) if row.path else None
        if folder and folder.is_dir():
            if running_at(self.record.root, folder):
                raise Refused(f"an agent is still running in {folder}: stop its helper first (journal helper stop <n>), then drop the worktree")
            if lines(folder, "status", "--porcelain"):
                self._committed(folder, row)
            git(project, "worktree", "remove", str(folder))
            scratch_cleared(folder)
        if row.branch and present(project, f"refs/heads/{row.branch}"):
            git(project, "update-ref", f"{KEPT}/{row.title}", f"refs/heads/{row.branch}")
            git(project, "branch", "-D", row.branch)
        listed = Todos(self.record, actor=SYSTEM)
        for todo in self._waiting(row):
            listed.unassign(todo.n)
        self._marked("Dropped worktree", row)
        return super().complete(n, how or f"dropped; its last commit is kept at {KEPT}/{row.title}", **data)

    @action(network=True)
    def renew(self, n: int) -> str:
        """Moves a kept helper's worktree onto the working branch for its next job: its commits are rebased onto the branch's tip, and a rebase that stops is undone and left to the helper."""
        row = self._unfinished(n, "dropped")
        folder = Path(row.path) if row.path else None
        if row.adopted or not folder or not folder.is_dir() or running_at(self.record.root, folder) or lines(folder, "status", "--porcelain"):
            return f"worktree {row.n} stays as it is"
        moved = git(folder, "rebase", "-q", row.working)
        if moved.returncode:
            git(folder, "rebase", "--abort")
            return f"worktree {row.n} did not rebase onto {row.working}: {(moved.stderr or moved.stdout).strip()}; rebase it in {folder}"
        self.update(row.n, base=tip(self._project(), row.working), taken="")
        return f"worktree {row.n} is on {row.working} at {tip(self._project(), row.working)[:10]}"

    def _committed(self, folder: Path, row) -> None:
        """Keeps the output a helper left uncommitted as one commit on its branch, so freeing the worktree loses nothing."""
        git(folder, "add", "-A")
        made = git(folder, "commit", "-q", "-m", f"Work {row.title} left uncommitted when its worktree was freed")
        if made.returncode:
            raise Refused(f"{folder} has changes that could not be committed to {row.branch}: {(made.stderr or made.stdout).strip()}")

    def _marked(self, label: str, row) -> None:
        Agents(self.record, actor=SYSTEM)._mark_primary(label, name=row.title, icon="branch", detail=row.branch)

    def _drift(self, row) -> Drift:
        project = self._project()
        now = tip(project, row.working)
        if not now or not row.base:
            raise Refused(f"worktree {row.n} has no working branch to measure against")
        gained = tuple(lines(project, "log", "--format=%h %s", f"{row.base}..{now}"))
        return Drift(row.working, row.base, now, gained, bool(row.branch) and contains(project, now, row.branch))

    def _drifted(self, places: tuple[Path, ...], commands: tuple[str, ...]):
        project = self._project()
        checked = self._checked_tips()
        for row in self.rows.standing():
            if not row.path or not within(Path(row.path), places, commands) or checked.get(str(row.n)) == tip(project, row.working):
                continue
            found = self._drift(row)
            checked.set(str(row.n), found.tip)
            if not found.current:
                return row, found
        return None

    def _checked_tips(self) -> State:
        return State(runtime.folder(self.record.root) / CHECKED_TIPS)

    def _project(self) -> Path:
        return self.record.root.resolve().parent

    def _working(self, project: Path) -> str:
        working = current_branch(project)
        if not working:
            raise Refused(f"{project} is on no branch, so there is no working branch to cut from")
        return working



def common_dir(where: Path) -> str | None:
    """The repository a folder belongs to, or None when git reads no repository there."""
    found = git(where, "rev-parse", "--path-format=absolute", "--git-common-dir")
    return found.stdout.strip() if found.returncode == 0 else None


resources_module.register(Worktree)
types_module.register(Worktrees)
