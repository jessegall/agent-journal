import time

from controllers.base import Controller, internal
from resources import types

KEPT_CARDS = 50



def reported_at(row: dict) -> float:
    at = row.get("at")
    return 0.0 if at is None else float(at)

class Agents(Controller):
    resource = types.AgentRow

    def by_session(self, session: str):
        return self._titled(session) or self.create(session, status="stopped")

    def _shared(self, session: str):
        memo = self.record.memo
        if memo is None:
            return self.by_session(session)
        if (self.type, session) not in memo:
            memo[self.type, session] = self.by_session(session)
        return memo[self.type, session]

    @internal
    def saw(self, n: int, fact: dict, **data):
        r = self.load(n)
        r.data.update(self._shaped(data))
        return self.save(r, "reported", **fact)

    @internal
    def subagent(self, n: int, action: str, **data):
        return self.record.emit(self.type, int(n), action, self.actor, **data)

    @internal
    def card(self, n: int, **card):
        row = self.load(n)
        cards = row.data.get("cards") or []
        key = card.get("key")
        if key and any(kept.get("key") == key for kept in cards):
            return self.update(row.n, cards=[{**kept, **card} if kept.get("key") == key else kept for kept in cards])
        return self.update(row.n, cards=[*cards, {"at": time.time(), **card}][-KEPT_CARDS:])

    def stop_task(self, n: int, task: str, description: str = ""):
        if not task.strip():
            self._refuse("name the task to stop")
        return self._stopping(int(n), task=task.strip(), description=description.strip() or task.strip())

    def primary(self):
        rows = [row for row in self.summaries() if not row["deleted"] and not row["completed"] and not row.get("parent")]
        found = max(rows, key=reported_at, default=None)
        return self.load(found["n"]) if found else None
