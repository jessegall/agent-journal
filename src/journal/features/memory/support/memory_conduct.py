from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.idle import Idle
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.rule_made import RuleMade


COMPACT = "compact"


class MemoryConduct(Conduct):
    """The memory feature's conduct in every state: at a context mark not taken yet the agent is told to decide what to keep, a write and a stop are held until it has, a fact, rule or reminder whose keyword comes up in what it writes or runs is typed back to it, and a rule the agent made is questioned once."""

    def on_anything_memory_mark(self, event: AgentEvent, settings: Settings) -> Transition:
        feature = memory_feature()
        if event.context is None or not event.session:
            return self.unchanged()
        mark = feature.mark_due(event.context, event.snapshot.of(feature).context_mark)
        return self.unchanged(feature.DECIDE_AT_THE_MARK.create(percent=mark)) if mark else self.unchanged()

    def on_session_started_memory(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.memory.feature import Memory
        stale = event.snapshot.of(Memory).stale
        if event.source == COMPACT or not stale:
            return self.unchanged()
        return self.unchanged(Memory.CHECK_STALE_MEMORY.create(stale_after=settings.of(Memory.STALE_AFTER), stale=", ".join(stale)))

    def on_tool_starting_memory(self, event: ToolStarting, settings: Settings) -> Transition:
        feature = memory_feature()
        if event.subagent or not event.call.writes or not event.snapshot.of(feature).mark_owed:
            return self.unchanged()
        return self.hold(feature.WRITE_HELD_UNTIL_DECIDED.create())

    def on_idle_memory(self, event: Idle, settings: Settings) -> Transition:
        feature = memory_feature()
        owed = event.snapshot.of(feature).mark_owed
        return self.hold(feature.STOPPED_AT_MARK.create(percent=owed)) if owed else self.unchanged()

    def on_anything_memory_whisper(self, event: AgentEvent, settings: Settings) -> Transition:
        feature = memory_feature()
        if not event.words:
            return self.unchanged()
        rows = event.snapshot.of(feature).whispered_by(event.words)
        return self.unchanged().typing(*(feature.MEMORY_WHISPERED_BACK.create(noun=row.noun, n=row.id, text=row.text) for row in rows))

    def on_rule_made_memory(self, event: RuleMade, settings: Settings) -> Transition:
        feature = memory_feature()
        return self.unchanged(feature.DOES_THE_RULE_APPLY_PROJECT_WIDE.create(n=event.row_id)) if event.by_agent else self.unchanged()


def memory_feature():
    from journal.features.memory.feature import Memory
    return Memory
