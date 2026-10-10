import time

from controllers.base import Controller
from engine.sessions import Sessions
from resources import types
from controllers.marks import action

KEPT_CARDS = 50
MOVED_TO_BACKGROUND = "Moved a long command to the background"




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
        row = self._changed(n, "reported", data, **fact)
        if self.record.memo is not None:
            self.record.memo[self.type, row.title] = row
        return row

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

    def _moved_to_background(self, run, row, **card):
        """The one card for a long command that carries on in the background, whichever provider's agent runs it: it names the call that runs, and a second call for the same call adds to the same card."""
        return self.card(row.n, key=f"command:{run.at}", label=MOVED_TO_BACKGROUND, icon="terminal", command=run.command, **card)

    def _noted_on_move(self, row, detail: str):
        """What happened beside a command that was moved, put on its card; no card is made for a command nothing moved."""
        moved = [kept for kept in row.data.get("cards") or [] if kept.get("label") == MOVED_TO_BACKGROUND and kept.get("state") == "running"]
        return self.card(row.n, key=moved[-1]["key"], detail=detail) if moved else row

    def _mark_primary(self, label: str, **card):
        primary = self.primary_to_read()
        return self.card(primary.n, label=label, tone="good", **card) if primary else None

    def settle_cards(self, plugin: str, key: str, how: str):
        settled = 0
        for row in self.all(completed=True, last=0):
            cards = row.data.get("cards") or []
            waiting = [card for card in cards if card.get("plugin") == plugin and card.get("settle") == key and not card.get("settled")]
            if not waiting:
                continue
            self.update(row.n, cards=[{**card, "tone": "good", "settled": how, "settled_at": time.time()} if card in waiting else card for card in cards])
            settled += len(waiting)
        return settled

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
        standing = [row for row in self.rows.standing_summaries() if not row.get("parent")]
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
