from dataclasses import dataclass
from pathlib import Path

from engine.worktree import changed, contains, git, keep, linked, merged, present, roots, tip
from features.tickets.resource import Bases
from controllers.marks import action


@dataclass(frozen=True)
class Landing:
    place: Path
    branch: str
    base: str
    into: str

    def merged(self) -> bool:
        return merged(self.place, self.branch, self.base, self.into)

    def changed(self) -> bool:
        return changed(self.place, self.branch, self.base)

    def state(self) -> str:
        if self.merged():
            return "merged"
        return "changed" if self.changed() else "untouched"


class TicketLanding:
    def _off_branch(self, ticket) -> str:
        into = self._into(ticket)
        off = [(name, base) for name, place, base in self._repositories(ticket) if into != "HEAD" and base and not contains(place, base, into)]
        if not off:
            return ""
        name, base = off[0]
        where = "" if name == "." else f" in {name}"
        return (f"its branch {self._branch(ticket)}{where} started at {base[:9]}, which is not on {into}; tell its agent to rebase "
                f"onto {into} (git rebase --onto {into} {base[:9]}) before it is merged")

    def _repositories(self, ticket) -> list[tuple[str, Path, str]]:
        return [(name, place, ticket.base_of(name)) for name, place in roots(self.record.root.parent).items()]

    def _started_at(self, ticket, into: str) -> dict:
        branch = self._branch(ticket)
        return {name: tip(place, into) if not base or not present(place, f"refs/heads/{branch}") else base
                for name, place, base in self._repositories(ticket)}

    def _based(self, ticket, tips: dict[str, str]):
        bases = Bases.of(tips)
        return self.update(ticket.n, base=bases.root, bases=bases.nested)

    def _clean(self, ticket) -> bool:
        folders = [linked(place).get(ticket.work_environment) for _, place, _ in self._repositories(ticket)]
        return all(folder and not git(folder, "status", "--porcelain").stdout.strip() for folder in folders)

    @action
    def keep_branches(self) -> None:
        for ticket in (r for r in self.rows.standing() if r.work_environment):
            for _, place, _ in self._repositories(ticket):
                keep(place, ticket.work_environment, self._branch(ticket))

    def _branch(self, ticket) -> str:
        from providers import DRIVERS
        return DRIVERS[ticket.provider].branch(ticket.work_environment)

    def _merged(self, ticket) -> bool:
        branch, into = self._branch(ticket), self._into(ticket)
        states = [(landing.merged(), landing.changed()) for landing in (Landing(place, branch, base, into) for _, place, base in self._repositories(ticket))]
        return any(done for done, _ in states) and all(done or not moved for done, moved in states)

    def _into(self, ticket) -> str:
        board = self._board(ticket)
        return board.branch if board and board.branch else "HEAD"
