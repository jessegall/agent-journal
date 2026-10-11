from dataclasses import dataclass
from pathlib import Path

from engine.worktree import Repository, contains, discarded, git, linked, present, roots, scratch_cleared, tip
from features.tickets.resource import Bases
from controllers.marks import action


@dataclass(frozen=True)
class Landing:
    repository: Repository
    branch: str
    base: str
    into: str

    def merged(self) -> bool:
        return self.repository.merged(self.branch, self.base, self.into)

    def changed(self) -> bool:
        return self.repository.changed(self.branch, self.base)

    def state(self) -> str:
        if self.merged():
            return "merged"
        return "changed" if self.changed() else "untouched"


class TicketLanding:
    def _off_branch(self, ticket) -> str:
        into = self._into(ticket)
        off = [(name, base) for name, place, base in self._repositories(ticket) if into != "HEAD" and base and not contains(place, base, self._into_at(ticket, name, place))]
        if not off:
            return ""
        name, base = off[0]
        where = "" if name == "." else f" in {name}"
        return (f"its branch {self._branch(ticket)}{where} started at {base[:9]}, which is not on {into}; tell its agent to rebase "
                f"onto {into} (git rebase --onto {into} {base[:9]}) before it is merged")

    def _repositories(self, ticket) -> list[tuple[str, Path, str]]:
        return [(name, place, ticket.base_of(name)) for name, place in roots(self.record.root.parent).items()]

    def _started_at(self, ticket) -> dict:
        branch = self._branch(ticket)
        return {name: tip(place, self._into_at(ticket, name, place)) if not base or not present(place, f"refs/heads/{branch}") else base
                for name, place, base in self._repositories(ticket)}

    def _landed_at(self, ticket) -> dict:
        """Where its branch stands in each repository, so work is counted from here on."""
        ref = f"refs/heads/{self._branch(ticket)}"
        return {name: tip(place, ref) if present(place, ref) else base for name, place, base in self._repositories(ticket)}

    def _based(self, ticket, tips: dict[str, str]):
        bases = Bases.of(tips)
        return self.update(ticket.n, base=bases.root, bases=bases.nested)

    def _discard_failed_start(self, ticket) -> None:
        """A start that left a base but never reached its agent leaves worktrees and branches at the wrong place; a retry takes them away and starts over."""
        from providers import workspace_folders
        project, branch = self.record.root.parent, self._branch(ticket)
        folder = project.joinpath(*workspace_folders().worktree_home, ticket.work_environment)
        for name, repo, _ in self._repositories(ticket):
            discarded(repo, folder if name == "." else folder / name, branch, ticket.work_environment)

    def _clean(self, ticket) -> bool:
        folders = [linked(place).get(ticket.work_environment) for _, place, _ in self._repositories(ticket)]
        return all(folder and not git(folder, "status", "--porcelain").stdout.strip() for folder in folders)

    @action
    def clear_worktrees(self) -> list[str]:
        """Removes the worktree of every closed ticket whose branch is kept and that no agent runs in, with the scratch folder of its agent; the branch stays, and starting the ticket again cuts the worktree from it."""
        from features.agent_sessions.launch import running_at
        closed = [r for r in self.rows.every() if r.completed and r.work_environment]
        cleared = []
        for repository in self._read().values() if closed else ():
            held = repository.linked()
            for ticket in closed:
                folder = held.get(ticket.work_environment)
                if folder is None or running_at(self.record.root, folder) or not repository.has(self._branch(ticket)):
                    continue
                if repository.freed(folder):
                    scratch_cleared(folder)
                    cleared.append(ticket.work_environment)
        return cleared

    @action
    def keep_branches(self) -> None:
        readings = self._read()
        for ticket in (r for r in self.rows.standing() if r.work_environment):
            for repository in readings.values():
                repository.keep(ticket.work_environment, self._branch(ticket))

    def _read(self) -> dict[str, Repository]:
        """Each repository of the project as git reports it now, for one sweep."""
        return {name: Repository(place) for name, place in roots(self.record.root.parent).items()}

    def _landings(self, ticket, readings: dict[str, Repository]) -> dict[str, Landing]:
        branch = self._branch(ticket)
        return {name: Landing(repository, branch, ticket.base_of(name), self._into_in(ticket, name, repository)) for name, repository in readings.items()}

    def _branch(self, ticket) -> str:
        from providers import DRIVERS
        return DRIVERS[ticket.provider].branch(ticket.work_environment)

    def _merged(self, ticket) -> bool:
        return self._merged_in(ticket, self._read())

    def _merged_in(self, ticket, readings: dict[str, Repository]) -> bool:
        states = [(landing.merged(), landing.changed()) for landing in self._landings(ticket, readings).values()]
        return any(done for done, _ in states) and all(done or not moved for done, moved in states)

    def _into(self, ticket) -> str:
        board = self._board(ticket)
        return board.branch if board and board.branch else "HEAD"

    def _into_at(self, ticket, name: str, place: Path) -> str:
        return self._into_in(ticket, name, Repository(place))

    def _into_in(self, ticket, name: str, repository: Repository) -> str:
        """The branch a ticket starts from and lands on in one repository: the board's in the project's own, the checked-out one in a nested repository."""
        into = self._into(ticket)
        return into if into == "HEAD" or name == "." else repository.current or "HEAD"
