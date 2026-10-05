import threading

from controllers.base import Controller
from resources import types
from controllers.marks import action

WHICH = "fault"
ONCE = threading.Lock()


class Notices(Controller):
    resource = types.Notice

    @action
    def complete(self, n: int, how: str = "", **data):
        found = self.load(n)
        return found if found.completed else super().complete(n, how=how, **data)

    def _damaged(self, path: str, error: str) -> None:
        pass

    def raise_once(self, title: str, brief: str, which: str = "") -> bool:
        with ONCE:
            if any(n.title == title and n.data.get(WHICH, "") == which for n in self._standing()):
                return False
            self.create(title, brief=brief, tone="warn", **{WHICH: which})
            return True

    def close_titled(self, title: str, how: str) -> None:
        for n in self._every():
            if not n.completed and n.title == title:
                self.complete(n.n, how)
