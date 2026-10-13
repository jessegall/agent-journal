import threading

from controllers.base import Controller
from resources import types
from controllers.marks import action

WHICH = "fault"
ONCE = threading.Lock()
RAISING: set[tuple[str, str]] = set()
"""The notices being written right now, so a raise that reaches back into one of them answers instead of waiting: writing a notice reads rows, and a damaged row among them asks for the very notice being written."""


class Notices(Controller):
    resource = types.Notice

    @action
    def complete(self, n: int, how: str = "", **data):
        found = self.load(n)
        return found if found.completed else super().complete(n, how=how, **data)

    def _damaged(self, path: str, error: str) -> None:
        pass

    def raise_once(self, title: str, brief: str, which: str = "") -> bool:
        """Writes the notice unless it stands already or is being written. The lock is held over the claim alone: create reads rows, a damaged row among them asks for this same notice, and a lock held across that call is a thread waiting for itself."""
        if not self._claimed(title, which):
            return False
        try:
            self.create(title, brief=brief, tone="warn", **{WHICH: which})
        finally:
            with ONCE:
                RAISING.discard((title, which))
        return True

    def stands(self, title: str, which: str = "") -> bool:
        """Whether a notice of this title and place is standing."""
        return any(n.title == title and n.data.get(WHICH, "") == which for n in self.rows.standing())

    def _claimed(self, title: str, which: str) -> bool:
        """Whether this call is the one that writes the notice: it is not standing and nobody else is writing it."""
        with ONCE:
            if (title, which) in RAISING or self.stands(title, which):
                return False
            RAISING.add((title, which))
            return True

    def close_titled(self, title: str, how: str) -> None:
        for n in self.rows.every():
            if not n.completed and n.title == title:
                self.complete(n.n, how)
