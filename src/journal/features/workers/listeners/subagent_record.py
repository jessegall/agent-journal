from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.features.workers.support.subagent_entries import SubagentEntries
from journal.models.entry import Entry
from journal.models.subagent import Subagent
from journal.repositories.subagents import Subagents
from journal.support.actor import Actor


class SubagentRecord(Listener[Updated]):
    """Each subagent the agent dispatched is a row, written as each entry that moves it is settled with what the journal answered, so a dispatch the journal refused is never one and the next hook counts the rows as they stand; a retired subagent stays retired until it is sent a message."""

    def __init__(self, entries: SubagentEntries, subagents: Subagents) -> None:
        self.entries, self.subagents = entries, subagents

    def handle(self, event: Updated) -> None:
        if not isinstance(event.model, Entry) or not SubagentEntries.is_dispatch_entry(event.model):
            return
        session = event.model.data.get("session_id", "")
        stored = {s.dispatch: s for s in self.subagents.session_subagents(session)}
        for paired in self.entries.rows(session):
            self.recorded(stored.get(paired.dispatch), paired, Actor.agent(session))

    def recorded(self, stored: Subagent | None, paired: Subagent, actor: Actor) -> None:
        if stored is None:
            self.subagents.save(paired, actor)
            return
        updated = stored.recorded(paired)
        if updated != stored:
            self.subagents.save(updated, actor)
