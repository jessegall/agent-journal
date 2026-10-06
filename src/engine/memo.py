from typing import Callable

MEMOS: list["Memo"] = []


class Memo:
    def __init__(self, limit: int = 0):
        self.held: dict = {}
        self.limit = limit
        MEMOS.append(self)

    def get(self, key, stamp, make: Callable):
        held = self.held.get(key)
        if held is not None and (held[0] is stamp or held[0] == stamp):
            return held[1]
        return self.put(key, stamp, make())

    def put(self, key, stamp, value):
        if self.limit and len(self.held) >= self.limit and key not in self.held:
            self.held.pop(next(iter(self.held)))
        self.held[key] = (stamp, value)
        return value

    def forget(self, key) -> None:
        self.held.pop(key, None)

    def clear(self) -> None:
        self.held.clear()


def forget_all() -> None:
    for memo in MEMOS:
        memo.clear()
