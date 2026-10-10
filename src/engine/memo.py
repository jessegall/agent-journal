import threading
from typing import Callable

MEMOS: list["Memo"] = []


class Memo:
    def __init__(self, limit: int = 0):
        self.held: dict = {}
        self.limit = limit
        self.keeping = threading.Lock()
        MEMOS.append(self)

    def contains(self, key) -> bool:
        return key in self.held

    def get(self, key, stamp, make: Callable):
        held = self.held.get(key)
        if held is not None and (held[0] is stamp or held[0] == stamp):
            if self.limit:
                self.held[key] = self.held.pop(key)
            return held[1]
        return self.put(key, stamp, make())

    def put(self, key, stamp, value):
        """Keeps a value and drops the oldest once the limit is reached, holding the drop because the background writes to the same memo as the request does."""
        with self.keeping:
            while self.limit and len(self.held) >= self.limit and key not in self.held:
                self.held.pop(next(iter(self.held), None), None)
            self.held[key] = (stamp, value)
        return value

    def forget(self, key) -> None:
        self.held.pop(key, None)

    def forget_mentioning(self, words) -> None:
        self.held = {key: held for key, held in list(self.held.items()) if not any(word in str(held[1]) for word in words)}

    def clear(self) -> None:
        self.held.clear()


def forget_all() -> None:
    for memo in MEMOS:
        memo.clear()
