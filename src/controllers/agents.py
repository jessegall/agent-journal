import time

from controllers.base import Controller
from engine.sessions import Sessions
from resources import types
from controllers.marks import action

KEPT_CARDS = 50




OFFLINE, IDLE_STATE, WORKING_STATE, SILENT = "offline", "idle", "working", "silent"
REPORT_WITHIN = 30.0


class Agents(Controller):
    resource = types.AgentRow

    @action
    def by_session(self, session: str):
        return self.rows.by_title(session) or self.create(session, status="stopped")

    def _shared(self, session: str):
        memo = self.record.memo
        if memo is None:
            return self.by_session(session)
        if (self.type, session) not in memo:
            memo[self.type, session] = self.by_session(session)
        return memo[self.type, session]

    def saw(self, n: int, fact: dict, **data):
        return self._changed(n, "reported", data, **fact)

    def subagent(self, n: int, action: str, **data):
        return self._emit(int(n), action, **data)

    def card(self, n: int, **card):
        row = self.load(n)
        cards = row.data.get("cards") or []
        key = card.get("key")
        if key and any(kept.get("key") == key for kept in cards):
            return self.update(row.n, cards=[{**kept, **card} if kept.get("key") == key else kept for kept in cards])
        if "label" not in card:
            return row
        return self.appended(row, "cards", {"at": time.time(), **card}, KEPT_CARDS)

    def drop_card(self, n: int, key: str):
        row = self.load(n)
        return self.update(row.n, cards=[kept for kept in row.data.get("cards") or [] if kept.get("key") != key])

    @action
    def stop_task(self, n: int, task: str, description: str = ""):
        if not task.strip():
            self._refuse("name the task to stop")
        return self._stopping(int(n), task=task.strip(), description=description.strip() or task.strip())

    def _session_or_primary(self, session: str):
        return self.rows.by_title(session) if session else self.primary()

    @action
    def primary(self):
        n = self._primary_n()
        return self.load(n) if n is not None else None

    def primary_to_read(self):
        n = self._primary_n()
        return self.rows.peek(n) if n is not None else None

    def _primary_n(self) -> int | None:
        standing = [row for row in self.rows.summaries() if not row["deleted"] and not row["completed"] and not row.get("parent")]
        latest = max(standing, key=lambda row: 0.0 if row["at"] is None else float(row["at"]), default=None)
        return latest["n"] if latest is not None else None

    def state(self, environment: str) -> str:
        sessions = Sessions(self.record.root)
        holder = sessions.holder(environment)
        if not holder:
            return OFFLINE
        row = self.rows.by_title(holder)
        if row is not None and row.data.get("status") in (types.BUSY, types.WORKING):
            return WORKING_STATE
        if (row is None or not row.data.get("event")) and time.time() - sessions.read(holder).since > REPORT_WITHIN:
            return SILENT
        return IDLE_STATE
