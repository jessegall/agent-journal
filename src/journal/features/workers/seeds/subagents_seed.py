from journal.features.seed import Seed
from journal.features.workers.support.subagent_entries import SubagentEntries
from journal.models.subagent_state import SubagentState
from journal.repositories.entries import Entries
from journal.repositories.subagents import Subagents
from journal.support.actor import Actor


class SubagentsSeed(Seed):
    """At boot, while no subagent has a row, the subagents dispatched before the journal kept them are written from the record, each session's paired as it was, those whose end it never saw as ended."""

    def __init__(self, entries: Entries, subagents: Subagents) -> None:
        self.entries, self.subagents = entries, subagents

    def run(self) -> None:
        if not self.subagents.is_empty():
            return
        sessions: dict[tuple[int, str], list] = {}
        for entry in self.entries.global_dispatches():
            sessions.setdefault((entry.environment_id, entry.data.get("session_id", "")), []).append(entry)
        for group in sessions.values():
            for subagent in SubagentEntries.paired(group):
                self.subagents.save(subagent.finished(SubagentState.ENDED, subagent.started_at) if subagent.is_running() else subagent, Actor.system())
