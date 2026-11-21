from journal.engine.nudger import NUDGE
from journal.engine.support.stack_history import StackHistory
from journal.models.state_transition import StateTransition
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from tests.stories.builder.nudge_record import NudgeRecord


class JournalLog:
    """What the journal did in the main environment since the step before, read from its entries once the worker thread has settled: the lines the nudger gave, by key and values, and each move of a stack as a path step, the top before, the top after and its cause."""

    def __init__(self, app) -> None:
        self.app, self.last_read_id = app, 0
        self.walked: set[str] = set()

    def new_entries(self) -> tuple[tuple[NudgeRecord, ...], tuple[str, ...]]:
        self.app.runtime().deferred.drain()
        return self.unread_entries()

    def unread_entries(self) -> tuple[tuple[NudgeRecord, ...], tuple[str, ...]]:
        with self.app.container.get(Scope).environment(self.app.container.get(Environments).lookup("main").id):
            unread_entries = self.app.container.get(Entries).later_kind_entries(self.last_read_id, (NUDGE, StackHistory.KIND))
        self.last_read_id = max((entry.row_id for entry in unread_entries), default=self.last_read_id)
        lines = tuple(NudgeRecord(entry.data["key"], entry.data.get("values", {}), entry.data.get("session", "")) for entry in unread_entries if entry.entry_type == NUDGE)
        steps = tuple(self.step(entry) for entry in unread_entries)
        self.walked |= {self.step(entry) for entry in unread_entries if entry.entry_type == StackHistory.KIND and not {"refused", "dropped"} & entry.data.keys()}
        return lines, steps

    def environment_lines(self, environment: str) -> list[NudgeRecord]:
        self.app.runtime().deferred.drain()
        with self.app.container.get(Scope).environment(self.app.container.get(Environments).lookup(environment).id):
            entries = self.app.container.get(Entries).kind_entries_scoped(1000)
        return [NudgeRecord(entry.data["key"], entry.data.get("values", {}), entry.data.get("session", "")) for entry in entries if entry.entry_type == NUDGE]

    @staticmethod
    def step(entry) -> str:
        if entry.entry_type == NUDGE:
            return f"line {entry.data['key']}"
        previous_stack, next_stack = entry.data.get("before") or [{}], entry.data.get("after") or [{}]
        return StateTransition(before_state=previous_stack[-1].get("state", ""), after_state=next_stack[-1].get("state", ""), cause=entry.data.get("cause", "")).kind()
