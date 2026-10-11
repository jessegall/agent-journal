import atexit
import copy
import threading
import time
from dataclasses import dataclass, field

from pathlib import Path

from controllers.base import Controller
from engine.record import Record
from resources.base import SYSTEM, Missing
from engine.sessions import Sessions
from resources import types
from controllers.marks import action

KEPT_CARDS = 50
MOVED_TO_BACKGROUND = "Moved a long command to the background"




OFFLINE, IDLE_STATE, WORKING_STATE, SILENT = "offline", "idle", "working", "silent"
REPORT_WITHIN = 30.0


KEEP_FOR = 1.0


@dataclass(frozen=True)
class RowKey:
    root: str
    env: str
    n: int


@dataclass
class Pending:
    """What hooks reported about an agent's row since it was last written, and the state the written row has, which decides when to write again."""

    written_status: str
    written_asking: dict
    written_compacting: bool
    written: float
    delta: dict = field(default_factory=dict)
    action: str = "reported"

    @classmethod
    def of(cls, row) -> "Pending":
        return cls(row.status, row.asking, bool(row.compacting), float(row.updated))

    def changed_state(self) -> bool:
        return (self.delta.get("status", self.written_status), self.delta.get("asking", self.written_asking),
                bool(self.delta.get("compacting", self.written_compacting))) != (self.written_status, self.written_asking, self.written_compacting)

    def is_due(self, now: float) -> bool:
        return self.changed_state() or now - self.written >= KEEP_FOR


class PendingRows:
    """The agent rows hooks have changed and not yet written, so a hook that finds the status as it was costs no write."""

    def __init__(self):
        self.guard = threading.Lock()
        self.rows: dict[RowKey, Pending] = {}

    def key(self, record, n: int) -> RowKey:
        return RowKey(str(record.root), record.env, int(n))

    def holds(self, record, n: int) -> bool:
        with self.guard:
            return self.key(record, n) in self.rows

    def delta(self, record, n: int) -> dict:
        """What a hook changed and the store has not written yet, empty when nothing is held: asked and answered under the one guard, since another thread writes the same row away between a question and its answer."""
        with self.guard:
            held = self.rows.get(self.key(record, n))
            return copy.deepcopy(held.delta) if held else {}

    def opened(self, record, row) -> Pending:
        with self.guard:
            return self.rows.setdefault(self.key(record, row.n), Pending.of(row))

    def pop(self, record, n: int) -> "Pending | None":
        """Takes the held row away and gives it back, or nothing when another thread took it first."""
        with self.guard:
            return self.rows.pop(self.key(record, n), None)

    def due(self, now: float) -> list[RowKey]:
        with self.guard:
            return [key for key, pending in self.rows.items() if now - pending.written >= KEEP_FOR]


PENDING = PendingRows()


def write_pending_rows() -> None:
    """Writes the agent rows whose second is up; the server's loop calls it, so a row is never more than a second behind."""
    for key in PENDING.due(time.time()):
        flushed(key)


def flushed(key: RowKey) -> None:
    from controllers.faults import threw
    try:
        Agents(Record(Path(key.root), key.env), actor=SYSTEM)._flush(key.n)
    except Exception:
        threw(Path(key.root), key.env, "writing an agent row")


def write_all_pending_rows() -> None:
    for key in PENDING.due(float("inf")):
        flushed(key)


atexit.register(write_all_pending_rows)


class Agents(Controller):
    resource = types.AgentRow

    @action
    def by_session(self, session: str):
        return self._of_session(session, self.load)

    def peek_session(self, session: str):
        """The held row of the session, not a copy: for a reader that changes nothing."""
        return self._of_session(session, self.peek)

    def _of_session(self, session: str, read):
        """The row named for the session through `read`; a session with no row, or whose row has gone from the folder, gets a stopped one."""
        found = self.rows.n_of_title(session)
        if found:
            try:
                return read(found)
            except Missing:
                pass
        return self.create(session, status="stopped")

    def load(self, n: int | str):
        row = super().load(n)
        row.data.update(PENDING.delta(self.record, int(n)))
        return row

    def peek(self, n: int | str):
        """The held row with what a hook changed and the store has not written yet, so a reader sees the status and provider the hook reported."""
        held = super().peek(n)
        delta = PENDING.delta(self.record, int(n))
        if not delta:
            return held
        row = held.fork()
        row.data.update(delta)
        return row

    def save(self, r, action: str, **event):
        saved = super().save(r, action, **event)
        PENDING.pop(self.record, r.n)
        return saved

    def _shared(self, session: str):
        memo = self.record.memo
        if memo is None:
            return self.by_session(session)
        if (self.type, session) not in memo:
            memo[self.type, session] = self.by_session(session)
        return memo[self.type, session]

    def saw(self, n: int, fact: dict, **data):
        return self._seen(n, "reported", fact, data)

    def heard(self, n: int, fact: dict, **data):
        """What a hook saw when the prompt was the journal's own line: the row is kept, and the one event says so, which the handlers of a report do not take."""
        return self._seen(n, "heard", fact, data)

    def _seen(self, n: int, action: str, fact: dict, data: dict):
        shaped = self._shaped(data)
        with self.record.locked(self.resource.scope):
            pending = PENDING.opened(self.record, self.rows.peek(int(n)))
            pending.delta.update(shaped)
            pending.action = action
            if pending.is_due(time.time()):
                self._flush(int(n))
            self._emit(int(n), action, **fact)
        row = self.load(n)
        if self.record.memo is not None:
            self.record.memo[self.type, row.title] = row
        return row

    def _flush(self, n: int) -> None:
        """Writes the held row; one whose environment was removed is dropped, since it has no record to be written into."""
        pending = PENDING.pop(self.record, n)
        if pending is None:
            return
        if not self.record.home.is_dir():
            return
        with self.record.locked(self.resource.scope):
            r = super().load(n)
            r.data.update(pending.delta)
            self._checked_and_written(r, pending.action)

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
        return self.peek(n) if n is not None else None

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
