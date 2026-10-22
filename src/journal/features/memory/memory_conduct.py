from journal.engine.base_state import BaseState
from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.stop import Stop
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.rule_created import RuleCreated


COMPACT = "compact"


class MemoryConduct(Conduct):
    """The memory feature's conduct in every state: at a context mark not taken yet the agent is told to decide what to keep, a write and a stop are held until it has, a fact, rule or reminder whose keyword comes up in what it writes or runs is typed back to it, and a rule the agent made is questioned once."""

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.memory.feature import Memory
        stale = event.data.part(Memory).stale
        if event.source == COMPACT or not stale:
            return self.none()
        return self.none(Memory.CHECK_STALE_MEMORY.create(stale_after=settings.value(Memory.STALENESS_LIMIT), stale=", ".join(stale)))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        feature = memory_feature()
        if event.subagent or not event.call.writes or not event.data.part(feature).threshold_due:
            return self.none()
        return self.refuse(feature.DECISION_EDIT_BLOCK.create())

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        feature = memory_feature()
        obligations = event.data.part(feature).threshold_due
        return self.refuse(feature.UNDECIDED_STOP.create(percent=obligations)) if obligations else self.none()

    def on_agent_event(self, event: AgentEvent, settings: Settings) -> Transition:
        return Transition.merged(self, [hint_check(self, event, settings), threshold_check(self, event, settings)])

    def on_rule_created(self, event: RuleCreated, settings: Settings) -> Transition:
        feature = memory_feature()
        return self.none(feature.RULE_SCOPE_QUESTION.create(n=event.row_id)) if event.agent_origin else self.none()


def memory_feature():
    from journal.features.memory.feature import Memory
    return Memory


def threshold_check(state: BaseState, event: AgentEvent, settings: Settings) -> Transition:
    feature = memory_feature()
    if event.context is None or not event.session:
        return state.none()
    threshold = feature.threshold_due(event.context, event.data.part(feature).context_threshold)
    return state.none(feature.CONTEXT_DECISION.create(percent=threshold)) if threshold else state.none()


def hint_check(state: BaseState, event: AgentEvent, settings: Settings) -> Transition:
    feature = memory_feature()
    if not event.content:
        return state.none()
    rows = event.data.part(feature).hinted(event.content)
    return state.none().typing(*(feature.MEMORY_READ_REQUEST.create(noun=row.noun, n=row.id) for row in rows))
